import '../src/index.css'
import initialCards from './cards.js';
import { createCard } from './components/card.js';
import { openModal, closeModal, setCloseModalByOverlay } from './components/modal.js';

// DOM-элементы
const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const popupEdit = document.querySelector('.popup_type_edit');
const popupAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const popupImageElement = popupImage.querySelector('.popup__image');
const popupCaption = popupImage.querySelector('.popup__caption');

const formEdit = popupEdit.querySelector('.popup__form');
const nameInput = formEdit.querySelector('.popup__input_type_name');
const jobInput = formEdit.querySelector('.popup__input_type_description');
const profileName = document.querySelector('.profile__title');
const profileJob = document.querySelector('.profile__description');

const formAdd = popupAdd.querySelector('.popup__form');
const placeInput = formAdd.querySelector('.popup__input_type_card-name');
const linkInput = formAdd.querySelector('.popup__input_type_url');

const placesList = document.querySelector('.places__list');

// Функции
function handleImageClick(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openModal(popupImage);
}

function renderCard(cardData) {
  const cardElement = createCard(cardData, handleImageClick);
  placesList.prepend(cardElement);
}

// Обработчики
profileEditButton.addEventListener('click', () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileJob.textContent;
  openModal(popupEdit);
});

profileAddButton.addEventListener('click', () => {
  formAdd.reset();
  openModal(popupAdd);
});

formEdit.addEventListener('submit', (evt) => {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;
  closeModal(popupEdit);
  formEdit.reset();
});

formAdd.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const newCard = {
    name: placeInput.value,
    link: linkInput.value
  };
  renderCard(newCard);
  closeModal(popupAdd);
  formAdd.reset();
});

// Закрытие попапов по крестику
document.querySelectorAll('.popup__close').forEach((button) => {
  const popup = button.closest('.popup');
  button.addEventListener('click', () => closeModal(popup));
});

// Закрытие по оверлею
document.querySelectorAll('.popup').forEach((popup) => {
  setCloseModalByOverlay(popup);
});

// Инициализация карточек
initialCards.forEach(renderCard);