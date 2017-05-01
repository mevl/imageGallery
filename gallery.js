(() => {
  'use strict';

  class Gallery {
    /**
     * Set the initial options, add event listener, preload images (if preload param is true).
     *
     * @param {HtmlElement} element The thumbnails container element.
     * @param {object} options The options object.
     */
    constructor( {element, options = {}} ) {
      const defaultOptions = {
        largeSuffix: '-lg',
        thumbSuffix: '-thumb',
        imagesSelector: 'a img',
        galleryElementSelector: '#largeImg',
        preload: true,
        transitionTime: 200,
      };
      this.options = Object.assign({}, defaultOptions, options);
      this.images = element.querySelectorAll(this.options.imagesSelector);
      if (!this.images.length) {
        throw new Error('Images is not found.');
      }
      if (!this.galleryElement) {
        this.galleryElement = document.querySelector(this.options.galleryElementSelector);
      }
      if (!this.images.length) {
        throw new Error('Gallery elemnet is not found.');
      }
      if (this.options.preload) {
        this.preload();
      }
      element.addEventListener('click', this.onClick.bind(this));
    }

    /**
     * Preload large images in the invisible container
     */
    preload() {
      const preloadEl = document.createElement('div');
      preloadEl.style.visibility = 'hidden';
      Array.prototype.forEach.call(this.images, (image) => {
        preloadEl.appendChild(this.getLargeImage(image));
      });
      document.body.appendChild(preloadEl);
    }

    /**
     * Get the large image URI by the thumbnail element.
     *
     * @param {HtmlElement} thumbImage The sourse thumbnail image element.
     * @returns {string} The large image URI (can be used for source attribute).
     */
    getLargeImageSrc(thumbImage) {
      return thumbImage.src.indexOf(this.options.thumbSuffix)
        ? thumbImage.src.replace(new RegExp(this.options.thumbSuffix), this.options.largeSuffix)
        : thumbImage.src;
    }

    /**
     * Get the thumb image parent title by the thumbnail element.
     *
     * @param {HtmlElement} thumbImage The sourse thumbnail image element.
     * @returns {string} The large image title (can be used for alt or title attributes).
     */
    getLargeImageAlt(thumbImage) {
      return thumbImage.parentElement.title;
    }

    /**
     * Get the large image element by the thumbnail element.
     *
     * @param {HtmlElement} thumbImage The sourse thumbnail image element.
     * @returns {HtmlElement} The large image Html element.
     */
    getLargeImage(thumbImage) {
      const img = document.createElement('img');
      img.setAttribute('src', this.getLargeImageSrc(thumbImage));
      return img;
    }

    /**
     * Onclick event callback.
     *
     * @param {event} event.
     */
    onClick(event) {
      event.preventDefault();
      const thumbImage = (event.target.tagName === 'IMG') ? event.target : event.target.querySelector('img');
      this.galleryElement.classList.add('hidden');
      setTimeout(() => {
        this.galleryElement.src = this.getLargeImageSrc(thumbImage);
        this.galleryElement.alt = this.getLargeImageAlt(thumbImage);
        this.galleryElement.classList.remove('hidden');
      }, this.options.transitionTime);
    }
  }

  window.Gallery = Gallery;
})();
