var $ = global.jQuery;

module.exports = CalendarAccordion;

function CalendarAccordion() {
    if (!(this instanceof CalendarAccordion)) {
        return new CalendarAccordion();
    }

    // console.log('CalendarAccordion initialized.');


    $('.calendar__title').click(function() {
      if ($(this).siblings('.calendar__description').length) {
        $(this).parents('.calendar__item').toggleClass('toggled');
      }
    });

}
