import Adapt from 'core/js/adapt';
import { DOMModifier } from './injector';
import LottieView from './LottieView';

class GraphicLottie extends Backbone.Controller {

  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
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
    const rex = new RegExp(`\\.${fileExtension}`, 'i');
    let waitFor = 0;
    new DOMModifier({
      elementAddFilter(element) {
        if (element.nodeName !== 'IMG') return;
        const img = element;
        return rex.test(img.src) || rex.test(img.getAttribute('data-large')) || rex.test(img.getAttribute('data-small'));
      },
      onElementAdd(img) {
        const div = document.createElement('div');
        $(img).replaceWith(div);
        div.setAttribute('data-graphiclottie', true);
        $(div).attr({
          ...[...img.attributes].reduce((attrs, { name, value }) => ({ ...{ [name]: value }, ...attrs }), {}),
          'class': img.className,
          'id': img.id
        });
        if (waitFor === 0) {
          Adapt.wait.begin();
        }
        waitFor++;
        div.lottieView = new LottieView({ el: div });
        div.lottieView.on('ready', () => {
          waitFor--;
          if (waitFor === 0) {
            Adapt.wait.end();
          }
        })
      },
      elementRemoveFilter(element) {
        return element.getAttribute('data-graphiclottie');
      },
      onElementRemove(div) {
        if (waitFor !== 0) return;
        div.lottieView?.remove();
        div.lottieView = null;
      }
    });
  }

}

export default new GraphicLottie();
