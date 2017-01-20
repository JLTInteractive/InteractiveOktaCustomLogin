/*
 * Accordion control.
 *
 * Requires: juis.core-1.x
 */

juis.accordion = (function() {
  /* Properties */

  //index value for local storage. Uses the current URL to uniquely mark the page
  //potential problem here where the URL changes
  var _storageIndex = "expandedAccordions" + document.location;

  /* Constructor Helpers */

  // First run setup
  function _setup() {
    //label all elements with their roles
    var accordions = document.querySelectorAll(".g-accordion");

    for (var i=0; i < accordions.length; i++) {
      accordions[i].setAttribute("role", "tablist");
    }

    var headers = document.querySelectorAll(".g-accordion__header");

    for (i=0; i < headers.length; i++) {
      headers[i].setAttribute("role", "tab");
      headers[i].setAttribute("tabindex", 0);
      headers[i].setAttribute("aria-expanded", false);
    }

    var panels = document.querySelectorAll(".g-accordion__panel");

    for (i=0; i < panels.length; i++) {
      panels[i].setAttribute("role", "tabpanel");
      juis.setVisibility(panels[i]);
    }
  }

  // Event binding
  function _bind() {
    var headers = document.querySelectorAll(".g-accordion__header");

    for (var i=0; i < headers.length; i++) {
      headers[i].addEventListener("click", _handlePanelToggle);
      headers[i].addEventListener("keydown", _handleHeaderKeys);
    }
  }

  /* Event Listeners */

  function _handlePanelToggle(event) {
    _togglePanel(event.target);
  }

  function _handleHeaderKeys(event) {
    if (!event) {
      event = window.event;
    }

    var code = event.key || event.charCode || event.keyCode;

    //ignore keys if modifiers are active
    if (juis.keyModiferActive(event)) {
      return;
    }

    switch(code) {
      case "Enter":
      case 13:
      case "Space":
      case " ":
      case 32:
        _togglePanel(event.target);
        //expand/collapse header
        event.preventDefault();
        break;
      case "ArrowDown":
      case "Down":
      case 40:
      case "ArrowRight":
      case "Right":
      case 39:
        //select prev header in group
        _go(event.target, "down");
        event.preventDefault();
        break;
      case "ArrowUp":
      case "Up":
      case 38:
      case "ArrowLeft":
      case "Left":
      case 37:
        //select next header in group
        _go(event.target, "up");
        event.preventDefault();
        break;
      case "Home":
      case 36:
        //select first header in the group
        _go(event.target, "first");
        event.preventDefault();
        break;
      case "End":
      case 35:
        //select last header in the group
        _go(event.target, "last");
        event.preventDefault();
        break;
      default:
    }
  }

  /* Methods */

  function _go(header, direction) {
    //select accordion
    var accordion = header.parentElement;

    var headers = accordion.querySelectorAll(".g-accordion__header");

    switch(direction) {
      case "down":
        //find current header position in group
        var position = juis.getElementPositionInList(header, headers);

        //if current element isn't the last
        if (position + 1 < headers.length) {
          //select next element
          headers[position + 1].focus();
        }
        break;
      case "up":
        //find current header position in group
        position = juis.getElementPositionInList(header, headers);

        //if current element isn't the first
        if (position !== 0) {
          //select previous element
          headers[position - 1].focus();
        }
        break;
      case "first":
        //focus first element
        headers[0].focus();
        break;
      case "last":
        //focus last element
        headers[headers.length-1].focus();
        break;
      default:
    }
  }

  function _togglePanel(header) {
    var isVisible = header.getAttribute("aria-expanded") === "true";

    //select panel
    var panel = document.querySelector("#" + header.getAttribute("aria-controls"));


    //toggle state

    header.setAttribute("aria-expanded", !isVisible);
    if (isVisible) {
      //set collapsed classes
      panel.classList.remove("g-accordion__panel--expanded");
      panel.classList.add("g-accordion__panel--collapsed");
    } else {
      //set expanded classes
      panel.classList.remove("g-accordion__panel--collapsed");
      panel.classList.add("g-accordion__panel--expanded");
    }
    juis.setVisibility(panel, !isVisible);
  }

  /* Public Methods */
  return {
    init: function() {
      //if accordions don't exist, go no further
      if (!document.querySelector(".g-accordion")) {
        return;
      }
      _setup();
      _bind();
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.accordion.init();
});
