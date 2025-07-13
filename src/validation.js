// validation.js

// Показать ошибку для input
export function showInputError(input, message, config) {
  const errorElement = input.nextElementSibling;
  input.classList.add(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

// Скрыть ошибку для input
export function hideInputError(input, config) {
  const errorElement = input.nextElementSibling;
  input.classList.remove(config.inputErrorClass);
  if (errorElement) {
    errorElement.textContent = '';
  }
}

// Проверка валидности input с кастомной логикой
export function validateInput(input, config) {
  input.setCustomValidity('');

  // Проверка паттерна - если patternMismatch, ставим кастомное сообщение из data-error-message
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.errorMessage || '');
  } else {
    input.setCustomValidity('');
  }

  // Дополнительная проверка для полей name, description, place-name на разрешённые символы
  if (['name', 'description', 'place-name'].includes(input.name)) {
    // Регулярное выражение для проверки допустимых символов
    const allowedPattern = /^[a-zA-Zа-яА-ЯёЁ \-]+$/;
    if (input.value.length > 0 && !allowedPattern.test(input.value)) {
      input.setCustomValidity(input.dataset.errorMessage || 'Разрешены только латинские, кириллические буквы, знаки дефиса и пробелы');
    }
  }

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
