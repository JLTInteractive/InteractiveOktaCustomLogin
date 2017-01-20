/*
 * Drop Menu Control.
 *
 * Requires: juis.core-1.x
 *
 * References:
 *   https://www.nngroup.com/articles/does-user-annoyance-matter/
 */

juis.dropMenu = (function() {
  /* Properties */
  var _timeoutID;

  /* Constructor Helpers */

  // First run setup
  function _setup(menu) {
    //initialise activator
    menu.activator = menu.querySelector(".g-drop-menu__action");
    menu.activator.setAttribute("aria-haspopup", "true");
  }

  // Event binding
  function _bind(menu) {
    //activate toggle
    menu.activator.addEventListener("mouseenter", _enterActivator);
    menu.activator.addEventListener("mouseleave", _leaveActivator);

    //activate sub menus on delayed hover
    var subActivators = menu.querySelectorAll(".g-drop-menu--sub > .g-drop-menu__action");

    for (var i=0; i < subActivators.length; i++) {
      subActivators[i].addEventListener("mouseenter", _enterSubActivator);
      subActivators[i].addEventListener("mouseleave", _leaveSubActivator);
    }

    //hide submenus below the current level
    var menuItems = menu.querySelectorAll(".g-drop-menu__list a");

    for (i=0; i < menuItems.length; i++) {
      menuItems[i].addEventListener("mouseenter", _enterMenuItem);
    }

    //click outside to close
    document.addEventListener("click", _handleDocumentClick);

    //keyboard
    menu.addEventListener("keydown", _handleMenuKeys);
    menu.activator.addEventListener("keydown", _handleActivatorKeys);
  }

  /* Event Listeners */

  //enter activator
  function _enterActivator(event) {
    //initiate delayed submenu hover
    _timeoutID = window.setTimeout(_toggleMenu, 250, event.target);

  }

  //leave menu activator
  function _leaveActivator(event) {
    //clear timer
    window.clearTimeout(_timeoutID);
  }

  //enter sub menu activator
  function _enterSubActivator(event) {
    //initiate delayed submenu hover
    _timeoutID = window.setTimeout(_toggleSubMenu, 250, event.target);
  }

  //leave sub menu activator
  function _leaveSubActivator(event) {
    //clear timer
    window.clearTimeout(_timeoutID);
  }

  // enter menu item
  function _enterMenuItem(event) {
    _hideSubMenus(event.target.parentNode.parentNode);
  }

  //handle keys pressed while focussed on the menu
  function _handleMenuKeys(event) {
    //select any active menus
    var activeMenu = document.querySelector(".g-drop-menu__action[aria-expanded='true']");

    //if no menus are active, get out
    if (!activeMenu) {
      return;
    }

    //ignore keys if modifiers are active
    if (juis.keyModiferActive(event)) {
      return;
    }

    var code = event.key || event.charCode || event.keyCode;

    switch(code) {
      case "ArrowDown":
      case "Down":
      case 40:
        _go(activeMenu, "down");
        event.preventDefault();
        break;
      case "ArrowUp":
      case "Up":
      case 38:
        _go(activeMenu, "up");
        event.preventDefault();
        break;
      case "ArrowLeft":
      case "Left":
      case 37:
        _go(event.target, "out");
        event.preventDefault();
        break;
      case "ArrowRight":
      case "Right":
      case 39:
        _go(event.target, "in");
        event.preventDefault();
        break;
      case "Escape":
      case "Esc":
      case 27:
        //hide menu
        _toggleMenu(activeMenu);
        break;
      default:
    }
  }

  // Detect space to toggle menu
  function _handleActivatorKeys(event) {
    //ignore keys if modifiers are active
    if (juis.keyModiferActive(event)) {
      return;
    }

    var code = event.key || event.charCode || event.keyCode;

    // Space to toggle menu
    switch(code) {
      case " ":
      case "Spacebar":
      case 32:
        _toggleMenu(event.target);
        event.preventDefault();
        break;
      default:
    }
  }

  //Escape to close
  function _handleDocumentClick() {
    var activeMenu = document.querySelector(".g-drop-menu__action[aria-expanded='true']");

    //if no menus are active, get out
    if (!activeMenu) {
      return;
    }

    //hide menu
    _toggleMenu(activeMenu);
  }

  /* Methods */

  //toggle menu visibility
  function _toggleMenu(activator) {
    //get expanded state
    var expanded = activator.getAttribute("aria-expanded");

    // hide any other active menus
    var activeMenus = document.querySelectorAll(".g-drop-menu__action[aria-expanded='true']");
    for (var i=0; i < activeMenus.length; i++) {
      juis.setExpandedState(activeMenus[i], true);
      juis.setVisibility(activeMenus[i].parentNode.querySelector(".g-drop-menu__list"), false);

      //deselect any selected items
      var selectedNodes = activeMenus[i].parentNode.querySelectorAll("[aria-selected='true']");

      for (var j=0; j < selectedNodes.length; j++) {
        selectedNodes[j].setAttribute("aria-selected", "false");
      }
    }

    if (expanded && expanded !== "false") {
      return;
    }

    //mark menu activator as expanded
    juis.setExpandedState(activator, false);
    activator.setAttribute("aria-selected", "true");

    //display menu
    var menu = activator.parentNode.querySelector(".g-drop-menu__list");
    juis.setVisibility(menu, true);

    //reset right positioning
    menu.style.right = "auto";
    var activatorLeft = activator.getBoundingClientRect().left;

    //ensure menu is on screen
    if ((activatorLeft + menu.clientWidth) > document.body.clientWidth) {

      var navRight = document.querySelector(".g-drop-menu__parent").getBoundingClientRect().right;
      //set menu right position
      menu.style.right = (navRight - activatorLeft - activator.clientWidth) + "px";
    }
  }

  //Toggle sub menu visibility
  function _toggleSubMenu(activator) {
    //get expanded state
    var expanded = activator.getAttribute("aria-expanded");

    //mark menu activator as expanded
    juis.setExpandedState(activator, false);

    //display menu
    var activatorBounds = activator.getBoundingClientRect();
    var menu = activator.parentNode.querySelector(".g-drop-menu__list");
    //reset any right positioning
    menu.style.right = "auto";
    //set left and top position
    menu.style.left = activator.clientWidth + "px";
    menu.style.top = (activatorBounds.top - activator.parentNode.parentNode.getBoundingClientRect().top) + "px";
    juis.setVisibility(menu, true);

    //ensure menu is on screen
    if ((activatorBounds.left + activatorBounds.width + menu.clientWidth) > document.body.clientWidth) {
      //reset left position
      menu.style.left = "auto";
      //set menu right position
      menu.style.right = (activatorBounds.width) + "px";
    }
  }

  //hide all sub menu items from this level down
  function _hideSubMenus(menu) {
    var expandedMenus = menu.querySelectorAll("[aria-expanded='true']");

    for (var i=0; i < expandedMenus.length; i++) {
      juis.setExpandedState(expandedMenus[i], true);
      juis.setVisibility(expandedMenus[i].parentNode.querySelector(".g-drop-menu__list"), false);
    }
  }

  //handle keyboard navigation
  function _go(field, direction){
    //get selected node
    var topMenu = field.parentNode.querySelector(".g-drop-menu__list");
    var selectedNode = topMenu.querySelector("[aria-selected='true']");
    var currentMenu;

    //if no selected node
    if (selectedNode) {
      //set current menu
      currentMenu = selectedNode.parentNode;
    } else {
      //set the current menu to the top menu
      currentMenu = topMenu;
      //if down, select first visible
      if (direction !== "down") {
        return;
      }

      var firstNode = currentMenu.querySelector("li");

      //set highlight
      firstNode.setAttribute("aria-selected", "true");
      return;
    }

    //if filter has been applied, ignore in/out
    switch (direction) {
      case "up":
      case "down":
        //fetch nodes
        //convert to array, filter out anything that's not an LI element
        var nodes = Array.prototype.slice.call(currentMenu.childNodes).filter(function(node) {
          //remove non-element nodes
          if (node.nodeType !== Node.ELEMENT_NODE) {
            return false;
          }
          //remove non LI nodes
          if (node.tagName.toLowerCase() !== "li") {
            return false;
          }
          return true;
        });
        var selectedNodeIndex = nodes.indexOf(selectedNode);

        //if we're at the first and want to go up
        //or we're at the last and want to go down
        if (selectedNodeIndex === 0 && direction === "up" || 
          selectedNodeIndex === (nodes.length - 1) && direction === "down") {
          //do nothing
          return;
        }
        selectedNode.setAttribute("aria-selected", "false");
        //select previous/next node
        selectedNodeIndex = selectedNodeIndex + (direction === "down" ? 1 : -1);
        //if there are no selectable nodes
        if (!nodes[selectedNodeIndex]) {
          return;
        }
        nodes[selectedNodeIndex].setAttribute("aria-selected", "true");
        return;
      case "in":
        var subMenuActivator = currentMenu.querySelector(".g-drop-menu__action");
        //if no sub menu activators, get out
        if (!subMenuActivator) {
          return;
        }

        var node = subMenuActivator.parentNode;

        if (node.getAttribute("aria-selected") && node.getAttribute("aria-selected") === "true") {
          //open sub-menu
          _toggleSubMenu(subMenuActivator);
          
          //deselect the current item
          selectedNode.setAttribute("aria-selected", "false");

          //select first sub-menu item
          node.querySelector(".g-drop-menu__list > li").setAttribute("aria-selected", "true");
        }
        return;
      case "out":
        //fetch parent menu item
        var parent = currentMenu.parentNode;
        //if the parent isn't a sub-menu, get out
        if (!currentMenu.parentNode.classList.contains("g-drop-menu--sub")) {
          return;
        }

        var activator = parent.querySelector(".g-drop-menu__action");

        //hide sub menus below parent menu
        _hideSubMenus(parent.parentNode);

        //collapse
        juis.setExpandedState(activator, true);

        //deselect the current item
        selectedNode.setAttribute("aria-selected", "false");

        //select activator parent
        parent.setAttribute("aria-selected", "true");

        break;
      default:
    }
  }

  /* Public Methods */
  return {
    init: function() {
      //If there are no drop menus, get out

      var menus = document.querySelectorAll(".g-drop-menu");
      if (menus.length === 0) {
        return;
      }
      
      for (var i=0; i < document.querySelectorAll(".g-drop-menu").length; i++) {
        _setup(menus[i]);
        _bind(menus[i]);
      }
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.dropMenu.init();
});
