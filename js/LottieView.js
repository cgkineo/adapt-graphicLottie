import Adapt from 'core/js/adapt';
import Lottie from 'libraries/lottie.min';

export default class LottieView extends Backbone.View {

  events() {
    return {
      'click .graphiclottie__rewind': 'onRewind',
      'click': 'onPlayPause'
    };
  }

  initialize() {
    const config = Adapt.course.get('_graphicLottie');
    const fileExtension = config._fileExtension || 'svgz';
    this._rex = new RegExp(`\\.${fileExtension}`, 'i');
    this.wasPaused = false;
    this.animation = null;
    this.setUpAttributeChangeObserver();
    this.setUpInviewListener();
    this.render();
  }

  setUpAttributeChangeObserver() {
    const observer = new MutationObserver(this.render.bind(this));
    observer.observe(this.el, { attributes: true });
  }

  setUpInviewListener() {
    this.$el.on('onscreen', this.onScreenChange.bind(this));
  }

  onScreenChange(event, measurements) {
    if (!this.animation || this.wasPaused) return;
    if (!measurements.onscreen || measurements.percentInview < 20) {
      this.animation.goToAndStop(0);
      return;
    }
    this.animation.play();
  }

  render() {
    if (!this.shouldRender) return;
    this._renderedSrc = this.src;
    const isAnimation = this._rex.test(this._renderedSrc);
    this.destroyAnimation();
    this.$el.html(Handlebars.templates.graphicLottie({
      _isAnimation: isAnimation,
      _src: this._renderedSrc,
      _showPauseControl: true,
      _showRewindControl: true
    }));
    if (isAnimation) this.createAnimation();
  }

  get canvas() {
    return this.$('canvas')[0];
  }

  get $player() {
    return this.$('.graphiclottie__player');
  }

  createAnimation() {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    this.animation = Lottie.loadAnimation({
      container: null,
      renderer: 'canvas',
      loop: true,
      autoplay: false, // we'll use checkIfOnScreen to control when playback starts
      path: this._renderedSrc,
      rendererSettings: {
        context: context, // the canvas context, only support "2d" context
        preserveAspectRatio: 'xMinYMin slice', // Supports the same options as the svg element's preserveAspectRatio property
        clearCanvas: true
      }
    });
    this.animation.addEventListener('data_ready', () => {
      canvas.height = this.animation.animationData.h;
      canvas.width = this.animation.animationData.w;
      this.animation.resize();
      this.animation.play();
      this.$player.addClass('is-graphiclottie-playing');
    });
  }

  onPlayPause() {
    this.animation[this.animation.isPaused ? 'play' : 'pause']();
    this.wasPaused = this.animation.isPaused;
    this.$player.toggleClass('is-graphiclottie-playing', !this.animation.isPaused);
    this.$player.toggleClass('is-graphiclottie-paused', this.animation.isPaused);
  }

  onRewind(event) {
    event.preventDefault();
    event.stopPropagation();
    this.animation[this.animation.isPaused ? 'goToAndStop' : 'goToAndPlay'](0);
  }

  destroyAnimation() {
    if (!this.animation) return;
    this.animation.stop();
    this.animation.destroy();
    this.animation = null;
  }

  get shouldRender() {
    return (this._renderedSrc !== this.src);
  }

  get src() {
    return this.$el.attr('src');
  }

  remove() {
    this.destroyAnimation();
    super.remove();
  }

}
