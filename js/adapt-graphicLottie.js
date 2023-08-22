import Adapt from 'core/js/adapt';
import wait from 'core/js/wait';
import LottieView from './LottieView';
import documentModifications from 'core/js/DOMElementModifications';

class GraphicLottie extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
    this.waitingFor = 0;
  }

  onDataReady() {
    const config = Adapt.course.get('_graphicLottie');
    if (!config?._isEnabled) return;
    this.setUpEventListeners();
    this.setUp();
  }

  setUpEventListeners() {
    document.body.addEventListener('transitionend', this.checkOnScreen.bind(this));
    this.listenTo(Adapt, 'notify:opened', this.checkOnScreen);
  }

  checkOnScreen() {
    $.inview();
  }

  setUp() {
    const config = Adapt.course.get('_graphicLottie');
    const fileExtension = config._fileExtension || 'svgz';
    this.listenTo(documentModifications, {
      [`changed:img[src*='.${fileExtension}'],img[data-large*='.${fileExtension}'],img[data-small*='.${fileExtension}']`]: this.onImgAdded,
      'remove:[data-graphiclottie]': this.onPlayerRemoved
    });
  }

  onImgAdded(event) {
    if (this.waitingFor === 0) wait.begin();
    this.waitingFor++;
    const img = event.target;
    const $img = $(img);
    const div = document.createElement('div');
    const $div = $(div);
    $img.replaceWith($div);
    const lottieView = div.lottieView = new LottieView({
      el: div,
      replacedEl: img
    });
    lottieView.on('ready', () => {
      this.waitingFor--;
      if (this.waitingFor !== 0) return;
      wait.end();
    });
  }

  onPlayerRemoved(event) {
    if (this.waitingFor !== 0) return;
    const div = event.target;
    const lottieView = div.lottieView;
    lottieView?.remove();
    div.lottieView = null;
  }

}

export default new GraphicLottie();
