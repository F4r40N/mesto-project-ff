// card.js
import { putLike, removeLike } from '../components/api.js';

export function createCard(cardData, handleCardClick, currentUserId) {
  const cardTemplate = document.getElementById('card-template').content.querySelector('.places__item');
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElem = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElem.textContent = cardData.likes.length;

  // Лайк
  if (cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    (isLiked ? removeLike(cardData._id) : putLike(cardData._id))
      .then(updatedCard => {
        const isNowLiked = updatedCard.likes.some(user => user._id === currentUserId);
        likeButton.classList.toggle('card__like-button_is-active', isNowLiked);
        likeCountElem.textContent = updatedCard.likes.length;
      })
      .catch(err => {
        console.error('Ошибка при обновлении лайка:', err);
      });
  });

  // Удаление кнопки, если владелец не текущий пользователь
  if (!cardData.owner || cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  }

  // Клик по картинке — открыть попап с картинкой
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  return cardElement;
}
