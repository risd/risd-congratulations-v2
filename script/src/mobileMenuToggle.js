var $ = global.jQuery;

module.exports = MobileMenuToggle;

function MobileMenuToggle(opts) {
  if (!(this instanceof MobileMenuToggle)) {
    return new MobileMenuToggle(opts);
  }

  // console.log('MobileMenuToggle initialized.');

  $('.mobile-nav__toggle').click(function() {
    $('.mobile-nav__content').toggleClass('active');
    $(this).toggleClass('active');
  });

  $('.mobile-nav__header-link').click(function() {
    $(this).parent().siblings('.mobile-nav__list').toggleClass('active');
    $(this).toggleClass('active');
  });

}
