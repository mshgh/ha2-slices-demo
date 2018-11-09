import { h } from '../../npm/hyperapp-v2'
import { Time } from '../../npm/hyperapp-v2-fx'

export default {
  actions: {
    add: (state, step) => ({ ...state, desired: Math.round((state.desired + step) * 100) / 100 }),
    sub: (state, step) => ({ ...state, desired: Math.round((state.desired - step) * 100) / 100 }),
  },
  effects: actions => ({
    addLater: step => Time({ action: [actions.add, step], after: 2000 }),
  }),
  view: ({ label, units, step, state: { desired }, api: { add, sub, addLater } }) =>
    h('div', { class: 'border' }, [
      h('button', { onClick: [add, step] }, 'Up'), ' ',
      h('button', { onClick: [addLater, step] }, 'Up (after 2s)'),
      h('span', {}, ` ${label}: Desired value ${desired} ${units} `),
      h('button', { onClick: [sub, step] }, 'Down'), ' ',
    ]),
}
