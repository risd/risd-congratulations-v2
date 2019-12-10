var $ = global.jQuery;

module.exports = MainNav;

/**
 * Main Nav uses the @risd/ui nav component
 * to define its markup, and this script to
 * define extra interations. Such as
 *
 * - Adding markup for icons that assist in
 *   differentiating different link types
 * - Adding class toggling to show nav items
 */
function MainNav() {
  if (!(this instanceof MainNav)) {
    return new MainNav()
  }
  var headings = Headings()
  var externalLinks = ExternalLinks()
}

function Headings () {
  var classes = {
    root: 'main-nav__section-heading',
    toggle: 'main-nav__section-toggle',
    opened: 'main-nav__section--opened',
    link: 'main-nav__page-link',
  }

  init()

  // emitters would be nice
  return {}

  function init () {
    appendToogleButton()
    addToggleListeners()
  }

  function appendToogleButton () {
    $( `.${ classes.root }` )
      .each( function ( index, heading ) {
        var $heading = $( heading )

        $heading.append( `<span class="${ classes.toggle }">
          <svg viewBox="30 20 50 50">
            <path class="toggle-geometry" d="M47.2,61.4L34.9,49.2c-1.4-1.4-1.4-3.9,0-5.4c1.5-1.4,4-1.4,5.4,0l9.5,9.5l9.4-9.5c1.5-1.4,3.9-1.4,5.4,0 c1.4,1.5,1.4,4,0,5.4L52.6,61.4c-0.7,0.7-1.8,1.2-2.7,1.2C48.8,62.6,47.9,62.1,47.2,61.4z"/>
          </svg>
          </span>`
        )
      } )
  }

  function addToggleListeners () {
    $( `.${ classes.root }` )
      .on( 'click', toggleOpened )

    function toggleOpened ( event ) {
      var $clicked = $( event.target )

      if ( $clicked.hasClass( classes.link ) ||
           $clicked.parent().hasClass( classes.link ) ) {
        // clicking a link, no need to change the display
        return;
      }
      else if ( $clicked.hasClass( classes.root ) ) {
        var $heading = $clicked
      }
      else {
        var $heading = $clicked.closest( `.${ classes.root }` )  
      }
      
      // var currentKey = $heading.attr( 'key' )
      
      // closeOthers( currentKey )
      
      if ( $heading.hasClass( classes.opened ) ) {
        $heading.removeClass( classes.opened )
      }
      else {
        $heading.addClass( classes.opened )
      }
    }

    function closeOthers ( currentKey ) {
      $( `.${ classes.root }` ).each( function ( index, heading ) {
        var $heading = $( heading )
        var headingKey = $heading.attr( 'key' )
        if ( currentKey !== headingKey ) {
          $heading.removeClass( classes.opened )
        }
      } )
    }
  }
}

function ExternalLinks () {
  var classes = {
    link: 'main-nav__useful-link',
    icon: 'main-nav__useful-link-icon'
  }

  init()

  return {}

  function init () {
    appendExternalLinkIcon()
  }

  function appendExternalLinkIcon () {
    $( `.${ classes.link }` ).each( function ( index, link) {
      var $link = $( link )

      $link.append( `<span class="${ classes.icon }">
          <svg viewBox="10 10 60 60">
            <path class="external-geometry" d="M68.2,55.2L56,67.4c-1.4,1.4-3.9,1.4-5.4,0c-1.4-1.5-1.4-4,0-5.4l5.7-5.7H35.8c-2.1,0-3.8-1.8-3.8-3.8
              c0-2.2,1.8-3.8,3.8-3.8h20.4L50.6,43c-1.4-1.5-1.4-3.9,0-5.4c1.5-1.4,4-1.4,5.4,0l12.2,12.2c0.7,0.7,1.2,1.8,1.2,2.7
              C69.4,53.5,68.9,54.4,68.2,55.2z"/>
          </svg>
        </span>` )
    } )
  }
}
