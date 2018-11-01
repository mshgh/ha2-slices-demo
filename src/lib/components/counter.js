import { h } from '../../npm/hyperapp-v2'

export default (props) => {
  const { label, count, pending, add, add10, addLater } = props;

  return h('div', { class: 'border' }, [
    h('button', { onClick: [add, 5] }, 'Add 5'), ' ',
    h('button', { onClick: add10 }, 'Add 10'), ' ',
    h('button', { onClick: [addLater, {amount:3, after:2000}] }, 'Add 3 in 2 secs'), ' ',
    h('span', {}, `${label}: ${count}${pending ? ' [working...]' : ''}`),
  ])
}
