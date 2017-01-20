/*
 * JUIS library polyfills adding functionality mising from browsers with bad upbringings
 *
 */

if (!Element.prototype.closest) {
  document.write('<script src="../script/closest.js"><\/script>');
}

// Class list
if (!("classList" in document.createElement("_"))) {
  document.write('<script src="../script/classList.js"><\/script>');
}

// Dataset for IE < 11
if (!Modernizr.dataset) {
  document.write('<script src="../script/dataset-shim.js"><\/script>');
}
