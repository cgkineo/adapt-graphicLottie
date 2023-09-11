import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import Lottie from 'libraries/lottie.min';
import documentModifications from 'core/js/DOMElementModifications';
import ReactDOM from 'react-dom';
import React from 'react';
import { templates } from 'core/js/reactHelpers';

export default class LottieView extends Backbone.View {

  events() {
    return {
      click: this.onClick
    };
  }

  initialize({ replacedEl }) {
    _.bindAll(this, 'render', 'onScreenChange', 'onDataReady', 'checkVisua11y');
    this.replacedEl = replacedEl;
    this.syncAttributes();
    const fileExtension = this.config._fileExtension || 'svgz';
    this._rex = new RegExp(`\\.${fileExtension}`, 'i');
    this.setUpAttributeChangeObserver();
    this.setUpListeners();
    this.render();
  }

  get config() {
    const overrides = JSON.parse(this.$el.attr('data-config') || '{}');
    return {
      ...Adapt.course.get('_graphicLottie'),
      ...overrides
    };
  }

  get container() {
    return this.$('.graphiclottie__animation-container')[0];
  }

  get isPaused() {
    return Boolean(this.animation?.isPaused);
  }

  get hasStarted() {
    return Boolean(this.animation?.currentFrame > 0);
  }

  get hasUserPaused() {
    return Boolean(this._hasUserPaused);
  }

  set hasUserPaused(val) {
    this._hasUserPaused = val;
  }

  get showControls() {
    if (!this.config._showPauseControl || this.isLoopsComplete) return false;
    return Boolean(this._showControls);
  }

  set showControls(val) {
    this._showControls = val;
  }

  get isFinished() {
    // if not looping, Lottie will stop one frame before the end and not complete the loop or update counts accordingly
    return Boolean(this.animation?.currentFrame >= this.animation?.totalFrames - 1);
  }

  get isLoopsComplete() {
    return Boolean(
      this.animation?._completedLoop ||
      (
        this.isFinished &&
        this.animation?.playCount === this.animation?.loop
      )
    );
  }

  calculateSrc(element) {
    const $el = $(element);
    const small = $el.attr('data-small');
    const large = $el.attr('data-large');
    const src = $el.attr('src');
    return src || (device.screenSize === 'small' ? small : large) || large;
  }

  get src() {
    return this.calculateSrc(this.el);
  }

  get alt() {
    return this.$el.attr('aria-label') || this.$el.attr('alt');
  }

  get shouldCreateAnimation () {
    return this.renderedSrc !== this.src;
  }

  get renderedSrc() {
    return this._renderedSrc;
  }

  set renderedSrc(src) {
    this._renderedSrc = src;
  }

  get animation() {
    return this._animation;
  }

  set animation(val) {
    this._animation = val;
  }

  setUpAttributeChangeObserver() {
    const observer = new MutationObserver(() => {
      this.syncAttributes();
      this.render();
    });
    observer.observe(this.replacedEl, { attributes: true });
  }

  syncAttributes() {
    const $div = this.$el;
    const img = this.replacedEl;
    $div
      .attr('data-graphiclottie', true)
      .addClass('graphiclottie')
      .attr({
        ...[...img.attributes].reduce((attrs, { name, value }) => {
          if (name === 'class') return attrs;
          return { ...{ [name]: value }, ...attrs };
        }, {}),
        id: img.id
      })
      .addClass($(img).attr('class'));
  }

  setUpListeners() {
    this.$el.on('onscreen', this.onScreenChange);
    this.listenTo(Adapt, 'device:resize', this.render);
    documentModifications.on('changed:html', this.checkVisua11y);
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
      this.goToEndAndStop();
      return;
    }
    // if not looping, an animation will need to be rewound/stopped before it can be replayed
    if (!this.config._playFirstViewOnly && this.isLoopsComplete) {
      this.rewind();
      return;
    }
    if (this.isPaused || this.hasUserPaused || !this.config._offScreenPause) return;
    this.showControls = false;
    this.pause();
    if (this.config._offScreenRewind) this.rewind();
  }

  onOnScreen() {
    if (!this.isPaused || this.isLoopsComplete) return;
    this.showControls = true;
    if (!this.config._autoPlay || this.hasUserPaused) return;
    this.play();
  }

  play() {
    this.animation.play();
    this.render();
  }

  pause() {
    this.animation.pause();
    this.render();
  }

  togglePlayPause() {
    this[this.isPaused ? 'play' : 'pause']();
  }

  rewind() {
    this.animation.stop();
    this.animation[this.isPaused ? 'goToAndStop' : 'goToAndPlay'](0, true);
    this.render();
  }

  goToEndAndStop() {
    const config = Adapt.course.get('_graphicLottie');
    const lastFrame = this.animation.totalFrames - 1;
    this.animation.loop = 0;
    this.animation.goToAndStop(lastFrame, true);
    config._showPauseControl = false;
    this.hasUserPaused = true;
    this.pause();
  }

  render() {
    const isAnimation = this._rex.test(this.src);
    const {
      isPaused,
      hasStarted,
      showControls
    } = this;
    const shouldCreateAnimation = this.shouldCreateAnimation;
    if (shouldCreateAnimation) this.destroyAnimation();
    const data = {
      ...this.config,
      isAnimation,
      isPaused,
      hasStarted,
      showControls,
      _src: this.src,
      alt: this.alt
    };
    ReactDOM.render(<templates.graphicLottie {...data} />, this.el);
    this.renderedSrc = data._src;
    if (!isAnimation || !shouldCreateAnimation) return;
    this.createAnimation();
  }

  createAnimation() {
    const loop = this.config._loops;
    this.animation = Lottie.loadAnimation({
      container: this.container,
      renderer: 'svg',
      loop: loop === -1 ? true : loop,
      autoplay: false, // we'll use checkIfOnScreen to control when playback starts
      path: this.src,
      rendererSettings: {
        preserveAspectRatio: 'xMinYMin slice' // svg element's preserveAspectRatio property
      }
    });
    this.animation.addEventListener('data_ready', this.onDataReady);
    this.animation.addEventListener('complete', this.render);
    this.animation.addEventListener('loopComplete', this.render);
    this.animation.addEventListener('enterFrame', this.render);
  }

  onDataReady() {
    this.animation.resize();
    this.showControls = false;
    this.pause();
    this.rewind();
    this.trigger('ready');
    this.onScreenChange(null, this.$el.onscreen());
  }

  onClick() {
    if (!this.config._showPauseControl || this.isLoopsComplete) return;
    this.togglePlayPause();
    this.hasUserPaused = this.isPaused;
    if (this.hasUserPaused && this.config._onPauseRewind) this.rewind();
  }

  checkVisua11y() {
    const htmlClasses = document.documentElement.classList;
    if (!htmlClasses.contains('a11y-no-animations')) return;

    // Stop on last frame
    this.goToEndAndStop();
  }

  destroyAnimation() {
    if (!this.animation) return;
    this.animation.removeEventListener('data_ready', this.onDataReady);
    this.animation.removeEventListener('complete', this.render);
    this.animation.removeEventListener('loopComplete', this.render);
    this.animation.removeEventListener('enterFrame', this.render);
    this.animation.stop();
    this.animation.destroy();
    this.animation = null;
  }

  remove() {
    this.destroyAnimation();
    super.remove();
  }

}
