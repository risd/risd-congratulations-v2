var $ = global.jQuery;

module.exports = DesktopMenuToggle;

function DesktopMenuToggle() {
    if (!(this instanceof DesktopMenuToggle)) {
        return new DesktopMenuToggle();
    }

    // console.log('DesktopMenuToggle initialized.');


    $('.desktop-nav__column').click(function() {
      $(this).find('.desktop-nav__list, .desktop-nav__header-link, .desktop-nav__header').toggleClass('toggled');
      $(this).siblings().find('.desktop-nav__list, .desktop-nav__header-link, .desktop-nav__header').removeClass('toggled');
    });

    $('main, footer').click(function() {
      $('.desktop-nav__list, .desktop-nav__header-link, .desktop-nav__header').removeClass('toggled');
    });
}
