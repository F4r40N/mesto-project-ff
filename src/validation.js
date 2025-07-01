// validation.js
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => {
      if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('popup__error')) {
        const errorElem = document.createElement('span');
        errorElem.classList.add('popup__error');
        errorElem.style.color = 'red';
        errorElem.style.fontSize = '12px';
        errorElem.style.marginTop = '4px';
        input.insertAdjacentElement('afterend', errorElem);
      }
    });

    function validateInput(input) {
      const errorElem = input.nextElementSibling;
      const value = input.value.trim();
      const name = input.name;

      if (!value) {
        input.setCustomValidity('Это обязательное поле');
        errorElem.textContent = input.validationMessage;
        input.classList.add(config.inputErrorClass);
        return false;
      }

      const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s-]{2,40}$/;
      const descriptionPattern = /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?"'()-]{2,200}$/;
      const placeNamePattern = /^[a-zA-Zа-яА-ЯёЁ0-9\s-]{2,30}$/;
      const imageUrlPattern = /^https?:\/\/([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!'()*+,;=]*)*\.(jpg|jpeg|png|gif|svg|webp)$/i;
      const avatarUrlPattern = /^https?:\/\/.+$/i;

      if (form.name === 'edit-profile') {
        if (name === 'name') {
          if (!namePattern.test(value)) {
            input.setCustomValidity('Имя должно содержать от 2 до 40 символов');
            errorElem.textContent = input.validationMessage;
            input.classList.add(config.inputErrorClass);
            return false;
          }
        }
        if (name === 'description') {
          if (!descriptionPattern.test(value)) {
            input.setCustomValidity('Описание должно содержать от 2 до 200 символов');
            errorElem.textContent = input.validationMessage;
            input.classList.add(config.inputErrorClass);
            return false;
          }
        }
      }

      if (form.name === 'new-place') {
        if (name === 'place-name') {
          if (!placeNamePattern.test(value)) {
            input.setCustomValidity('Название должно содержать от 2 до 30 символов');
            errorElem.textContent = input.validationMessage;
            input.classList.add(config.inputErrorClass);
            return false;
          }
        }
        if (name === 'link') {
          if (!imageUrlPattern.test(value)) {
            input.setCustomValidity('Введите корректный URL изображения');
            errorElem.textContent = input.validationMessage;
            input.classList.add(config.inputErrorClass);
            return false;
          }
        }
      }

      if (form.name === 'avatar-update') {
        if (name === 'avatar-link') {
          if (!avatarUrlPattern.test(value)) {
            input.setCustomValidity('Введите корректный URL');
            errorElem.textContent = input.validationMessage;
            input.classList.add(config.inputErrorClass);
            return false;
          }
        }
      }

      input.setCustomValidity('');
      errorElem.textContent = '';
      input.classList.remove(config.inputErrorClass);
      return true;
    }

    function hasInvalidInput() {
      return inputs.some(input => !validateInput(input));
    }

    function toggleButtonState() {
      if (hasInvalidInput()) {
        button.disabled = true;
        button.classList.add(config.inactiveButtonClass);
        button.style.backgroundColor = '#C4C4C4';
        button.style.cursor = 'default';
      } else {
        button.disabled = false;
        button.classList.remove(config.inactiveButtonClass);
        button.style.backgroundColor = '';
        button.style.cursor = 'pointer';
      }
    }

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateInput(input);
        toggleButtonState();
      });
    });

    toggleButtonState();

    form.addEventListener('submit', evt => {
      if (hasInvalidInput()) {
        evt.preventDefault();
        inputs.forEach(input => validateInput(input));
        toggleButtonState();
      }
    });
  });
}

export function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const button = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.setCustomValidity('');
    const errorElem = input.nextElementSibling;
    if (errorElem && errorElem.classList.contains('popup__error')) {
      errorElem.textContent = '';
    }
    input.classList.remove(config.inputErrorClass);
  });

  button.disabled = true;
  button.classList.add(config.inactiveButtonClass);
  button.style.backgroundColor = '#C4C4C4';
  button.style.cursor = 'default';
}

export function toggleButtonState(button, isEnabled) {
  if (isEnabled) {
    button.disabled = false;
    button.classList.remove('popup__button_disabled');
    button.style.backgroundColor = '';
    button.style.cursor = 'pointer';
  } else {
    button.disabled = true;
    button.classList.add('popup__button_disabled');
    button.style.backgroundColor = '#C4C4C4';
    button.style.cursor = 'default';
  }
}
