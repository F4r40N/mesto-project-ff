// validation.js
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);

    function showInputError(input, message) {
      const errorElem = input.nextElementSibling;
      input.classList.add(config.inputErrorClass);
      if (errorElem) {
        errorElem.textContent = message;
      }
    }

    function hideInputError(input) {
      const errorElem = input.nextElementSibling;
      input.classList.remove(config.inputErrorClass);
      if (errorElem) {
        errorElem.textContent = '';
      }
    }

    function validateInput(input) {
      input.setCustomValidity('');

      if (input.name === 'place-name') {
        const pattern = input.getAttribute('pattern');
        const value = input.value;

        if (value.length > 0 && pattern) {
          const regex = new RegExp(pattern);
          if (!regex.test(value)) {
            const customMessage = input.dataset.errorMessage || 'Неверный формат';
            input.setCustomValidity(customMessage);
          }
        }
      }

      if (!input.validity.valid) {
        showInputError(input, input.validationMessage);
        return false;
      }

      hideInputError(input);
      return true;
    }

    function hasInvalidInput() {
      return inputs.some(input => !validateInput(input));
    }

    function toggleButtonState() {
      if (hasInvalidInput()) {
        button.disabled = true;
        button.classList.add(config.inactiveButtonClass);
      } else {
        button.disabled = false;
        button.classList.remove(config.inactiveButtonClass);
      }
    }

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateInput(input);
        toggleButtonState();
      });
    });

    toggleButtonState();
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
}
