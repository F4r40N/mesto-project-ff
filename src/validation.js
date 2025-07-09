// validation.js

// Показать ошибку для input
export function showInputError(input, message, config) {
  const errorElem = input.nextElementSibling;
  input.classList.add(config.inputErrorClass);
  if (errorElem) {
    errorElem.textContent = message;
  }
}

// Скрыть ошибку для input
export function hideInputError(input, config) {
  const errorElem = input.nextElementSibling;
  input.classList.remove(config.inputErrorClass);
  if (errorElem) {
    errorElem.textContent = '';
  }
}

// Проверить валидность input с кастомной логикой
export function validateInput(input, config) {
  input.setCustomValidity('');

  // Кастомная проверка для поля "name"
  if (input.name === 'name' || input.name === 'place-name') {
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

  // Для поля description проверяем minlength и maxlength через стандартную валидацию, кастомное сообщение не требуется

  if (!input.validity.valid) {
    showInputError(input, input.validationMessage, config);
    return false;
  }

  hideInputError(input, config);
  return true;
}

// Проверить, есть ли невалидные input в форме
export function hasInvalidInput(inputs, config) {
  return inputs.some(input => !validateInput(input, config));
}

// Деактивировать кнопку отправки
export const disableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Активировать кнопку отправки
export const enableSubmitButton = (buttonElement, config) => {
  buttonElement.disabled = false;
  buttonElement.classList.remove(config.inactiveButtonClass);
};

// Переключить состояние кнопки в зависимости от валидности формы
export function toggleButtonState(inputs, button, config) {
  if (hasInvalidInput(inputs, config)) {
    disableSubmitButton(button, config);
  } else {
    enableSubmitButton(button, config);
  }
}

// Основная функция валидации для всех форм на странице
export function enableValidation(config) {
  const forms = Array.from(document.querySelectorAll(config.formSelector));

  forms.forEach(form => {
    const inputs = Array.from(form.querySelectorAll(config.inputSelector));
    const button = form.querySelector(config.submitButtonSelector);

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        validateInput(input, config);
        toggleButtonState(inputs, button, config);
      });
    });

    // Инициализация состояния кнопки при загрузке
    toggleButtonState(inputs, button, config);
  });
}

// Очистка ошибок и деактивация кнопки при открытии формы
export function clearValidation(formElement, config) {
  const inputs = Array.from(formElement.querySelectorAll(config.inputSelector));
  const button = formElement.querySelector(config.submitButtonSelector);

  inputs.forEach(input => {
    input.setCustomValidity('');
    hideInputError(input, config);
  });

  disableSubmitButton(button, config);
}
