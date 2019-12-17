global.jQuery = require('jquery');
global.$ = global.jQuery;
global._ = require('lodash');

var { hydrateComponents } = require('@risd/react-hydrator');
var { themes } = require('@risd/ui');

// Hydrate React components
hydrateComponents(themes.congratulationsV2);

// unhide nav element once it's hydrated
const navElement = document.querySelector('[data-react-component="Nav"]');
navElement.style.display = 'block';

var galleries = require('./galleries')({
  selector: '[data-gallery-spec]',
  attribute: 'data-gallery-spec',
})

var mainNav = require( './main-nav-v2' )()
var modal = require( './modal' )()
window.modal = modal

modal.emitter.on( 'show', function () {
  if ( galleries && galleries[ 0 ] && typeof galleries[ 0 ].pause === 'function' ) {
    console.log( 'pause-on-show' )
    galleries[ 0 ].pause()
  }
} )

modal.emitter.on( 'dismiss', function () {
  if ( galleries && galleries[ 0 ] && typeof galleries[ 0 ].resume === 'function' ) {
    console.log( 'resume-on-dismiss' )
    galleries[ 0 ].resume()
  }
} )

modal.show(true)

// var exampleModule = require('./exampleModule.js')();
// var stickyNav = require('./stickyNav.js')();
// var mobileMenuToggle = require('./mobileMenuToggle.js')();
// var desktopMenuToggle = require('./desktopMenuToggle.js')();
// var desktopNavHeight = require('./desktopNavHeight.js')();
var resourceImageSort = require('./resourceImageSort.js')();
var wysiwygLightbox = require('./lightbox.js')();
/*var alumniImageLightbox = require('./lightbox.js')({
  decorate: '.alumni__portrait'
});*/
/*var programImageLightbox = require('./lightbox.js')({
  decorate: '.program__image'
});*/
var resourceImageLightbox = require('./lightbox.js')({
  decorate: ".resource__image"
});
var smartquotes = require('smartquotes')();
var linkTarget = require('./linkTarget.js')();
// var calendarFilter = require('./calendarFilter.js')();
var calendarAccordion = require('./calendarAccordion.js')();
var alumniAccordion = require('./alumniAccordion.js')();
var edgeImageShift = require('./edgeImageShift.js')();
