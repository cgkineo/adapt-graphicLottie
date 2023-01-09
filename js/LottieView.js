import Adapt from 'core/js/adapt';
import Lottie from 'libraries/lottie.min';
import _ from 'underscore';

export default class LottieView extends Backbone.View {

  events() {
    return {
      'click .graphiclottie__playpause': 'onPlayPauseClick',
      'click': 'onGeneralPlayPause'
    };
  }

  initialize() {
    _.bindAll(this, 'render', 'onScreenChange', 'update', 'onDataReady');
    this.config = Adapt.course.get('_graphicLottie');
    const fileExtension = this.config._fileExtension || 'svgz';
    this._rex = new RegExp(`\\.${fileExtension}`, 'i');
    this.hasUserPaused = false;
    this.isDataReady = false;
    this.animation = null;
    this.setUpAttributeChangeObserver();
    this.setUpListeners();
    this.render();
  }

  setUpAttributeChangeObserver() {
    const observer = new MutationObserver(this.render);
    observer.observe(this.el, { attributes: true });
  }

  setUpListeners() {
    this.$el.on('onscreen', this.onScreenChange);
    this.listenTo(Adapt, 'device:resize', this.render);
  }

  onScreenChange(event, { onscreen, percentInview } = {}) {
    if (!this.animation) return;
    const isOffScreen = (!onscreen || percentInview < (this.config._onScreenPercentInviewVertical ?? 1));
    if (isOffScreen) return this.onOffScreen();
    this.onOnScreen();
  }

  onOffScreen() {
    // disable animation if already playing and should only play on first inview
    if (this.hasStarted && this.config._playFirstViewOnly) {
      this.animation.loop = 0;
      this.animation.goToAndStop(this.animation.totalFrames, true);
      this.pause(true);
      return;
    }
    // if not looping, an animation will need to be rewound/stopped before it can be replayed
    if (!this.config._playFirstViewOnly && this.isLoopsComplete) {
      this.rewind();
      return;
    }
    if (this.isPaused || this.hasUserPaused || !this.config._offScreenPause) return;
    this.pause(true);
    if (this.config._offScreenRewind) this.rewind();
  }

  onOnScreen() {
    if (!this.isPaused || this.isLoopsComplete) return;
    this.$player.removeClass('is-graphiclottie-nocontrols');
    if (!this.config._autoPlay || this.hasUserPaused) return;
    this.play(true);
  }

  play(noControls = false) {
    this.animation.play();
    this.update();
    if (noControls) this.$player.removeClass('is-graphiclottie-nocontrols');
  }

  pause(noControls = false) {
    if (noControls) this.$player.addClass('is-graphiclottie-nocontrols');
    this.animation.pause();
    this.update();
  }

  get isPaused() {
    return this.animation.isPaused;
  }

  togglePlayPause(noControls) {
    this[this.isPaused ? 'play' : 'pause'](noControls);
  }

  rewind() {
    this.animation.stop();
    this.animation[this.isPaused ? 'goToAndStop' : 'goToAndPlay'](0, true);
    this.update();
  }

  update() {
    if (this.isLoopsComplete) this.$player.addClass('is-graphiclottie-nocontrols');
    this.$player.toggleClass('is-graphiclottie-playing', !this.isPaused);
    this.$player.toggleClass('is-graphiclottie-paused', this.isPaused);
    Adapt.a11y.toggleEnabled(this.$player.find('.graphiclottie__rewind'), this.hasStarted);
  }

  render() {
    if (!this.shouldRender) return;
    this._renderedSrc = this.src;
    const isAnimation = this._rex.test(this.src);
    this.destroyAnimation();
    this.$el.html(Handlebars.templates.graphicLottie({
      ...this.config,
      _isAnimation: isAnimation,
      _src: this.src,
      alt: this.alt
    }));
    if (!isAnimation) return;
    this.createAnimation();
  }

  get canvas() {
    return this.$('canvas')[0];
  }

  get $player() {
    return this.$('.graphiclottie__player');
  }

  get hasStarted() {
    return this.animation.currentFrame > 0;
  }

  get isFinished() {
    // if not looping, Lottie will stop one frame before the end and not complete the loop or update counts accordingly
    return this.animation.currentFrame >= this.animation.totalFrames - 1;
  }

  get isLoopsComplete() {
    return this.animation._completedLoop || (this.isFinished && this.animation.playCount === this.animation.loop);
  }

  createAnimation() {
    const loop = this.config._loops;
    this.animation = Lottie.loadAnimation({
      container: null,
      renderer: 'canvas',
      loop: loop === -1 ? true : loop,
      autoplay: false, // we'll use checkIfOnScreen to control when playback starts
      path: this.src,
      rendererSettings: {
        context: this.canvas.getContext('2d'), // the canvas context, only support "2d" context
        preserveAspectRatio: 'xMinYMin slice', // Supports the same options as the svg element's preserveAspectRatio property
        clearCanvas: true
      }
    });
    this.animation.addEventListener('data_ready', this.onDataReady);
    this.animation.addEventListener('complete', this.update);
    this.animation.addEventListener('loopComplete', this.update);
    this.animation.addEventListener('enterFrame', this.update);
  }

  onDataReady() {
    this.isDataReady = true;
    this.canvas.height = this.animation.animationData.h;
    this.canvas.width = this.animation.animationData.w;
    this.animation.resize();
    this.pause();
    this.rewind();
    this.trigger('ready');
  }

  onGeneralPlayPause() {
    if (!this.config._showPauseControl || this.isLoopsComplete) return;
    this.togglePlayPause();
    this.hasUserPaused = this.isPaused;
    if (this.hasUserPaused && this.config._onPauseRewind) this.rewind();
  }

  onPlayPauseClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onGeneralPlayPause();
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
    const small = this.$el.attr('data-small');
    const large = this.$el.attr('data-large');
    const src = this.$el.attr('src');
    return src || (Adapt.device.screenSize === 'small' ? small : large) || large;
  }

  get alt() {
    this._alt = this.$el.attr('aria-label') || this.$el.attr('alt') || this._alt;
    this.$el.removeAttr('aria-label attr');
    return this._alt;
  }

  remove() {
    this.destroyAnimation();
    super.remove();
  }

}
