/*
 * Rich Field control.
 *
 * Requires: juis.core-1.x
 */

// Rich Field control for enhancing form fields
// Handles hide/show/focus events
juis.richField = (function(){
  /* Properties */
  var _targetHasFocus = false;

  /* Constructor Helpers */

  function _setup(field) {
    _hide(_getTargetElement(field.dataset.target));
  }

  function _bind(field) {
    var target = _getTargetElement(field.dataset.target);
    //hide on esc
    window.addEventListener("keydown", function(event) {
      var code = event.key || event.charCode || event.keyCode;

      if (code && (code === "Escape" || code === 27)) {//esc
        _hide(target);
      }
    });

    //hide when anything outside the target is clicked
    document.addEventListener("click", function(event) {
      if (event.target !== field) {
        _hide(target);
      }
      _targetHasFocus = false;
    });

    //mark when target has focus
    target.addEventListener("mousedown", function(event) {
      _targetHasFocus = true;
      event.stopPropagation();
    });

    //mark when target has focus
    target.addEventListener("click", function(event) {
      _targetHasFocus = true;
      //prevent click event from going any further
      event.stopPropagation();
    });

    //mark when target has focus
    target.addEventListener("focus", function(event) {
      _targetHasFocus = true;
    });

    //mark when target has focus
    target.addEventListener("blur", function(event) {
      _targetHasFocus = false;
    });

    //show on element focus
    field.addEventListener("focus", function() {
      if (field.dataset.showOnActive && field.dataset.showOnActive === "true") {
        _show(target, field);
      }
    });

    //show on element click
    field.addEventListener("click", function() {
      if (field.dataset.showOnActive && field.dataset.showOnActive === "true") {
        _show(target, field);
      }
    });

    //show on element keydown
    field.addEventListener("keydown", function(event) {
      //ignore keys if modifiers are active
      if (juis.keyModiferActive(event)) {
        return;
      }

      var code = event.key || event.charCode || event.keyCode;

      //if not an up, left or right arrow key, enter or tab
      switch(code) {
        case "ArrowUp":
        case 38:
        case "ArrowLeft":
        case 37:
        case "ArrowRight":
        case 39:
        case "Enter":
        case "13":
        case "Tab":
        case "9":
        case "Escape":
        case "27":
          return;
        default:
      }

      _show(target, field);
    });

    //hide on element blur if target doesn't have focus
    field.addEventListener("blur", function() {
      //use a timeout to allow the target element's click event to kick in
      window.setTimeout(function() {
        if (!_targetHasFocus) {
          _hide(target);
        }        
      }, 150);
    });
  }

  /* Event Handlers */

  function _hide(target) {
    juis.setVisibility(target);
  }

  function _show(target, field) {
    //set min-width to container min-width
    target.style.minWidth = field.clientWidth + "px";

    //show
    juis.setVisibility(target, true);
  }

  function _getTargetElement(target) {
    return document.querySelector("#" + target);
  }

  /* Public Methods */
  return {
    init: function() {
      var fields = document.querySelectorAll(".g-rf");
      for (var i=0; i < fields.length; i++) {
        _setup(fields[i]);
        _bind(fields[i]);        
      }
    },
    show: function(target) {
      _show(target, target.parentElement.querySelector(".g-rf"));
    },
    hide: function(target) {
      _hide(target);
    },
    //toggle visibility
    toggle: function(target) {
      if (target.attributes && target.attributes["aria-hidden"] && target.getAttribute("aria-hidden") === "true") {
        _show(target, target.parentElement.querySelector(".g-rf"));
      } else {
        _hide(target);
      }
    },
    isActive: function(target) {
      return !target.attributes["aria-hidden"] || target.getAttribute("aria-hidden") !== "true";
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.richField.init();
});
