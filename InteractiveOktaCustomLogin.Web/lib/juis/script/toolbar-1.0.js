/*
 * Toolbar
 *
 * Requires: juis.core-1.x
 *
 * References:
 *   https://www.w3.org/TR/2013/WD-wai-aria-practices-20130307/
 *   https://www.w3.org/WAI/ARIA/1.0/examples/toolbar/toolbar
 *   http://heydonworks.com/practical_aria_examples/#toolbar-widget
 */

juis.toolbar = (function() {
  /* Properties */

  /* Constructor Helpers */

  // First run setup
  function _setup(toolbar) {
    //initiate tab indices
    //tab focus for toolbar
    toolbar.setAttribute("tabindex", 0);

    //remove tab focus for buttons
    var buttons = toolbar.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute("tabindex", -1);
    }
  }

  // Event binding
  function _bind(toolbar) {
    //keyboard binding
    toolbar.addEventListener("keydown", _handleToolbarKeyEvents);
  }

  /* Event Listeners */

  function _handleToolbarKeyEvents(event) {
    if (!event) {
      event = window.event;
    }

    //ignore keys if modifiers are active
    if (juis.keyModiferActive(event)) {
      return;
    }

    var enabledTabs = this.querySelectorAll("button:not([aria-disabled='true'])");

    //if there are no enabled tabs, ignore keys
    if (enabledTabs.length < 1) {
      return;
    }

    // select active or first tab
    var activeTab = this.querySelector("button[aria-selected='true']");

    var code = event.key || event.charCode || event.keyCode;

    switch(code) {
      case "Left":
      case "ArrowLeft":
      case 37:
        // Key left
        _switchButton(_getPrevActiveSibling, activeTab, enabledTabs, event);
        break;
      case "Right":
      case "ArrowRight":
      case 39:
        // Key right
        if (activeTab) {
          _switchButton(_getNextActiveSibling, activeTab, enabledTabs, event);
          return;
        }
        //select first tab
        var firstTab = this.querySelector("button:not([aria-disabled='true'])");
        if (!firstTab) {
          return;
        }
        firstTab.setAttribute("aria-selected", "true");
        break;
      default:
    }
  }

  /* Methods */

  function _switchButton(selector, tab, tabs, event) {
    var sibling = selector(tab, tabs);

    //no sibling, no go
    if (!sibling) {
      return;
    }

    // unselect previous tab
    tab.setAttribute("aria-selected", "false");

    //set focus on the prev tab
    sibling.focus();
    sibling.setAttribute("aria-selected", "true");
    event.preventDefault();
  }

  //returns the next sibling or null
  function _getNextActiveSibling(tab, tabs) {
    return _getSibling(tab, tabs, function(tabs, index) {
      if (index + 1 > tabs.length) {
        return null;
      }
      return tabs[index + 1];
    });
  }

  //returns the previous sibling or null
  function _getPrevActiveSibling(tab, tabs) {
    return _getSibling(tab, tabs, function(tabs, index) {
      if (index === 0) {
        return null;
      }
      return tabs[index - 1];
    });
  }

  // Generic sibling fetcher
  function _getSibling(tab, tabs, selector) {
    //find tab position in tab list
    var index = 0;
    for (var i = 0; i < tabs.length; i++){
      if (tabs[i] === tab) {
        index = i;
        break;
      }
    }
    
    var sibling = selector(tabs, index);

    if (!sibling) {
      return null;
    }

    return sibling;    
  }

  /* Public Methods */
  return {
    init: function() {
      //If there are no data grid, get out

      var toolbars = document.querySelectorAll(".c-toolbar");
      if (toolbars.length === 0) {
        return;
      }
      
      for (var i=0; i < document.querySelectorAll(".c-toolbar").length; i++) {
        _setup(toolbars[i]);
        _bind(toolbars[i]);
      }
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.toolbar.init();
});
