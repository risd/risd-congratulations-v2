global.jQuery = global.$ = require('jquery');
var EventEmitter = require( 'events' )

module.exports = Galleries;

function Galleries ( options ) {
  if ( ! ( this instanceof Galleries ) ) return new Galleries( options )

  if ( ! options ) {
    console.log( 'Pass in an options object : { selector, attribute } to initialize galleries.' )
    return;
  }

  var selector = options.selector
  var attribute = options.attribute
  var initialDelay = options.intialDelay || 500
  var duration = options.duration || 1500
  var ERROR_VALUE = undefined

  var galleries = $( selector )
    .map( extractSpec( { attribute: attribute, errorValue: ERROR_VALUE } ) )
    .get() // returns a regular object, switching back to a signature of ( data, index ) instead of ( index, data )
    .filter( exclude( ERROR_VALUE ) )
    .map( cycleManager( { initialDelay: initialDelay, duration: duration } ) )

  return galleries;
}

function exclude ( excludeValue ) {
  return function filterExcludeValue ( value ) {
    return excludeValue !== value;
  }
}

function extractSpec ( options ) {
  var attribute = options.attribute
  var errorValue = options.errorValue

  return extractSpecForElement;

  function extractSpecForElement ( index, element ) {
    var $element = $( element )
    try {
      var specs = JSON.parse( $element.attr( attribute ) )
    } catch ( error ) {
      console.log( 'Could not initalize gallery at:' )
      console.log( element )
      return errorValue;
    }
    // must wrap in an array for jquery to treat as a normal array
    // even though the specs object is an array already
    return [specs];
  }
}

function cycleManager ( options ) {
  var initialDelay = options.initialDelay
  var duration = options.duration

  return cycleManagerForSpecs;

  function cycleManagerForSpecs ( specs ) {
    var previous = false
    var current = 0

    var emitter = new EventEmitter()
    var paused = false;

    cycle()

    return {
      pause: pauseCycle,
      resume: resumeCycle,
      emitter: emitter,
    }

    function cycle () {
      // nothing to cycle through
      if ( specs.length === 1 ) return;
      if ( paused ) return;

      setTimeout( initialFrame, initialDelay )
    }

    function pauseCycle () {
      paused = true
      emitter.emit( 'paused' )
    }

    function resumeCycle () {
      paused = false
      setTimeout( initialFrame, initialDelay )
    }

    function initialFrame () {
      if ( paused ) return;
      setInterval( showNext, duration )
    }

    function showNext () {
      if ( paused ) return;
      previous = nextIndex( previous )
      current = nextIndex( current )
      emitter.emit( 'next', { previous, current } )
      showSpec( specs[ current ] )
      hideSpec( specs[ previous ] )
    }

    function nextIndex ( index ) {
      if ( index === false ) {
        return 0
      }
      else if ( index === specs.length - 1 ) {
        return 0
      }
      else {
        return index += 1
      }
    }

  }
}


/**
 * spec : [ {
 *    background_image?: {
 *      querySelector: '',
 *      class: '',
 *      image: { resize_url }
 *    },
 *    color?: {
 *      querySelector: '',
 *      class: '',
 *      classValue: '',
 *    }
 *  } ]
 */

function showSpec ( spec ) {
  if ( validSpec( spec.background_image ) ) {
    showToggleClassSpec( spec.background_image )
  }
  if ( validSpec( spec.color ) ) {
    showToggleClassSpec( spec.color )
  }
}

function hideSpec ( spec ) {
  if ( validSpec( spec.background_image ) ) {
    hideToggleClassSpec( spec.background_image )
  }
  if ( validSpec( spec.color ) ) {
    hideToggleClassSpec( spec.color )
  }
}

function showToggleClassSpec ( toggleClassSpec ) {
  // $( toggleClassSpec.querySelector ).addClass( toggleClassSpec.class )
  document
    .querySelectorAll( toggleClassSpec.querySelector )
    .forEach( addClass )

  function addClass ( element ) {
    element.classList.add( toggleClassSpec.class )
  }
}

function hideToggleClassSpec ( toggleClassSpec ) {
  // $( toggleClassSpec.querySelector ).removeClass( toggleClassSpec.class )
  document
    .querySelectorAll( toggleClassSpec.querySelector )
    .forEach( removeClass )

  function removeClass ( element ) {
    element.classList.remove( toggleClassSpec.class )
  }
}

function validSpec ( spec ) {
  return spec && spec.querySelector && spec.class
    ? true
    : false
}
