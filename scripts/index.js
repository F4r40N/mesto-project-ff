function deleteCard(cardElement) {
  cardElement.remove();
}

function createCard(cardData) {
  const template = document.querySelector('#card-template');
  const cardTemplate = template.content.querySelector('.card').cloneNode(true);

  const cardImage = cardTemplate.querySelector('.card__image');
  const cardTitle = cardTemplate.querySelector('.card__title');
  const deleteButton = cardTemplate.querySelector('.card__delete-button');

  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  deleteButton.addEventListener('click', () => {
    deleteCard(cardTemplate);
  });

  return cardTemplate;
}

function renderCards(cardsArray) {
  const placesList = document.querySelector('.places__list');

  cardsArray.forEach((cardData) => {
    const cardElement = createCard(cardData);
    placesList.appendChild(cardElement);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderCards(initialCards);
});