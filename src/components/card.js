export function createCard(cardData, handleImageClick) {
    const template = document.querySelector('#card-template');
    const cardTemplate = template.content.querySelector('.card').cloneNode(true);

    const cardImage = cardTemplate.querySelector('.card__image');
    const cardTitle = cardTemplate.querySelector('.card__title');
    const deleteButton = cardTemplate.querySelector('.card__delete-button');
    const likeButton = cardTemplate.querySelector('.card__like-button');

    cardTitle.textContent = cardData.name;
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;

    deleteButton.addEventListener('click', () => {
    cardTemplate.remove();
    });

    likeButton.addEventListener('click', () => {
    likeButton.classList.toggle('card__like-button_is-active');
});

cardImage.addEventListener('click', () => {
    handleImageClick(cardData);
});

return cardTemplate;
}