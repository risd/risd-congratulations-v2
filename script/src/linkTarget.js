var $ = global.jQuery;

module.exports = LinkTarget;

function LinkTarget() {
    if (!(this instanceof LinkTarget)) {
        return new LinkTarget();
    }

    // console.log('LinkTarget initialized.');

    $('a').each(function() {
      if ($(this).attr('href')) {
        var href = $(this).attr('href');
        if (href.indexOf('http://') === 0 || href.indexOf('https://') === 0) {
          $(this).attr('target', '_blank');
        }
      }
    });

}
