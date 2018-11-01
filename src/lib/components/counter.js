import { h } from '../../npm/hyperapp-v2'

export default ({ label, count, pending, add, add10 }) =>
  h('div', {class: 'border'}, [
    h('button', { onClick: [add, 5] }, 'Add 5'), ' ',
    h('button', { onClick: add10 }, 'Add 10'), ' ',
    h('span', {}, `${label}: ${count}${pending ? ' [counting...]' : ''}`),
  ])
