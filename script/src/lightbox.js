module.exports = Lightbox;

/**
 * Lightbox with default configuration to
 * lightbox all webhook wysiwyg generated
 *
 * - Adds a lightbox container to the DOM.
 * - Adds a new image tag in the lightbox container
 *   for each lightbox image.
 * - Adds click events for preventing the default
 *   image wrapping anchor tag, and enables the
 *   lightbox instead
 *
 * elements on a page.
 * @param {object} opts
 * @param {string} opts.decorate Query selector string for all a tags
 *                               that contain images to lightbox.
 * @param {string} opts.appendTo Query selector string of element to
 *                               append the lightbox to.
 */
function Lightbox(opts) {
  if (!(this instanceof Lightbox)) return new Lightbox(opts);
  if (typeof opts !== 'object') opts = {};

  // console.log('Lightbox initialized.');

  // classes
  this.box = bem('lightbox');
  this.viewport = this.box('viewport');
  this.image = this.box('image');
  this.active = this.box.modifier('active');
  this.inactive = this.box.modifier('inactive');
  this.noscroll = this.box.modifier('noscroll');

  this.decorateQuery = opts.decorate || 'figure[data-type="image"] > a';
  var $decorated = this.decorate(this.decorateQuery);

  this.boxes = this.build(opts.appendTo || 'body');

  this.$images = this.addImages(this.boxes.$viewport, $decorated);

  $decorated.on('click', this.open.bind(this));
  this.boxes.$box.on('click', this.close.bind(this));
};

/**
 * Expects a click event whose target is within the scope of a
 * $(this.decorateQuery) element to find its lightbox image ID.
 * With the image ID, update the class list of this.$images
 * comparing lightbox IDs to reflect active/inactive state. Also
 * update the box & body state.
 *
 * @param  {object} event Click event
 * @return {undefined}
 */
Lightbox.prototype.open = function (event) {
  event.preventDefault();

  $(event.target).closest(this.decorateQuery).each(lightboxFor.bind(this));

  function lightboxFor (index, element) {
    var imageId = element.dataset.lightboxableImageId;
    this.$images.each(updateClasslist.bind(this, imageId));

    this.boxes.$box
      .removeClass(this.inactive())
      .addClass(this.active());

    document.body.classList.add(this.noscroll());
  }

  function updateClasslist (activeId, uindex, uelement) {
    if (uelement.dataset.lightboxId === activeId) {
      uelement.classList.add(this.active());
      uelement.classList.remove(this.inactive());
    }
    else {
      uelement.classList.add(this.inactive());
      uelement.classList.remove(this.active());
    }
  }
}

/**
 * Closes the lightbox. Both the box and body return to their
 * default state, not active.
 *
 * @return {undefined}
 */
Lightbox.prototype.close = function lightboxClose () {
  this.boxes.$box
    .removeClass(this.active())
    .addClass(this.inactive());

  document.body.classList.remove(this.noscroll());
}

/**
 * Looks through decorated images, and adds a new img tag to the
 * $viewport with the same source. These are the images that will
 * load in the lightbox.
 *
 * @param {object} $viewport  jQuery selector of the parent of the
 *                            lightbox images
 * @param {object} $decorated jQuery selector of images to clone into
 *                            the lightbox
 * @return {object} $this     jQuery selector of the lightbox images
 */
Lightbox.prototype.addImages = function ($viewport, $decorated) {
  $decorated.each(addem.bind(this));

  function addem (index, element) {
    var img = document.createElement('img');
    img.src = srcFor(element);
    img.dataset.lightboxId = element.dataset.lightboxableImageId;
    img.classList.add(this.image());
    img.classList.add(this.inactive());

    $viewport.append(img);
  }

  return $viewport.children();

  function srcFor (element) {
    var innerImage = $(element).find('img').get(0);
    if (innerImage) {
      if (innerImage.dataset.hasOwnProperty('resizeSrc')) {
        return innerImage.dataset.resizeSrc + '=s1200';
      }
      else {
        return element.href;
      }
    }
  }
};

/**
 * Decorate targets with lightbox attributes, to attach lightbox
 * functionality to thme.
 * Returns $decorated based on the selector.
 *
 * @param  {string|object} $query jQuery selector or string of
 *                                selector query
 * @return {object} $decorated
 */
Lightbox.prototype.decorate = function ($query) {
  if (typeof $query === 'string') $query = $($query);
  var $decorated = $query;
  $decorated.each(function (index, a) {
    a.dataset.lightboxableImageId = index;
  });
  return $decorated;
};

/**
 * Build the lightbox container.
 * Returns $viewport, the place where
 * images will end up going.
 *
 * @param  {string|object} $query jQuery selector or string of
 *                                selector query
 * @return {object} boxes
 * @return {object.$box} $box
 * @return {object.$viewport} $viewport
 */
Lightbox.prototype.build = function ($query) {
  if (typeof $query === 'string') $query = $($query);
  var box = document.createElement('div');
  box.classList.add(this.box());
  box.classList.add(this.inactive());

  var viewport = document.createElement('div');
  viewport.classList.add(this.viewport());

  box.appendChild(viewport);

  $query.append(box);

  return { $viewport: $(viewport), $box: $(box) };
};


/**
 * bem helper. base__element--modifier.
 *
 * base = bem('bs');
 * base()
 * // 'bs'
 * element = base('el');
 * element()
 * // 'bs__el'
 * modifier = element('mod');
 * modifier();
 * // 'bs__el--mod'
 * baseModifier = base.modifier('bmod');
 * // 'bs--bmod'
 *
 * @param  {string} base The base string
 * @return {function}
 */
function bem (base) {
  function element (element) {
    if (!element) return base;

    function modifier (modifier) {
      var baseElement = [base, element].join('__');
      if (!modifier) return baseElement;
      return function () {
        return [baseElement, modifier].join('--');
      }
    }

    return modifier;
  }

  element.modifier = function (modifier) {
    return function () {
      return [base, modifier].join('--');
    }
  }

  return element;
}
