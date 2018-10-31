import { h } from '../npm/hyperapp-v2'

export default state =>
  h('div', {class: 'border'}, [
    h('h3', {}, 'State'),
    h('pre', {}, JSON.stringify(state, null, 2))
  ])
