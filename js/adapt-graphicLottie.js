import Adapt from 'core/js/adapt';
import wait from 'core/js/wait';
import LottieView from './LottieView';
import documentModifications from 'core/js/DOMElementModifications';

class GraphicLottie extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.setUp);
    this.waitingFor = 0;
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

    // Do replaceWith using detach instead of remove to preserve
    // imageready event listeners
    const $parent = $img.parent();
    const previousSibling = $img[0].previousSibling;
    $img.detach();
    if (!previousSibling) $parent.prepend($div);
    else $div.insertAfter(previousSibling);

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
