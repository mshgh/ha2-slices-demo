import { BatchFx, Time } from '../../npm/hyperapp-v2-fx'
import toEffect from '../hyperapp/to-effect'

export default {
  init: { amount: 1, pending: false },
  privateActions: { // these actions won't be part of slice.api, but are available for effects
    pending: () => state => ({
      ...state,
      pending: true
    }),
  },
  actions: {
    add: amount => state => ({
      ...state,
      amount: state.amount + Math.floor(amount + 0.5),
      pending: false,
    }),
  },
  effects: actions => ({
    addLater: ({ amount, after }) => [actions.pending, Time({ action: [actions.add, amount], after })],
    addLaterPoorWay: ({ amount, after }) => BatchFx(toEffect(actions.pending), Time({ action: [actions.add, amount], after })),
    addLaterWithParams: ({ amount, after }) => [[actions.pending, true], Time({ action: [actions.add, amount], after })],
  })
}
