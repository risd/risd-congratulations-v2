/*
This module filters calendar items based on audience selection.
The audience options to choose from can change at a given time of the year. (Early-decision could be the only option at a certain point of the year, but at another point, early-decision, first-year and transfer can all be options to choose from.)
There are multiple use cases to account for:
  1. A user coming to a calendar style page for the first time.
    The user should only see the audience filter buttons (first-year, transfer etc). The buttons in this state should have styling that makes them larger. The calendar items should be hidden until an audience is selected. Once a button is clicked, the buttons should shrink and dates relevant to the audience selected should appear. The selection can change if another button is clicked.
  2. A user visiting a calendar style page, not for the first time, with the same audience options active. This could mean that the user is revisiting a calendar page, or that they have visited a calendar page before and are now visiting a different one.
    The user's last audience selection should be remembered by the browser and display the dates for that selection. This would mean the page appears the same as the end of Case 1.
  3. A user visiting a calendar style page, not for the first time, with different options active. This could mean that the user is revisiting a calendar page, or that they have visited a calendar page before and are now visiting a different one.
    If the last audience selected is still an active option, then run Case 2.
    If the last audience selected is now inactive, then run Case 1.
  4. A user visiting the site for the first time when there is only 1 audience option active.
    The user should not have to pick their audience in this case. The audience selection should happen automatically as there is only 1 audience option.

Case 1 and 2 are currently working, but Case 3 & 4 was not considered when this code was written. That might mean that all of this needs to be re-written.
*/

var $ = global.jQuery;
var _ = global._;

module.exports = CalendarFilter;

function CalendarFilter() {
  if (!(this instanceof CalendarFilter)) {
      return new CalendarFilter();
  }

  // console.log('CalendarFilter initialized.');
  
  var calendarGroups = $('.calendar__date-group');
  var audienceItems = $('.calendar__item').not('.calendar__item--no-event');
  var dayButtons = $('.calendar__day-group');


  /* Initial state --- */

  var audienceFilter = audienceFilterGetSet( onSetAudienceFilter )

  // Check to see if the audienceFilter is one of the currently available audience options
  if ( audienceFilter() ) {
    // audienceFilter exists as a current option based on the localStorage or URL hash.
    // Case 2 is run as part of the audienceFilterGetSet initializer
  }
  else if ( audienceFilter.options.length > 0 ) {
    // Either there wasn't an audienceFilter set, or it was not in the current set of options.
    // Case 1 & 4 covered here.

    if ( audienceFilter.options.length > 1 ) {
      // initial states, there is more than one option, let the user decide which they want.
      $('.calendar__audience').addClass('initial--transition');
      dayButtons.addClass('initial');  
    } else {
      // only one option, lets set it for them.
      audienceFilter( audienceFilter.options[ 0 ] )
    }
  }
  else {
    // No options to filter from, lets show all items.
    audienceItems.addClass('filtered');
  }

  if (dayButtons.length > 0) {
    var dayButtonInitial = $('.calendar__day-group').first();
    filterDays(dayButtonInitial);
  }


  /* Handlers to update --- */

  $('.calendar__audience').click(function(event) {
    event.preventDefault();
    var audienceString = event.target.href.split( '#' )[ 1 ]
    audienceFilter( audienceString )
  });

  $('.calendar__day-group').click(function(event) {
    event.preventDefault();
    filterDays($(this));
  });


  /**
   * Get or set the `audienceFilter` value. Get the value by calling the
   * function returned without arguments. Set the value by calling the
   * function returned with a single argument representing the value to set.
   * 
   * @param  {function} onSetFn Function run with the current value whenever set.
   * @return {function} getSet  Function that sets or gets the current `audienceFilterString value.
   */
  function audienceFilterGetSet ( onSetFn ) {
    if ( typeof onSetFn !== 'function' ) onSetFn = function functor ( value ) { return value; }

    /**
     * The audience strings available to the rest of the page.
     * For example: [ 'early-decision', 'transfer' ]
     * 
     * @type {Object} [ string ]
     */
    var calendarAudienceOptions = $.map( $('.calendar__audience'), function ( element ) {
      return element.href.split( '#' )[ 1 ]
    } )
    calendarAudienceOptions = _.uniq(calendarAudienceOptions); // remove duplicate strings from array

    var audienceFilterString = window.localStorage.getItem( 'audienceFilter' );
    var currentHash = window.location.hash.substring(1);

    // Set the audienceFilterString based on the hash
    if (currentHash.length > 0 && audienceFilterString !== currentHash) {
      audienceFilterString = currentHash;
    }

    if ( calendarAudienceOptions.indexOf( audienceFilterString ) === -1 ) {
      audienceFilterString = undefined;
    }

    // initialize
    onSetFn( audienceFilterString )

    function getSet ( x ) {
      if ( ! arguments.length ) return audienceFilterString;
      audienceFilterString = x;
      onSetFn( audienceFilterString )
      return this;
    }

    getSet.options = calendarAudienceOptions;

    return getSet;
  }

  /**
   * onSetAudienceFilter is a function that captures all of the side effects
   * of setting the `audienceFilterString` value.
   * 
   * @param  {string} audienceFilterString The audienceFilter value to set
   * @return {[type]}                      [description]
   */
  function onSetAudienceFilter( audienceFilterString ) {
    if ( typeof audienceFilterString === 'string' ) {
      var audienceHref = '#' + audienceFilterString;
      $( 'a[href="' + audienceHref + '"]').addClass( 'active' ).siblings().removeClass( 'active' );
      window.localStorage.setItem( 'audienceFilter', audienceFilterString )
      if ( window.location.hash !== audienceHref ) {
        history.replaceState( {}, '', audienceHref )
      }

      filterAudiences( audienceFilterString )
      filterGroupTitles()
      filterDayFilters()
    }
  }

  function filterAudiences(filter) {
    var filteredItems = $('.' + filter + '');

    if (filteredItems.length === 0) {
      $('.calendar__item--no-event').addClass('show');
    } else {
      $('.calendar__item--no-event').removeClass('show');
    }

    $('.calendar__audience').removeClass('initial');
    $('.calendar__item').removeClass('filtered');
    filteredItems.addClass('filtered');
  }

  function filterGroupTitles() {
    calendarGroups.each(function() {
      $(this).children('.calendar__section-title').removeClass('filtered');
      var activeCalendarItem = $(this).children('.filtered');
      if (activeCalendarItem.length > 0) {
        $(this).children('.calendar__section-title').addClass('filtered');
      }
    });

  }

  function filterDays(filter) {
    filter.addClass('active').siblings().removeClass('active');
    var dayFilter = filter.attr('href');
    dayFilter = dayFilter.replace('\#','');

    audienceItems.each(function() {
      $(this).removeClass('hide');
      if ($(this).hasClass(dayFilter) !== true) {
        $(this).addClass('hide');
      }
    });
  }

  function filterDayFilters() {
    if (dayButtons.hasClass('initial') === true) {
      dayButtons.removeClass('initial');
    }
  }

}
