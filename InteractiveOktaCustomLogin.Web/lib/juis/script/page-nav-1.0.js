/*
 * Page slider navigation
 *
 * Requires: juis.core-1.x
*/

juis.sliderNav = (function() {
  /* Properties */

  /* Constructor Helpers */

  // First run setup
  function _setup() {
    var nav = document.querySelector(".p-slider-nav");

    // activate scripted classes
    // hide the menu
    nav.classList.add("p-slider-nav--script-init");
    // initialise animation
    nav.classList.add("p-slider-nav--scripted");

    // insert toggle button

    var title = document.querySelector(".p-nav__title");
    //create toggle button
    var activator = document.createElement("button");
    activator.classList.add("p-slider-nav__activator");
    activator.type = "button";
    activator.setAttribute("aria-label", "Toggle Navigation");
    //add lines element
    activator.innerHTML = "<span class=\"lines\"></span>";
    //insert into the title bar
    title.insertBefore(activator, title.firstChild);
  }

  // Event binding
  function _bind() {
    //menu hide/show click event
    document.querySelector(".p-slider-nav__activator").addEventListener("click", _activatorClick);

    //handle escape key to hide
    window.addEventListener("keydown", function(event) {
      var code = event.key || event.charCode || event.keyCode;

      if (code && (code === "Escape" || code === 27)) {//esc
        _hide();
      }
    });

  }

  /* Event Listeners */

  // Toggle menu visibility
  function _activatorClick(event) {
    document.body.classList.toggle("p-slider-box--active");
    var nav = document.querySelector(".p-slider-nav");
    // remove script-init class to show the menu
    nav.classList.remove("p-slider-nav--script-init");
    //animate in
    nav.classList.toggle("p-slider-nav--active");

    event.preventDefault();
  }

  /* Private methods */

  function _hide() {
    document.body.classList.remove("p-slider-box--active");
    document.querySelector(".p-slider-nav").classList.remove("p-slider-nav--active");
  }

  /* Public Methods */
  return {
    init: function() {
      //if no overflow nav is found, go no further
      if (!document.querySelector(".p-slider-nav")) {
        return;
      }

      //first run
      _setup();
      _bind();
    },
    //Force hide the navigator
    hide: function() {
      _hide();
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.sliderNav.init();
});
