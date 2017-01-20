# JUIS Source

Build your web site the JLT way!

## Getting Started

Install the JUIS source with Bower, NPM or directly from Github.

### Blocking Scripts

For performance reasons, scripts that block rendering (i.e. those loaded in the `<head>`) are best avoided. In the rare circumstance that a script signficant impact on rendering, you'll need to include it here.

JUIS uses a custom build of [Modernizr](http://modernizr.com/download/?-backgroundsize-csscalc-flexbox-flexboxtweener-geolocation-input-inputtypes-mediaqueries-queryselector-serviceworker-svg-setclasses-shiv) to maintain compatability with older web browsers (namely Internet Explorer versions 8-10).

```<script src="/path/to/script/jlti.modernizr.js"></script>```

### CSS

Add a reference to the CSS in the HTML `<head>`:

```<link rel="stylesheet" href="/path/to/css/project.css">```

### Remaining Scripts

And the JavaScript in the footer (or superior lazy-loading equivalent):

```<script src="/path/to/script/juis.js"></script>```

### [Bower](http://bower.io/)

To try out JUIS locally, run the command:

```bower install juis```

Once you've decided to keep it, follow the Bower instructions to [save packages](http://bower.io/#save-packages):

```bower install juis --save```

### [NPM](https://www.npmjs.com/package/juis)

To try out JUIS locally, run the command:

```npm install juis```

Use the switch `--save-dev` to add it to your project's [package.json](https://docs.npmjs.com/files/package.json):

```npm install juis --save-dev```

## Set Up

### Requirements

Other than Sass (and Ruby which Sass requires), consider most of this section optional. If you have a different way of achieving the same results that you're comfortable with, stick with it.

You may need to install a few libraries to make your life better:
- [Node JS](https://nodejs.org/)
- [Ruby](https://www.ruby-lang.org/en/)

If you're using Windows, check your Path has registered correctly:
- Open a command window (Windows Key + R, type `cmd` and hit Enter).
- Run `npm` and then `gem`.
- If you encounter an error on either, log out and back in.

Once you have Node and Ruby running, these libraries:
- [Sass](http://sass-lang.com/install)
- [Bower](http://bower.io/#install-bower)
- [NPM Updater](https://www.npmjs.com/package/npm-check-updates)
- [Grunt](http://gruntjs.com/getting-started)

## Customisation

If you want to vary from the JUIS standard, duplicate the relevant source file in your project and alter the path reference appropriately. As long as you stay within the modular naming scheme provided you can safely modify the code as required.
