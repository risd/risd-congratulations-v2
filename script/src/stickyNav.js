var $ = global.jQuery;

module.exports = StickyNav;

function StickyNav() {
  if (!(this instanceof StickyNav)) {
    return new StickyNav();
  }
  // console.log('StickyNav initialized.');

  stickyHeader();

  function stickyHeader() {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 1;
    var navbarHeight = $('.desktop-nav').outerHeight();
    var disableSticky = false;

    hoverCheck();

    $(window).scroll(function() {
      didScroll = true;
    });
    setInterval(function() {
      if (didScroll) {
        hasScrolled();
        didScroll = false;
      }
    }, 250);

    function hoverCheck() {
      $('.desktop-nav').hover(function() {
        disableSticky = true;
      }, function() {
        disableSticky = false;
      });
    }

    function hasScrolled() {
      var scrollTopPos = $(window).scrollTop();
      // console.log(scrollTopPos);
      if (Math.abs(lastScrollTop - scrollTopPos) <= delta) {
        return;
      }
      if (disableSticky === false) {
        if (scrollTopPos > lastScrollTop && scrollTopPos > navbarHeight) {
          $('.desktop-nav').removeClass('desktop-nav--down').addClass('desktop-nav--up');
          $('.desktop-nav__list, .desktop-nav__header-link, .desktop-nav__header').removeClass('toggled');
        } else {
          if ((scrollTopPos + $(window).height()) < $(document).height()) {
            $('.desktop-nav').removeClass('desktop-nav--up').addClass('desktop-nav--down');
          }
        }
      }

      lastScrollTop = scrollTopPos;
    }
  }
}
