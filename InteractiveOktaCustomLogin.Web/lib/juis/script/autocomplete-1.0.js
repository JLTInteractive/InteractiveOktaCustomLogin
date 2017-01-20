/*
 * Autocomplete control.
 *
 * Requires: juis.core-1.x
 *           rich-field-1.x
 */

juis.autocomplete = (function() {
  /* Properties */
  var _currentField;

  /* Constructor Helpers */

  // First run setup
  function _setup(field, target) {
    var dataSource = document.querySelector("#" + target);
    var dataValues = dataSource.querySelectorAll("li");

    if (_isCombo(field)) {
      field.dataset.showOnActive = "true";

/*      //append manual activation button
      var activator = document.createElement("button");
      activator.id = field.id + "-activator";
      activator.dataset.target = target;
      activator.innerText = "\u25bc";
      activator.classList.add("g-rf__activator");
      activator.type = "button";*/

//      field.parentElement.parentElement.insertBefore(activator, field.parentElement.nextSibling);      
    }

    //loop through values
    for (var i=0; i < dataValues.length; i++) {
      //assign value to any elements that don't have one
      if (!dataValues[i].dataset.originalValue) {
        dataValues[i].dataset.originalValue = dataValues[i].textContent; 
      }

      //store search value
      dataValues[i].dataset.searchValue = dataValues[i].textContent.toLowerCase();       
    }

    //clone the source and attach it to the to the original
    //dataSource.clone = dataSource.cloneNode(true);
  }

  // Event binding
  function _bind(field, target) {
    //initialise events
    field.addEventListener("focus", _setPicker);
    field.addEventListener("input", _applyFilter);
    field.addEventListener("keydown", _handleKeyboardEvents);

    var dataList = document.querySelector("#" + target);
    var dataValues = dataList.querySelectorAll("li");

    for (i=0; i < dataValues.length; i++) {
      //add select event
      dataValues[i].addEventListener("click", _clickNode);
    }

    // toggle/hide show
    if (_isCombo(field)) {
      //var activator = document.querySelector("#" + field.id + "-activator");
      //activator.addEventListener("click", _clickComboActivator);
    }
  }

  /* Event Listeners */

  function _applyFilter(event) {
    var target = event.target.dataset.target;
    var dataList = document.querySelector("#" + target);

    _reset(dataList);

    //don't filter for less than two characters
    var filterValue = this.value.toLowerCase();
    if (filterValue.length < 2) {
      _clearFilters(dataList);
      return;
    }

    //select non-matching elements
    var selected = dataList.querySelectorAll("li:not([data-search-value*='" + filterValue + "'])");

    //hide non-matching nodes
    for (var i=0; i < selected.length; i++) {
      juis.setVisibility(selected[i]);
    }

    //select matching elements
    var matches = dataList.querySelectorAll("li[data-search-value*='" + filterValue + "']");

    //highlight matching text
    for (i=0; i < matches.length; i++) {
      matches[i].innerHTML = matches[i].dataset.originalValue.replace(new RegExp(juis.sanitiseRegEx(filterValue), "gi"), "<mark>$&</mark>");
    }
  }

  //set picker value
  function _clickNode(event) {
    _setValue(event.target.textContent);
  }

  //select node by keyboard
  function _selectNode(event) {
    var selectedNode = document.querySelector("#" + event.target.dataset.target + " [aria-selected='true']");

    _setValue(selectedNode.textContent);
  }

  //set target picker
  function _setPicker(event) {
    _currentField = event.target;
  }

/*  function _clickComboActivator(event) {
    var target = document.querySelector("#" + event.target.dataset.target);

    //if the control is hidden
    if (!juis.richField.isActive(target)) {
      //focus on the field
      event.target.parentElement.querySelector(".g-ac").focus();
      //prevent click event from going any further
      event.stopPropagation();
    } else {
      //control will hide itself

      //focus on self
      event.target.focus();
    }
  }*/

  function _handleKeyboardEvents(event) {
    //ignore keys if modifiers are active
    if (juis.keyModiferActive(event)) {
      return;
    }

    var code = event.key || event.charCode || event.keyCode;

    switch(code) {
      case "ArrowDown":
      case "Down":
      case 40:
        _go(event.target, "down");
        event.preventDefault();
        break;
      case "ArrowUp":
      case "Up":
      case 38:
        _go(event.target, "up");
        event.preventDefault();
        break;
      case "Enter":
      case "13":
        //handle return to select
        _selectNode(event);
        break;
      default:
    }
  }

  function _toggleChild() {
    // toggle child expanded state
    var child = this.parentNode.querySelector("[role='group']");
    juis.setExpandedState(child, child.hasAttribute("aria-expanded") && child.getAttribute("aria-expanded") === "true");
  }

  /* Methods */

  function _isCombo(field) {
    return field.classList.contains("g-ac__combo");
  }

  //reset the source to it's original layout
  function _reset(source) {
    //select items
    var items = source.querySelectorAll("li");

    //show everything by default (reset)
    for (var i=0; i < items.length; i++) {
      juis.setVisibility(items[i], true);
    }

    //Deselect any selected nodes
    var selected = source.querySelector("[aria-selected='true']");
    if (!selected) {
      return;
    }
    selected.setAttribute("aria-selected", "false");
  }

  //clear marks, collapse
  function _clearFilters(source) {
    //clear highlights
    var highlights = source.querySelectorAll("mark");
    for (var i=0; i < highlights.length; i++) {
      highlights[i].outerHTML = highlights[i].outerHTML.replace(/<.*>(.*)<.*>/, "$1");
    }
  }

  function _setValue(value) {
    if (!_currentField) {
      throw new Error("Autocomplete failed to set target");
    }

    //set value
    _currentField.value = value;

    //return focus to the picker
    _currentField.focus();

    //select tree
    var tree = document.querySelector("#" + _currentField.dataset.target);

    //hide tree
    juis.richField.hide(tree);

    //reset positioning, clear filters, 
    _reset(tree);
    _clearFilters(tree);
  }

  //handles keyboard navigation
  function _go(field, direction){
    //get selected node
    var tree = document.querySelector("#" + field.dataset.target);
    var selectedNode = tree.querySelector("[aria-selected='true']");

    //if no selected node
    if (!selectedNode)
    {
      //if down, select first visible
      if (direction !== "down") {
        return;
      }

      var firstNode = tree.querySelector("li:not([aria-hidden='true'])");
      if (!firstNode) {//if none are visible, exit
        return;
      }

      //set highlight
      firstNode.setAttribute("aria-selected", "true");
      return;
    }

    //if filter has been applied, ignore in/out
    switch (direction) {
      case "in":
        // if selected node has collapsed children, expand them
        var childTree = selectedNode.querySelector("[role='group']");
        if (childTree && childTree.getAttribute("aria-expanded") === "false") {
          childTree.setAttribute("aria-expanded", "true");
        }
        break;
      case "out":
        // if selected node has expanded children, collapse them
        childTree = selectedNode.querySelector("[role='group']");
        if (childTree && childTree.getAttribute("aria-expanded") === "true") {
          childTree.setAttribute("aria-expanded", "false");
          return;
        }

        //if a parent group exists, collapse the group
        var parentRole = selectedNode.parentNode.getAttribute("role");
        if (parentRole && parentRole === "group") {
          selectedNode.parentNode.setAttribute("aria-expanded", "false");

          //clear child selection
          selectedNode.setAttribute("aria-selected", "false");

          //select the parent node
          selectedNode.parentNode.parentNode.setAttribute("aria-selected", "true");
        }
        break;
      case "up":
      case "down":
        //fetch visible nodes
        var visibleNodes = tree.querySelectorAll("[aria-expanded='true'] > li:not([aria-hidden='true'])");
        var selectedNodeIndex;
        //loop through nodes and find the currently selected node
        for (var i=0; i < visibleNodes.length; i++) {
          //keep looking until we find the selected node in the list
          if (visibleNodes[i] !== selectedNode) {
            continue;
          }

          selectedNodeIndex = i;
          break;
        }

        //if we're at the first and want to go up
        //or we're at the last and want to go down
        if (selectedNodeIndex === 0 && direction === "up" || 
          selectedNodeIndex === (visibleNodes.length - 1) && direction === "down") {
          //do nothing
          return;
        }
        selectedNode.setAttribute("aria-selected", "false");
        //select previous/next node
        selectedNodeIndex = selectedNodeIndex + (direction === "down" ? 1 : -1);
        //if there are no selectable nodes
        if (!visibleNodes[selectedNodeIndex]) {
          return;
        }
        visibleNodes[selectedNodeIndex].setAttribute("aria-selected", "true");
        return;
      default:
    }
  }

  /* Public Methods */
  return {
    init: function() {
      var autocompleteFields = document.querySelectorAll(".g-ac");
      
      for (var i=0; i < autocompleteFields.length; i++) {
        var target = autocompleteFields[i].dataset.target;
        _setup(autocompleteFields[i], target);
        _bind(autocompleteFields[i], target);
      }
    }
  };

})();

document.addEventListener("DOMContentLoaded", function() {
  juis.autocomplete.init();
});
