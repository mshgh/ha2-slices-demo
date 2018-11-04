import { BatchFx, Time } from '../../npm/hyperapp-v2-fx'
import toEffect from '../hyperapp/to-effect'

export default {
  actions: {
    _init: init => ({ amount: 1, pending: false, ...init }),
    add: amount => state => ({
      ...state,
      amount: state.amount + Math.floor(amount + 0.5),
      pending: false,
    }),
    pending: () => state => ({
      ...state,
      pending: true
    })
  },
  api: actions => ({
    add: actions.add,
    addLater: (state, { amount, after }) => [
      state,
      BatchFx(toEffect(actions.pending), Time({ action: [actions.add, amount], after }))
    ]
  })
}
