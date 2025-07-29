function Validator(options) {
  //lay element cua form can validate
  var formElement = document.querySelector(options.form);

  //ham thuc hien validate
  function validate(inputElement, rule) {
    var errorMessage = rule.test(inputElement.value);
    var errorElement = inputElement.parentElement.querySelector(
      options.errorSelector,
    );

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add('invalid');
    } else {
      errorElement.innerText = '';
      inputElement.parentElement.classList.remove('invalid');
    }
  }

  if (formElement) {
    options.rules.forEach((rule) => {
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        //xu ly truong hop blur ra khoi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //xu ly truong hop moi khi nguoi dung nhap vao input
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            options.errorSelector,
          );
          errorElement.innerText = '';
          inputElement.parentElement.classList.remove('invalid');
        };
      }
    });
  }
}

Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : 'Please fill out';
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
var passwordInput = document.getElementById('password');

Validator.isConfirmed = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value === passwordInput.value
        ? undefined
        : 'Passwords do not match';
    },
  };
};
