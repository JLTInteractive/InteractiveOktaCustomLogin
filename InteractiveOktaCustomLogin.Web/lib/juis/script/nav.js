//adapted from https://css-tricks.com/diy-priority-plus-nav/
var overflowNav = {
  nav: $(".overflow-nav"),
  navElements: $(".overflow-nav > ul > li:not(:last)"),
  overflowList: $(".overflow-nav__list"),
  init: function() {
    overflowNav.setup();
    overflowNav.bind();
  },
  setup: function() {
    var menuPosition = overflowNav.navElements.first().position();
    var wrappedElements = $();

    var first = true;

    //loop through nav items
    overflowNav.navElements.get().forEach(function(navElement) {
      var navEl = $(navElement);
      var navElPos = navEl.position();
      if (navElPos.top !== menuPosition.top) {
        wrappedElements = wrappedElements.add(navEl);

        if (first) {
          wrappedElements = wrappedElements.add(navEl.prev());
          first = false;
        }
      }
    });

    $(".overflow-nav__button").removeClass("overflow-nav__button--active")
    .text("More");

    if (wrappedElements.length) {
      var dupe = wrappedElements.clone();

      $(".overflow-nav__indicator").addClass("block");

      //if no menu items are left, change button to "Menu" and make it look like a button
      if (wrappedElements.length === overflowNav.navElements.length) {
        $(".overflow-nav__button").addClass("overflow-nav__button--active")
        .text("Menu");
      }

      overflowNav.overflowList.append(wrappedElements.clone());

      wrappedElements.addClass("g-hidden");
    }
  },
  clean: function() {
    overflowNav.overflowList.empty();
    overflowNav.navElements.removeClass("g-hidden");
    $(".overflow-nav__indicator").removeClass("block");
    $(".overflow-nav__button").removeClass("overflow-nav__button--active");
  },
  bind: function() {
    $(window).on("resize", function() {
      overflowNav.clean();
      overflowNav.setup();
    });

    $(".overflow-nav__button").on("click", function() {
      $(".overflow-nav__indicator").toggleClass("overflow-nav__indicator--active");
      this.blur();
      return false;
    });
  }
};

var sliderNav = {
  nav: $(".slider-nav"),
  navScrollBox: $(".slider-nav__scroll-box"),
  navScroller: $(".slider-nav__scroll-box ul"),
  navElements: $(".slider-nav li"),
  navButtons: $(".slider-nav__scroll-button"),
  init: function() {
    sliderNav.setup();
    sliderNav.bind();
  },
  setup: function() {
    var menuPosition = sliderNav.navScrollBox.position();
    var firstPosition = sliderNav.navElements.first().position();
    var lastPosition = sliderNav.navElements.last().position();

    //if first or last item are displayed off the screen
    var offscreen = false;
    //first item
    if (firstPosition.left < menuPosition.left ||
      (lastPosition.left + sliderNav.navElements.last().width()) > (menuPosition.left + sliderNav.navScrollBox.width()))  {
      offscreen = true;

      //display controls 
      sliderNav.navButtons.addClass("slider-nav__scroll-button--active");

      //scroll to currently highlighted tab
    } else {
      //hide controls
      sliderNav.navButtons.removeClass("slider-nav__scroll-button--active");
    }

  },
  bind: function() {
    $(window).on("resize", function() {
      sliderNav.setup();
    });

    //scroll left
    $(".slider-nav__scroll-button--left").on("click", function() {
      this.blur();

      var scroller = sliderNav.navScroller[0];
      var scrollerPos = sliderNav.navScroller.position();

      //if already scrolled to the far left
      if (scroller.scrollLeft === 0) {
        //exit
        return;
      }

      //loop through elements to find first partially or fully outside the scroll box
      var firstEl = sliderNav.navElements.first();
      sliderNav.navElements.get().forEach(function(navElement) {
        var navEl = $(navElement);
        var navElPos = navEl.position();

        //if the element is outside the scroll box
        if (navElPos.left < scrollerPos.left) {
          firstEl = navEl;
        }
      });

      //scroll to the first element's left
      scroller.scrollLeft = Math.floor(scroller.scrollLeft + firstEl.position().left - scrollerPos.left);
      // scroll box scroll left + element left - scroll box left
    });

    //scroll right
    $(".slider-nav__scroll-button--right").on("click", function() {
      this.blur();

      var scroller = sliderNav.navScroller[0];
      var scrollerPos = sliderNav.navScroller.position();
      var scrollMax = scroller.scrollLeft + scroller.offsetWidth

      //if already scrolled to the far right
      if (scrollMax >= scroller.scrollWidth) {
        //exit
        return;
      }

      var firstEl = sliderNav.navElements.last();
      //reverse loop through elements to find last partially or fully outside the scroll box
      sliderNav.navElements.get().reverse().forEach(function(navElement) {
        var navEl = $(navElement);
        var navElPos = navEl.position();

        //if the element is outside the scroll box
        if ((navElPos.left + navEl.width() - scrollerPos.left) > scrollMax) {
        //left position + width - scroller left < scroller relative position on screen.

          firstEl = navEl;
        }
      });

      //scroll right to show the element
      scroller.scrollLeft = Math.ceil(firstEl.position().left + firstEl.width() + scroller.scrollLeft
       - scrollerPos.left - sliderNav.navScroller.width());
      //element left + element width + scroller scroll left - scroller left - scroller width
    });
  }
};

$(function() {
  overflowNav.init();
  sliderNav.init();

  $(".menu-overflow").each(function() {
    var width = 0;
    $("li", this).each(function(){
      width += this.offsetWidth;
    });

    $(".menu-overflow__container > ul", this)[0].style.minWidth = width + "px";
  });
});