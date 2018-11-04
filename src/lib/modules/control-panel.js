import { h } from '../../npm/hyperapp-v2'

export default {
  actions: {
    add: step => state => ({ ...state, desired: Math.round((state.desired + step) * 100) / 100 }),
    sub: step => state => ({ ...state, desired: Math.round((state.desired - step) * 100) / 100 }),
  },
  api: actions => ({
    ...actions,
    addLater: state => [
      state,
      Time({ action: [actions.add, 5], after: 2000 })
    ],
  }),
  view: ({ label, units, step, state: { desired }, api: { add, sub, addLater } }) =>
    h('div', { class: 'border' }, [
      h('button', { onClick: [add, step] }, 'Up'),
      h('span', {}, ` ${label}: Desired value ${desired} ${units} `),
      h('button', { onClick: [sub, step] }, 'Down'), ' ',
      //h('button', { onClick: addLater }, 'Inc later')
    ]),
}
