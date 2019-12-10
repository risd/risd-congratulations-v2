var $ = global.jQuery;

module.exports = DesktopNavHeight;

function DesktopNavHeight() {
  if (!(this instanceof DesktopNavHeight)) {
    return new DesktopNavHeight();
  }

  // console.log('DesktopNavHeight initialized.');

  var updater = updateNavValuesWith([setBodyMargin, setNavHeight]);

  updater();
  $(window).resize(updater);

  function setBodyMargin(bodyMargin) {
    $("body").css("paddingTop", bodyMargin);
  }

  function setNavHeight(navHeight) {
    $(".desktop-nav").css("height", navHeight);
  }

  function updateNavValuesWith(updateFunctions) {
    var navHeight;
    var lastNavHeight;

    function getNewNavHeight() {
      if ($(".desktop-nav").is(":visible")) {
        navHeight = getMaxAnchorHeight(
          $(".desktop-nav__header-link").not(".desktop-nav__logo")
        );
      } else {
        navHeight = $(".mobile-nav").outerHeight();
      }
      if (lastNavHeight !== navHeight) {
        return navHeight;
      } else {
        return false;
      }

      function getMaxAnchorHeight($navAnchors) {
        var maxHeight = 0;
        $navAnchors.each(function() {
          var anchorHeight = $(this).outerHeight();
          maxHeight = Math.max(anchorHeight, maxHeight);
        });
        return maxHeight;
      }
    }

    return function() {
      var newHeight = getNewNavHeight();
      if (newHeight) {
        updateFunctions.forEach(function(updateFuntion) {
          updateFuntion(newHeight);
        });
      }
    };
  }
}
