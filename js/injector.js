import Adapt from 'core/js/adapt';

/**
 * Allows the modification of filtered dom nodes on addition and removal
 */
export class DOMModifier {

  constructor({
    elementAddFilter = () => {},
    elementRemoveFilter = () => {},
    onElementAdd = () => {},
    onElementRemove = () => {}
  }) {
    elementAddFilter = elementAddFilter.bind(this);
    elementRemoveFilter = elementRemoveFilter.bind(this);
    onElementAdd = onElementAdd.bind(this);
    onElementRemove = onElementRemove.bind(this);
    function filter(list, prop, predicate) {
      const nodes = list.reduce((nodes, item) => {
        const arr = _.toArray(item[prop]);
        return nodes.concat(arr);
      }, []);
      const elementNodes = nodes.filter(el => el.nodeType === 1);
      const foundNodes = elementNodes.reduce((nodes, el) => nodes.concat([el, ...$(el).find('*').toArray()].filter(predicate)), []);
      return foundNodes;
    }
    const observer = new MutationObserver((list, observer) => {
      const added = filter(list, 'addedNodes', elementAddFilter);
      const removed = filter(list, 'removedNodes', elementRemoveFilter);
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
