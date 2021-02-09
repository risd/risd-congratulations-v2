/**
 * the purpose of this test is to ensure that we aren't loosing
 * any objects in the swig representation of the cms.
 *
 * to do this, we should be able to write a template that counts
 * how many objects are in each content type. then verify that
 * number directly in the js object represetation of the data.
 */

const test = require( 'tape' )
const exec = require( 'child_process' ).execSync
const fs = require( 'fs' )

// prep swig
var swig = require( 'swig' )
swig.setDefaults( {
  loader: swig.loaders.fs(__dirname + '/..')
})
var swigFunctions = require('../libs/swig_functions').swigFunctions()
var swigFilters = require('../libs/swig_filters')
var swigTags = require('../libs/swig_tags')
swigFilters.init( swig )
swigTags.init( swig )
swig.setDefaults({ cache: false })

test( 'download-data', function ( t ) {

  t.plan( 1 )

  const output = exec( 'grunt download-data' ).toString()

  t.assert( output.indexOf( 'Done, without errors.' ) > 0, 'downloaded-data' )
} )

test( 'compare-cms-object-to-downloaded-data', function ( t ) {
  const data = JSON.parse(
      fs.readFileSync( './.build/data.json' )
        .toString()
  )

  // set data on swig
  swigFunctions.setData( data.data )
  swigFunctions.setTypeInfo( data.typeInfo )
  swigFunctions.setSettings( data.settings )
  swigFilters.setTypeInfo( data.typeInfo )

  const multipleContentTypes = allMultipleContentTypes( data )

  t.plan( multipleContentTypes.length )

  // create test template
  const testTemplateStrings = multipleContentTypes.map( function ( type ) {
    return `
      {% set count_${ type } = 0 %}
      {% for item in cms.${ type } %}
        {% set count_${ type } = count_${ type } + 1 %}
      {% endfor %}
      {{ '${ type }:' + count_${ type } }}
    `
  } )

  const testTemplateString = testTemplateStrings.join( '\n' )

  // setup swig params
  const params = Object.assign( { emitter: true }, swigFunctions.getFunctions() )
  swigFunctions.init()

  const testTemplateOutput = swig.render( testTemplateString, { locals: params } )

  const testTemplateResults = testTemplateOutput
    .split( '\n' )
    .filter( function ( line ) {
      return line.trim().length > 0
    } )
    .map( function ( line ) {
      const result = {}
      const resultArray = line.trim().split( ':' )
      result[ resultArray[ 0 ] ] = +resultArray[ 1 ]
      return result
    } )
    .reduce( function ( previous, current ) {
      const d = Object.assign( {}, previous, current )
      return d
    }, {} )

  const downloadedResults = multipleContentTypes
    .map( function ( type ) {
      const result = {}
      const items = Object.keys( data.data[ type ] )
        .map( function ( itemKey ) {
          return data.data[ type ][ itemKey ]
        } )
      const publishedItems = items
        .filter( function ( item ) {
          // as the generator does, remove items with no publish
          // date, or one that is in the future
          if ( ! item.publish_date ) {
            return false
          }

          var now = Date.now()
          var pdate = Date.parse( item.publish_date )

          if ( pdate > now + 1 * 60 * 1000 ) {
            return false
          }

          return true
        } )
      result[ type ] = publishedItems.length
      return result
    } )
    .reduce( function ( previous, current ) {
      const d = Object.assign( {}, previous, current )
      return d
    }, {} )

  multipleContentTypes.forEach( function ( type ) {
    t.assert(
      testTemplateResults[ type ] === downloadedResults[ type ],
      `${ type } count should match - ${ testTemplateResults[ type ] } == ${ downloadedResults[ type ] }`
    )
  } )
} )


function allMultipleContentTypes ( data ) {
  const contentTypes = []

  Object.keys( data.typeInfo ).forEach( function ( type ) {
    if ( data.typeInfo[ type ].oneOff === false ) {
      contentTypes.push( type )
    }
  } )

  return contentTypes
}
