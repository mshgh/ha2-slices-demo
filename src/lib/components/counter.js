import { h } from '../../npm/hyperapp-v2'

export default ({ label, count, pending, add }) =>
  h('div', {class: 'border'}, [
    h('button', { onClick: [add, 5] }, 'Add 5'), ' ',
    h('span', {}, `${label}: ${count}${pending ? ' [counting...]' : ''}`),
  ])
