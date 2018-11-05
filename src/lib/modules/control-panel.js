import { h } from '../../npm/hyperapp-v2'
import { Time } from '../../npm/hyperapp-v2-fx'

export default {
  actions: {
    add: step => state => ({ ...state, desired: Math.round((state.desired + step) * 100) / 100 }),
    sub: step => state => ({ ...state, desired: Math.round((state.desired - step) * 100) / 100 }),
  },
  api: actions => ({
    ...actions,
    addLater: step => state => [
      state,
      Time({ action: [actions.add, step], after: 2000 })
    ],
  }),
  view: ({ label, units, step, state: { desired }, api: { add, sub, addLater } }) =>
    h('div', { class: 'border' }, [
      h('button', { onClick: [add, step] }, 'Up'), ' ',
      h('button', { onClick: addLater(step) }, 'Up (after 2s)'), // TODO: paameters for effects?
      h('span', {}, ` ${label}: Desired value ${desired} ${units} `),
      h('button', { onClick: [sub, step] }, 'Down'), ' ',
    ]),
}
