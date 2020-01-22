module.exports = openExternalLinkInNewWindow;

function openExternalLinkInNewWindow ( url ) {
  if ( url.includes( '//' ) ) {
    return 'target="_blank" rel="noopener"'
  }
  else {
    return ''
  }
}
