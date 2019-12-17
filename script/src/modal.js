var $ = global.jQuery;

module.exports = Modal;

function Modal () {
  if (!(this instanceof Modal)) {
    return new Modal();
  }

  var dismissedKey = 'modal-dismissed'
  var showingClassName = 'modal--showing'

  var selectors = {
    root: '.modal',
    left: '.modal__star--left',
    right: '.modal__star--right',
    top: '.modal__star--top',
    bottom: '.modal__star--bottom',
    help: '.modal__help',
  }

  var $selectors = {}
  var nodes = {}

  // populate `$selectors` and `nodes` from `selectors`
  Object.keys( selectors ).forEach( function ( key ) {
    $selectors[ key ] = $( selectors[ key ] )
    nodes[ key ] = $selectors[ key ].get( 0 )
  } )

  return {
    show: show,
    dismiss: dismiss,
  }

  function show ( force ) {
    var dismissed = window.localStorage.getItem(dismissedKey)

    // determine whether to show modal or not
    var showModal = false;
    // do not show if previously dismissed
    if ( dismissed === "true" ) showModal = false;
    // do not show if coming from admissions site
    if ( document.referrer === "https://admissions.risd.edu/" ) showModal = false;
    // show if forced
    if ( force === true ) showModal = true;
    if ( showModal === false ) return;
    
    // show the modal
    document.body.classList.add(showingClassName)

    // remove animation duration
    var animationDuration = nodes.root.style.getPropertyValue( '--animation-duration' )
    nodes.root.style.setProperty( '--animation-duration', '0ms' )

    // position modal elements to be animated in
    var topBBox = nodes.top.getBoundingClientRect()
    var topStartPosition = ( topBBox.top + topBBox.height ) * -1
    nodes.top.style.setProperty('--animation-translate', `${ topStartPosition }px`)

    var bottomBBox = nodes.bottom.getBoundingClientRect();
    var bottomStartPosition = ( bottomBBox.bottom + bottomBBox.height )
    nodes.bottom.style.setProperty('--animation-translate', `${ bottomStartPosition }px`)

    var leftBBox = nodes.left.getBoundingClientRect();
    var leftStartPosition = ( leftBBox.left + leftBBox.width ) * -1
    nodes.left.style.setProperty('--animation-translate', `${ leftStartPosition }px`)

    var rightBBox = nodes.right.getBoundingClientRect();
    var rightStartPosition = ( ( window.innerWidth - rightBBox.right ) + rightBBox.width )
    nodes.right.style.setProperty('--animation-translate', `${ rightStartPosition }px`)
    console.log( rightBBox )

    var helpBBox = nodes.help.getBoundingClientRect();
    var helpStartPosition = ( helpBBox.bottom + helpBBox.height )
    nodes.help.style.setProperty('--animation-translate', `${ helpStartPosition }px`)
    console.log( helpBBox )

    // restore animation duration
    nodes.root.style.setProperty( '--animation-duration', animationDuration )

    // animate in
    setTimeout( function () {
      $selectors.root.addClass( 'animate-in' )  
    }, 500 )
  }

  function dismiss () {
    document.body.classList.remove(showingClassName)
    window.localStorage.setItem(dismissedKey, "true")
  }
}
