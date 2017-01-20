/*
 * Forms
 *
 * Requires: juis.core-1.x
 *
 */

juis.forms = (function() {
  /* Properties */
  var _classError = "c-form__field-box--error",
      _classFocussedLabel = "c-form__block-label--focussed",
      _classCheckedLabel = "c-form__block-label--checked",
      _classDisabledLabel = "c-form__block-label--disabled";

  /* Constructor Helpers */

  // First run setup
  function _setup(form) {
    //mark checked radio/checkbox labels
    var checkedInputs = form.querySelectorAll("input:checked");
    for (var i = 0; i < checkedInputs.length; i++) {
      checkedInputs[i].parentNode.classList.add(_classCheckedLabel);
    }

    //mark disabled radio labels
    var disabledRadios = form.querySelectorAll("input[type='radio']:disabled");
    for (i = 0; i < disabledRadios.length; i++) {
      disabledRadios[i].parentNode.classList.add(_classDisabledLabel);
    }

    //mark disabled checkbox labels
    var disabledCheckboxes = form.querySelectorAll("input[type='checkbox']:disabled");
    for (i = 0; i < disabledCheckboxes.length; i++) {
      disabledCheckboxes[i].parentNode.classList.add(_classDisabledLabel);
    }

    //conditional elements
    var conditionalCheckboxes = form.querySelectorAll("input[type='checkbox'][data-target]");
    for (i = 0; i < conditionalCheckboxes.length; i++) {
      _initialiseConditionalFields(conditionalCheckboxes[i]);
    }

    var conditionalRadios = form.querySelectorAll("input[type='radio'][data-target]");
    for (i = 0; i < conditionalRadios.length; i++) {
      _initialiseConditionalFields(conditionalRadios[i]);
    }
  }

  // Event binding
  function _bind(form) {
    //radio
    var radios = form.querySelectorAll("input[type='radio']");
    for (var i = 0; i < radios.length; i++) {
      radios[i].addEventListener("click", _clickRadio);
      radios[i].addEventListener("focus", _focusRadio);
      radios[i].addEventListener("blur", _blurRadio);
    }

    //block checkbox
    var checkboxes = form.querySelectorAll(".c-form__block-label input[type='checkbox']");
    for (i = 0; i < checkboxes.length; i++) {
      checkboxes[i].addEventListener("click", _clickCheckbox);
      checkboxes[i].addEventListener("focus", _focusCheckbox);
      checkboxes[i].addEventListener("blur", _blurCheckbox);
    }

    //conditional elements
    var conditionalCheckboxes = form.querySelectorAll("input[type='checkbox'][data-target]");
    for (i = 0; i < conditionalCheckboxes.length; i++) {
      conditionalCheckboxes[i].addEventListener("click", _clickConditionalCheckbox);
    }

    var conditionalRadios = form.querySelectorAll("input[type='radio'][data-target]");
    for (i = 0; i < conditionalRadios.length; i++) {
      conditionalRadios[i].addEventListener("click", _clickConditionalRadio);
    }
  }

  /* Event Listeners */

  function _clickRadio(event) {
    var radio = event.target;
    var label = radio.parentNode;

    //clear checked state of all radios in group
    var radioGroup = _getRadioGroup(radio);
    for (var i = 0; i < radioGroup.length; i++) {
      radioGroup[i].parentNode.classList.remove(_classCheckedLabel);
    }

    //set checked state for this radio label
    label.classList.toggle(_classCheckedLabel, radio.checked);
  }

  function _focusRadio(event) {
    //set focus state for this radio label
    event.target.parentNode.classList.add(_classFocussedLabel);
  }

  function _blurRadio(event) {
    //remove focus state for this radio label
    event.target.parentNode.classList.remove(_classFocussedLabel);
  }

  function _clickCheckbox(event) {
    //set checked state for this checkbox label
    event.target.parentNode.classList.toggle(_classCheckedLabel, event.target.checked);
  }

  function _focusCheckbox(event) {
    //set focus state for this checkbox label
    event.target.parentNode.classList.add(_classFocussedLabel);
  }

  function _blurCheckbox(event) {
    //remove focus state for this checkbox label
    event.target.parentNode.classList.remove(_classFocussedLabel);
  }

  function _clickConditionalCheckbox(event) {
    //fetch target
    var field = event.target;

    _toggleConditionalState(field, field.checked);
  }

  function _clickConditionalRadio(event) {
    //fetch target
    var field = event.target;

    //clear any other active targets in this radio group
    var radioGroup = _getRadioGroup(field);
    for (var i = 0; i < radioGroup.length; i++) {
      _toggleConditionalState(radioGroup[i], false);
    }

    //show conditional fieldset
    _toggleConditionalState(field, true);
  }

  /* Methods */

  //gets the associated collection of radios for a given radio
  function _getRadioGroup(radio) {
    return radio.form.querySelectorAll("input[name='" + radio.name + "']");
  }

  //initialise base state for conditional fields
  function _initialiseConditionalFields(field) {
    var targetId = field.dataset.target;
    var target = field.form.querySelector("#" + targetId);

    //assign ARIA roles
    //control
    field.setAttribute("aria-controls", targetId);
    field.setAttribute("aria-expanded", field.checked);

    //target
    target.setAttribute("aria-hidden", !field.checked);
  }

  function _toggleConditionalState(field, show) {
    var targetId = field.dataset.target;
    var target = field.form.querySelector("#" + targetId);

    //show target
    //assign ARIA roles
    //control
    field.setAttribute("aria-expanded", show);

    //target
    target.setAttribute("aria-hidden", !show);
  }

  /* Public Methods */
  return {
    init: function() {
      //If there are no forms, get out

      var forms = document.querySelectorAll("form");
      if (forms.length === 0) {
        return;
      }
      
      for (var i=0; i < document.querySelectorAll("form").length; i++) {
        _setup(forms[i]);
        _bind(forms[i]);
      }
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.forms.init();
});
