module.exports = cssTimeToMS;

// cssTime : String, defaulMS : Number? => ms : Number
function cssTimeToMS ( cssTime, defaultMS ) {
  if ( ! defaultMS ) defaultMS = 300
  if ( cssTime.endsWith( 'ms' ) ) {
    var ms = Number( cssTime.slice( 0, -2 ) )
  }
  else if ( cssTime.endsWith( 's' ) ) {
    var ms = Number( cssTime.slice( 0, -1 ) ) * 1000
  }
  else {
    var ms = defaultMS
  }
  return ms;
}
