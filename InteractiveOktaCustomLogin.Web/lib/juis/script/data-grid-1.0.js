/*
 * Data Grid
 *
 * Requires: juis.core-1.x
 *
 */

juis.dataGrid = (function() {
  /* Properties */

  /* Constructor Helpers */

  // First run setup
  function _setup(grid) {
    //restore selected state of any checked rows
    var rowSelectors = grid.querySelectorAll("input[name='row-selector']");
    //if there are row selectors
    if (rowSelectors.length > 0) {
      //separate change selectors for second and subsequent (body) selectors
      for (var i = 1; i < rowSelectors.length; i++) {
        _toggleRowSelection(rowSelectors[i]);
      }
    }
  }

  // Event binding
  function _bind(grid) {
    //grid selector click event
    var rowSelectors = grid.querySelectorAll("input[name='row-selector']");
    //if there are row selectors
    if (rowSelectors.length > 0) {
      //assign click event to master (header) selector
      rowSelectors[0].addEventListener("click", _clickRowSelectorMaster);
      
      //separate change selectors for second and subsequent (body) selectors
      for (var i = 1; i < rowSelectors.length; i++) {
        rowSelectors[i].addEventListener("change", _changeRowSelector);
      }
    }
  }

  /* Event Listeners */

  // 
  function _clickRowSelectorMaster(event) {
    var masterSelector = event.target;
    // Should use HTMLFormControlsCollection.namedItem() here but no IE support 
    // see https://developer.mozilla.org/en-US/docs/Web/API/HTMLFormControlsCollection/namedItem
    var rowSelectors = masterSelector.form.querySelectorAll("input[name='" + masterSelector.name + "']");

    //toggle checked state
    var check = masterSelector.checked;

    //set checked state for each element
    for (var i = 0; i < rowSelectors.length; i++) {
      rowSelectors[i].checked = check;
      _toggleRowSelection(rowSelectors[i]);
    }
  }

  // Select row on checkbox change
  function _changeRowSelector(event) {
    _toggleRowSelection(event.target);
  }

  /* Methods */

  function _toggleRowSelection(selector) {
    var row = selector.closest("tr");
    if (!row) {
      return;
    }

    row.setAttribute("aria-selected", selector.checked);

  }

  /* Public Methods */
  return {
    init: function() {
      //If there are no data grid, get out

      var grids = document.querySelectorAll(".c-data-grid");
      if (grids.length === 0) {
        return;
      }
      
      for (var i=0; i < grids.length; i++) {
        _setup(grids[i]);
        _bind(grids[i]);
      }
    }
  };
})();

document.addEventListener("DOMContentLoaded", function() {
  juis.dataGrid.init();
});
