var $ = global.jQuery;

var imagesLoaded = require('imagesloaded');

module.exports = EdgeImageShift;

function EdgeImageShift() {
    if (!(this instanceof EdgeImageShift)) {
        return new EdgeImageShift();
    }

    // console.log('EdgeImageShift initialized.');

    var imageHeight;
    var windowHeight;
    var navHeight;
    var heightRange;
    var topShift;

    imagesLoaded.makeJQueryPlugin( $ );

    $('.page__edge-images').imagesLoaded( function() {
      setShiftValue($('.page__edge-images'));
    });

    $(window).resize(function() {
      setShiftValue($('.page__edge-images'));
    });

    function setShiftValue(edgeImage) {
      edgeImage.children('.page__edge-image').each(function() {
        imageHeight = $(this).height();
        windowHeight = $(window).height();
        navHeight = $('.desktop-nav').height();
        heightRange = windowHeight - imageHeight;
        topShift = heightRange / 2 + navHeight;
        $(this).css('top', topShift);
      });
    }

}
