// index.js
import './index.css';
import { createCard } from './components/card.js';
import { openModal, closeModal, setCloseModalByOverlay } from './components/modal.js';
import { enableValidation, clearValidation } from './validation.js';
import {
  getUserInfo,
  getInitialCards,
  editUserProfile,
  addNewCard,
  updateUserAvatar
} from './components/api.js';

// DOM элементы
const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupAvatar = document.getElementById('popup-avatar');
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
const avatarSubmitButton = avatarForm.querySelector('.popup__button');

const cardsContainer = document.querySelector('.places__list');

const popupImageImg = popupImage.querySelector('.popup__image');
const popupImageCaption = popupImage.querySelector('.popup__caption');

let currentUserId = null;

// Функция для открытия просмотра карточки
function handleCardClick(data) {
  popupImageImg.src = data.link;
  popupImageImg.alt = data.name;
  popupImageCaption.textContent = data.name;
  openModal(popupImage);
}

// Рендер карточки при добавлении новой - prepend
function renderCardPrepend(cardData) {
  const cardElement = createCard(cardData, handleCardClick, currentUserId);
  cardsContainer.prepend(cardElement);
}

// Рендер всех карточек при загрузке - append
function renderCardAppend(cardData) {
  const cardElement = createCard(cardData, handleCardClick, currentUserId);
  cardsContainer.append(cardElement);
}

// Обработчики открытия попапов
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;

  clearValidation(formEdit, validationConfig);

  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  formAdd.reset();

  clearValidation(formAdd, validationConfig);

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

  openModal(popupAvatar);
});

// Закрытие попапов по кнопке закрытия
document.querySelectorAll('.popup__close, .popup__close-button').forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

// Обработчики форм
formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = formEdit.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  submitButton.disabled = true;

  editUserProfile({ name: nameInput.value, about: jobInput.value })
    .then(userData => {
      profileName.textContent = userData.name;
      profileJob.textContent = userData.about;
      closeModal(popupEdit);
    })
    .catch(err => {
      console.error(err);
      alert('Ошибка обновления профиля');
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const submitButton = formAdd.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';
  submitButton.disabled = true;

  addNewCard({ name: placeInput.value, link: linkInput.value })
    .then(newCard => {
      renderCardPrepend(newCard);
      closeModal(popupAdd);
      formAdd.reset();
    })
    .catch(err => {
      console.error(err);
      alert('Ошибка добавления карточки');
    })
    .finally(() => {
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const originalText = avatarSubmitButton.textContent;
  avatarSubmitButton.textContent = 'Сохранение...';
  avatarSubmitButton.disabled = true;

  updateUserAvatar(avatarInput.value)
    .then(userData => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModal(popupAvatar);
      avatarForm.reset();
    })
    .catch(err => {
      console.error(err);
      alert('Ошибка обновления аватара');
    })
    .finally(() => {
      avatarSubmitButton.textContent = originalText;
      avatarSubmitButton.disabled = false;
    });
});

// Загрузка данных пользователя и карточек
Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileName.textContent = userData.name;
    profileJob.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;

    cards.forEach(renderCardAppend);
  })
  .catch(err => {
    console.error(err);
    alert('Ошибка загрузки данных');
  });

// Валидация
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
};

enableValidation(validationConfig);

// Закрытие по оверлею
[popupAdd, popupEdit, popupAvatar, popupImage].forEach(popup => {
  setCloseModalByOverlay(popup);
});
