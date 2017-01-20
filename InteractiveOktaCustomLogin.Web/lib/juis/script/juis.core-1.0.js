var juis = {
  //hide/show an element using aria properties
  setVisibility: function(element, visible) {
    element.setAttribute("aria-hidden", !visible);
  },
  setExpandedState: function(element, expanded) {
    element.setAttribute("aria-expanded", !expanded);
  },
  sanitiseRegEx: function (s) {
    return s.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
  },
  keyModiferActive: function(event) {
    return event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey;
  },
  //returns the position of an element in a list
  getElementPositionInList: function(element, list) {
    for (var i=0; i < list.length; i++) {
      if (list[i] === element) {
        return i;
      }
    }
  },
};
