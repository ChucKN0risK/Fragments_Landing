// CREATE ELEMENT
// var newEl = document.createElement('div');

// GET ATTRIBUTE
// document.querySelector('.el').setAttribute('key', 'value');
// document.querySelector('.el').getAttribute('key');

// ADD/REMOVE/TOGGLE CLASS
// document.querySelector('.el').classList.add('class');
// document.querySelector('.el').classList.remove('class');
// document.querySelector('.el').classList.toggle('class');

// REMOVE
// remove('.el');

// function remove(el) {
//   var toRemove = document.querySelector(el);
//   toRemove.parentNode.removeChild(toRemove);
// }

// PARENT
// document.querySelector('.el').parentNode;

// PREV/NEXT ELEMENT
// document.querySelector('.el').previousElementSibling;
// document.querySelector('.el').nextElementSibling;

document.addEventListener('DOMContentLoaded', function() {

    var formValidator = {
        init: function(el) {
            this._el = document.querySelector(el);
            this._elements = this._el.querySelectorAll('input[type="text"], input[type="email"], input[type="radio"], select, textarea');
            this._validateButton = this._el.querySelector('button[type="submit"]');
            this.errors = [];
            this.elementsValidityRules = {};
            this.data = {};
            this.isValid = false;

            this.constructValidityRules();
            this.setElementsMarker();
            this.initFormErrors();
            this.events();
        },
        events: function() {
            var _this = this;
            var ruleValue;

            Array.prototype.forEach.call(this._elements, function(el, i) {

                if (el.type !== 'radio' && el.type !== 'checkbox') {
                    el.addEventListener('blur', function() {
                        _this.inputInteractedWith(el);

                        // For each elements validityRule of our form elements we
                        // check if its ruleValue is verified
                        for (rule in _this.elementsValidityRules[el.classList[0]]) {
                            ruleValue = _this.elementsValidityRules[el.classList[0]][rule];

                            switch (rule) {
                                case 'required':
                                    _this.handleError(el, _this.checkIfRequired(ruleValue, el.value, el.type, el))
                                    if (el.nodeName == 'SELECT') {
                                        _this.handleError(el, _this.checkOptionSelected(el))
                                    }
                                    break;
                                case 'maxlength':
                                    _this.handleError(el, _this.checkMaxLength(ruleValue, el.value, el.type))
                                    break;
                                case 'pattern':
                                    _this.handleError(el, _this.checkPattern(ruleValue, el.value, el.type))
                                    break;
                            }
                        }

                        if (_this.errors.length == 0) {
                            _this.isValid = true;
                        }
                    });
                } else {
                    el.addEventListener('click', function() {
                        _this.inputInteractedWith(el);

                        // For each elements validityRule of our form elements we
                        // check if its ruleValue is verified
                        for (rule in _this.elementsValidityRules[el.classList[0]]) {
                            ruleValue = _this.elementsValidityRules[el.classList[0]][rule];

                            switch (rule) {
                                case 'required':
                                    _this.handleError(el, _this.checkIfRequired(ruleValue, el.value, el.type, el))
                                    if (el.type == 'radio' || el.type == 'checkbox') {
                                        _this.handleError(el, _this.checkRadioChecked(_this, el.getAttribute('name')))
                                    }
                                    break;
                            }
                        }

                        if (_this.errors.length == 0) {
                            _this.isValid = true;
                        }
                    });
                }
            });

            this._el.addEventListener('submit', function(event) {
                _this.constructData(_this);
                _this.send(_this, event);
            }, false);
        },
        constructValidityRules: function() {
            var _this = this;

            // Our 'elementsValidityRules' object is filled
            // with the elements composing our form and their 
            // associated validity rules (HTML attributes)
            Array.prototype.forEach.call(this._elements, function(el, i) {
                // For each of our elements in our form we create a 
                // property in the 'elementsValidityRules' object
                // set to the 'js-class' of each element.
                // caveat : the js-class is not always the first class
                _this.elementsValidityRules[el.classList[0]] = {}

                // As we set on all of our form elements a 'required'
                // attribute they will all be set in our 'elementsValidityRules'
                // object. The 'pattern' attribute is used on input[type='text'] and
                // input[type='mail']. The 'maxlength' is used on a textarea.
                if (el.hasAttribute('required')) {
                    _this.elementsValidityRules[el.classList[0]] = {
                        required: true
                    }
                    if (el.hasAttribute('pattern')) {
                        _this.elementsValidityRules[el.classList[0]] = {
                            required: true,
                            pattern: el.getAttribute('pattern')
                        }
                    } else if (el.hasAttribute('maxlength')) {
                        _this.elementsValidityRules[el.classList[0]] = {
                            required: true,
                            maxlength: el.getAttribute('maxlength')
                        }
                    }
                }
            });
        },
        // For every element in our form we add a 'data-element' 
        // with a value corresponding to the index of the element 
        // in our form. These index will be used by the handleError()
        // to add or remove the element of the errors[].
        setElementsMarker: function() {
            Array.prototype.forEach.call(this._elements, function(el, i) {
                if (el.hasAttribute('required')) {
                    el.setAttribute('data-element', i)
                }
            });
        },
        // This will add a 'touched' class to the element.
        // On this class are applied several styles corresponding
        // to the element state (invalid or valid)
        // Dir: scss/components/_inputs.scss
        inputInteractedWith: function(el) {
            el.classList.add('touched');
        },
        // According to the input text/mail/radio we check if the user has
        // given a value. If it's not checkIfRequired() return 'false' and we
        // add the element in the errors[].
        checkIfRequired: function(ruleValue, inputValue, inputType, el) {
            // We check if the input text/mail value is not empty.
            // If the value exists we return 'true', if it's empty we return 'false'
            if (inputType == 'text' || inputType == 'email' || inputType == 'textarea') {
                return inputValue ? true : false;
                // If the reset radio in the item selector isn't checked
                // it means the user chose another radio input and we return 'true'.
            } else if (inputType == 'radio') {
                // var resetRadioInput = this._el.querySelector('input[disabled]')
                return el.checked ? true : false
            }
        },
        checkMaxLength: function(ruleValue, inputValue, inputType) {
            return inputValue.length <= ruleValue ? true : false
        },
        checkOptionSelected: function(el) {
            return el.options[el.selectedIndex].hasAttribute('disabled') ? false : true
        },
        checkRadioChecked: function(form, name) {
            var radio = form._el.querySelectorAll('input[name="' + name + '"]')
            var checked = []
            Array.prototype.forEach.call(radio, function(el, i) {
                if (el.checked) {
                    checked.push(el)
                }
            });
            return checked.length > 0 ? true : false
        },
        checkPattern: function(ruleValue, inputValue, inputType) {
            var pattern = new RegExp(ruleValue)
            return pattern.test(inputValue) ? true : false
        },
        // 'el' is our element we want to manage
        // 'elementRule' is the the element rule we want to verify
        handleError: function(el, elementRule) {
            var _this = this;

            if (elementRule === false) {
                // If element isn't already in errors[] we push it
                if (this.errors.indexOf(el.getAttribute('data-element')) == -1) {
                    this.errors.push(el.getAttribute('data-element'));
                }
                // We remove the element from the array if its
                // value is correct.
            } else {
                // If the errors[] isn't empty
                if (this.errors.length > 0) {
                    // We remove every element from our errors[] if its
                    // value is matches the elementRule
                    for (var i = this.errors.length - 1; i >= 0; i--) {
                        if (el.type == 'radio' || el.type == 'checkbox') {
                            var radio = document.querySelectorAll('input[name="' + el.getAttribute('name') + '"]')
                            Array.prototype.forEach.call(radio, function(el, index) {
                                if (_this.errors[i] === el.getAttribute('data-element')) {
                                    _this.errors.splice(i, 1);
                                }
                            });
                        }
                        if (el.type !== 'radio' && el.type !== 'checkbox' && this.errors[i] === el.getAttribute('data-element')) {
                            this.errors.splice(i, 1);
                        }
                    }
                }
            }
        },
        // At the initialisation of the form we parse 
        // every required element and we add them in the 
        // errors[]. After that we will only have to remove
        // them from the array once they're filled correctly
        initFormErrors: function() {
            var _this = this

            Array.prototype.forEach.call(_this._elements, function(el, i) {
                if (el.required && _this.errors.indexOf(el.getAttribute('data-element')) == -1) {
                    _this.errors.push(el.getAttribute('data-element'));
                }
            });
        },
        getRadioValue: function(form, name) {
            var val;

            // get list of radio buttons with specified name
            var radios = form._el.querySelectorAll('input[type="radio"][name="' + name + '"]')
            Array.prototype.forEach.call(radios, function(el, i) {
                if (radios[i].checked) {
                    val = radios[i].value;

                    // Add checked radio value in data
                    form.data[el.name] = el.value
                }
            });
            return val;
        },
        constructData: function(form) {
            Array.prototype.forEach.call(form._elements, function(el, i) {
                // Add all form elements value in form data
                // except for radio buttons which are already
                // dealt with in getRadioValue()
                // We use trim() to remove spaces from both ends
                // of value to prevent the sending of an
                // incorrect particularly for email adress
                if (el.type !== 'radio' && el.type !== 'checkbox') {
                    form.data[el.name] = el.value.trim()
                }
            });
        },
        // Set radio buttons to checked = false
        // Seek for disabled option in select and select it, if
        // Set all input value to ''
        // Add all inputs in erros[] with initFormErrors
        showValidationContent: function() {
            document.querySelector('.js-content-before-sendind').classList.add('u-hide');
            document.querySelector('.js-content-after-sendind').classList.remove('u-hide');
        },
        send: function(form, event) {
            var _this = this;

            event.preventDefault();

            if (form.errors.length == 0) {

                var url = event.target.action; //
                var xhr = new XMLHttpRequest();
                xhr.open('POST', url);
                // xhr.withCredentials = true;
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onreadystatechange = function() {
                    if (xhr.status === 200) {
                        _this.showValidationContent()
                    }
                    return;
                };
                // url encode form data for sending as post data
                var encoded = Object.keys(form.data).map(function(k) {
                    return encodeURIComponent(k) + '=' + encodeURIComponent(form.data[k])
                }).join('&')
                // we are submitting via xhr below
                xhr.send(encoded);
            }
        }
    };

    var contactForm = formValidator;
    contactForm.init('#gform');
});
