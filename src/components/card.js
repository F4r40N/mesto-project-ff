// card.js
import { putLike, removeLike, deleteCard } from '../components/api.js';

export function createCard(cardData, handleCardClick, currentUserId) {
  const cardTemplate = document.getElementById('card-template').content.querySelector('.places__item');
  const cardElement = cardTemplate.cloneNode(true);

  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  // Активный лайк
  if (cardData.likes.some(user => user._id === currentUserId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');

    (isLiked ? removeLike(cardData._id) : putLike(cardData._id))
      .then(updatedCard => {
        const isNowLiked = updatedCard.likes.some(user => user._id === currentUserId);
        likeButton.classList.toggle('card__like-button_is-active', isNowLiked);
        likeCountElement.textContent = updatedCard.likes.length;
      })
      .catch(err => {
        console.error('Ошибка при обновлении лайка:', err);
        alert('Не удалось обновить лайк');
      });
  });

  // Удаление карточки
  if (!cardData.owner || cardData.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
        deleteCard(cardData._id)
          .then(() => {
            cardElement.remove();
          })
          .catch(err => {
            console.error(err);
            alert('Не удалось удалить карточку');
          });
      }
    });
  }

  cardImage.addEventListener('click', () => {
    handleCardClick(cardData);
  });

  return cardElement;
}
