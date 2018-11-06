import { BatchFx, Time } from '../../npm/hyperapp-v2-fx'
import toEffect from '../hyperapp/to-effect'

export default {
  init: { amount: 1, pending: false },
  actions: {
    add: amount => state => ({
      ...state,
      amount: state.amount + Math.floor(amount + 0.5),
      pending: false,
    }),
    _pending: () => state => ({ // underscore means "private" => this action won't be part of slice.api, but is available for effects
      ...state,
      pending: true
    })
  },
  effects: actions => ({
    addLater: ({ amount, after }) => BatchFx(toEffect(actions._pending), Time({ action: [actions.add, amount], after }))
  })
}
