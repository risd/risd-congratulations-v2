var $ = global.jQuery;

module.exports = AlumniAccordion;

function AlumniAccordion() {
    if (!(this instanceof AlumniAccordion)) {
        return new AlumniAccordion();
    }

    // console.log('AlumniAccordion initialized.');


    $('.alumni__header').click(function(event) {
      $(this).parents('.alumni__person').toggleClass('toggled');
    });

}
