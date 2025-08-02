function Validator(options) {
  var selectorRules = {};

  //Lay element cha
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  //lay element cua form can validate
  var formElement = document.querySelector(options.form);

  //ham thuc hien validate
  function validate(inputElement, rule) {
    var errorMessage;
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector,
    ).querySelector(options.errorSelector);

    //Lay ra cac rule cua selector
    var rules = selectorRules[rule.selector];

    //Lap qua tung rule & kiem tra
    //Neu co loi thi dung viec kiem tra
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case 'radio':
        case 'checkbox':
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ':checked'),
          );
      }

      if (errorMessage) {
        break;
      }
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        'invalid',
      );
    } else {
      errorElement.innerText = '';
      getParent(inputElement, options.formGroupSelector).classList.remove(
        'invalid',
      );
    }
  }

  if (isFormValid) {
    //Case submit voi Js
    if (typeof options.onsubmit === 'function') {
      var enableInputs = formElement.querySelectorAll();
      var formValues = Array.from(enableInputs).reduce(function (values) {
        values[input.name] = input.value;
        return values;
      }, {});
      options.onSubmit(formValues);
    }

    //Case submit voi hanh vi mac dinh
    else {
      formElement.submit();
    }
  }

  //Lap qua moi rule va xu ly
  if (formElement) {
    options.rules.forEach((rule) => {
      //Luu lai cac rule cua moi input
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      var inputElements = formElement.querySelectorAll(rule.selector);
      Array.from(inputElements).forEach(function (inputElement) {
        //xu ly truong hop blur ra khoi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //xu ly truong hop moi khi nguoi dung nhap vao input
        inputElement.oninput = function () {
          var errorElement = getParent(
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
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || 'Please fill out';
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : 'Please fill out email';
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : 'Please fill out least 6 characters!';
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : 'Passwords do not match';
    },
  };
};
