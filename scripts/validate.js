// конфигурация для нашего проекта
const validationConfig = {
  formSelector: 'form',
  inputSelector: 'input',
  submitButtonSelector: 'input[type="submit"]',
  inactiveButtonClass: '.disabled',
  inputErrorClass: "invalid",
};

const showInputError = (
  inputElement,
  errorElement,
  inputErrorClass,
) => {
  inputElement.classList.add(inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
};

const hideInputError = (
  inputElement,
  errorElement,
  inputErrorClass,
) => {
  errorElement.textContent = '';
  inputElement.classList.remove(inputErrorClass);
};

const checkInputValidity = (
  inputElement,
  inputErrorClass,
) => {
  const errorElement = inputElement.nextElementSibling;

  if (!inputElement.validity.valid) {
    showInputError(inputElement, errorElement, inputErrorClass);
  } else {
    hideInputError(inputElement, errorElement, inputErrorClass);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const hasEmptyInput = (inputList) => {
  return inputList.every((inputElement) => {
    return inputElement.value.lenght === 0;
  });
};

const isFormNotValid = (inputList) => {
  if (hasInvalidInput(inputList) || hasEmptyInput(inputList)) {
    return true;
  } else {
    return false;
  }
};

const disableButtonSubmit = (buttonElement, inactiveButtonClass) => {
  buttonElement.setAttribute('disabled', true);
  buttonElement.classList.add(inactiveButtonClass);
};

const enableButtonSubmit = (buttonElement, inactiveButtonClass) => {
  buttonElement.removeAttribute('disabled');
  buttonElement.classList.remove(inactiveButtonClass);
};

function toggleButtonState(inputList, buttonElement, inactiveButtonClass) {
  if (isFormNotValid(inputList)) {
    disableButtonSubmit(buttonElement, inactiveButtonClass);
  } else {
    enableButtonSubmit(buttonElement, inactiveButtonClass);
  }
}

const setEventListeners = (
  formElement,
  inputSelector,
  submitButtonSelector,
  inputErrorClass,
  inactiveButtonClass
) => {
  formElement.addEventListener('submit', () => {
    disableButtonSubmit(
      buttonElement,
      inactiveButtonClass
    );
  });

  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);

  toggleButtonState(inputList, buttonElement, inactiveButtonClass);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkInputValidity(
        inputElement,
        inputErrorClass,
      );
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
};

function enableValidation(config) {
  const formList = document.querySelectorAll(config.formSelector);
  formList.forEach((formElement) => {
    setEventListeners(
      formElement,
      config.inputSelector,
      config.submitButtonSelector,
      config.inputErrorClass,
      config.inactiveButtonClass
    );
  });
}

enableValidation(validationConfig);
