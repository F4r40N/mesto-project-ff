// index.js
import './index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal, setCloseModalByOverlay } from './components/modal.js';
import { enableValidation, clearValidation, toggleButtonState } from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  editUserProfile,
  addNewCard,
  deleteCard,
  updateUserAvatar
} from './components/api.js';

// DOM элементы
const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupAvatar = document.querySelector('.popup_type_avatar');
const popupImage = document.querySelector('.popup_type_image');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileAvatarButton = document.querySelector('.profile__image');

const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');

const formEdit = popupEdit.querySelector('.popup__form');
const nameInput = formEdit.querySelector('.popup__input_type_name');
const jobInput = formEdit.querySelector('.popup__input_type_description');

const formAdd = popupAdd.querySelector('.popup__form');
const placeInput = formAdd.querySelector('.popup__input_type_card-name');
const linkInput = formAdd.querySelector('.popup__input_type_url');

const avatarForm = popupAvatar.querySelector('.popup__form');
const avatarInput = avatarForm.querySelector('.popup__input_type_link');
const avatarSubmitBtn = avatarForm.querySelector('.popup__button');

const cardsContainer = document.querySelector('.places__list');

const popupImageImg = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

let currentUserId = null;

function renderCard(cardData) {
  const cardElement = createCard(cardData, (data) => {
    popupImageImg.src = data.link;
    popupImageImg.alt = data.name;
    popupImageCaption.textContent = data.name;
    openModal(popupImage);
  }, currentUserId);

  const deleteButton = cardElement.querySelector('.card__delete-button');
  if (deleteButton && deleteButton.style.display !== 'none') {
    deleteButton.addEventListener('click', () => {
      deleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch(err => console.error(err));
    });
  }

  cardsContainer.prepend(cardElement);
}

// Обработчики открытия попапов
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;

  clearValidation(formEdit, validationConfig);
  toggleButtonState(formEdit.querySelector('.popup__button'), true);

  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  formAdd.reset();

  clearValidation(formAdd, validationConfig);
  toggleButtonState(formAdd.querySelector('.popup__button'), false);

  openModal(popupAdd);
});

profileAvatarButton.addEventListener('mouseenter', () => {
  profileAvatar.classList.add('profile__image_hovered');
});
profileAvatarButton.addEventListener('mouseleave', () => {
  profileAvatar.classList.remove('profile__image_hovered');
});

profileAvatarButton.addEventListener('click', () => {
  avatarForm.reset();

  clearValidation(avatarForm, validationConfig);
  toggleButtonState(avatarSubmitBtn, false);

  openModal(popupAvatar);
});

// Закрытие попапов по кнопке закрытия
document.querySelectorAll('.popup__close').forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

// Обработчики форм
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitBtn = formEdit.querySelector('.popup__button');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Сохранение...';
  submitBtn.disabled = true;

  editUserProfile({ name: nameInput.value, about: jobInput.value })
    .then(userData => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch(err => console.error(err))
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
});

formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitBtn = formAdd.querySelector('.popup__button');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Создание...';
  submitBtn.disabled = true;

  addNewCard({ name: placeInput.value, link: linkInput.value })
    .then(newCard => {
      renderCard(newCard);
      closeModal(popupAdd);
      formAdd.reset();
    })
    .catch(err => console.error(err))
    .finally(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const originalText = avatarSubmitBtn.textContent;
  avatarSubmitBtn.textContent = 'Сохранение...';
  avatarSubmitBtn.disabled = true;

  updateUserAvatar(avatarInput.value)
    .then(userData => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch(err => console.error(err))
    .finally(() => {
      avatarSubmitBtn.textContent = originalText;
      avatarSubmitBtn.disabled = false;
    });
});

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach(renderCard);
  })
  .catch(err => console.error(err));

// Валидация
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error'
};

enableValidation(validationConfig);

// Закрытие по оверлею
[popupAdd, popupEdit, popupAvatar, popupImage].forEach(popup => {
  setCloseModalByOverlay(popup);
});
