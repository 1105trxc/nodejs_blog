// src/public/js/validator.js (PHIÊN BẢN SỬA LỖI ĐỂ CHẠY ĐƯỢC)

function Validator(options) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  let selectorRules = {};
  const formElement = document.querySelector(options.form);

  if (formElement) {
    // Xử lý khi submit form
    formElement.onsubmit = function (e) {
      e.preventDefault();
      let isFormValid = true;

      // Lặp qua từng rule và validate
      options.rules.forEach(function (rule) {
        const inputElement = formElement.querySelector(rule.selector);
        const isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        console.log('Form is valid. Submitting...');
        formElement.submit();
      } else {
        console.log('Form is invalid.');
      }
    };

    // Lặp qua mỗi rule và xử lý
    options.rules.forEach(function (rule) {
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      const inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };
        inputElement.oninput = function () {
          const errorElement = getParent(
            inputElement,
            options.formGroupSelector,
          ).querySelector(options.errorSelector);
          errorElement.innerText = '';
          getParent(inputElement, options.formGroupSelector).classList.remove(
            'invalid',
          );
        };
      });
    });
  }

  // Hàm thực hiện validate
  function validate(inputElement, rule) {
    const errorElement = getParent(
      inputElement,
      options.formGroupSelector,
    ).querySelector(options.errorSelector);
    let errorMessage;
    const rules = selectorRules[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      let valueToValidate;
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          const checkedElement = formElement.querySelector(
            rule.selector + ':checked',
          );
          valueToValidate = checkedElement ? checkedElement.value : '';
          break;
        default:
          valueToValidate = inputElement.value;
      }
      errorMessage = rules[i](valueToValidate);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        'form-control-color',
      );
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove(
        'form-control-color',
      );
    }
    return !errorMessage;
  }
}

// === CÁC RULE CỦA BẠN (ĐÃ ĐƯỢC SỬA LẠI CHO ĐÚNG LOGIC) ===

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return typeof value === 'string'
        ? value.trim()
          ? undefined
          : message || 'This field is required.'
        : value
          ? undefined
          : message || 'This field is required.';
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || 'Please enter a valid email.';
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `Please enter at least ${min} characters.`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || 'Passwords do not match.';
    },
  };
};
