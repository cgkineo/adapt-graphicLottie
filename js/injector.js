import Adapt from 'core/js/adapt';

/**
 * Allows the modification of filtered dom nodes on addition and removal
 */
export class DOMModifier {

  constructor({
    elementFilter = () => {},
    onElementAdd = () => {},
    onElementRemove = () => {}
  }) {
    elementFilter = elementFilter.bind(this);
    onElementAdd = onElementAdd.bind(this);
    onElementRemove = onElementRemove.bind(this);
    function filter(list, prop) {
      const nodes = list.reduce((nodes, item) => {
        const arr = _.toArray(item[prop]);
        return nodes.concat(arr);
      }, []);
      const elementNodes = nodes.filter(el => el.nodeType === 1);
      const foundNodes = elementNodes.reduce((nodes, el) => nodes.concat([el, ...$(el).find('*').toArray()].filter(elementFilter)), []);
      return foundNodes;
    }
    const observer = new MutationObserver((list, observer) => {
      const added = filter(list, 'addedNodes');
      const removed = filter(list, 'removedNodes');
      if (added.length) {
        added.forEach(onElementAdd);
      }
      if (removed.length) {
        removed.forEach(onElementRemove);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

}
