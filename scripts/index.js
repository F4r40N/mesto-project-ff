function createCard(initialCards) {
    const cardTemplate = document.querySelector('#card-template').content.cloneNode(true);
    
    cardTemplate.querySelector('.card__title').textContent = initialCards.name;
    cardTemplate.querySelector('.card__image').src = initialCards.link;
    cardTemplate.querySelector('.card__image').alt = initialCards.name;

    const deleteButton = cardTemplate.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', function () {
        const cardToDelete = deleteButton.closest('.card');
        deleteCard(cardToDelete);
    });

    return cardTemplate;
}

function deleteCard(cardDelete) {
    cardDelete.remove();
}

function renderCards(cardArray) {
    const placesList = document.querySelector('.places__list');
    
    cardArray.forEach((initialCards) => {
        const cardElement = createCard(initialCards);
        placesList.append(cardElement);
    });
}

renderCards(initialCards);