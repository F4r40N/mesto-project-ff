// modal.js
export function openModal(popup) {
  if (!popup) return;
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', closeByEsc);
}

export function closeModal(popup) {
  if (!popup) return;
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', closeByEsc);
}

function closeByEsc(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup.popup_is-opened');
    if (openedPopup) {
      closeModal(openedPopup);
    }
  }
}

export function setCloseModalByOverlay(popup) {
  if (!popup) return;
  popup.addEventListener('mousedown', (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
}
