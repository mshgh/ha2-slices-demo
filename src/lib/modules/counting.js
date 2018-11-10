import { BatchFx, Time } from '../../npm/hyperapp-v2-fx'
import toEffect from '../hyperapp/to-effect'

export default {
  init: { amount: 1, pending: false },
  actions: {
    add: (state, amount) => ({
      ...state,
      amount: state.amount + Math.floor(amount + 0.5),
      pending: false,
    }),
  },
  private: { // these actions won't be part of slice.api, but are available for effects
    pending: state => ({
      ...state,
      pending: true
    }),
  },
  effects: actions => ({
    addLater: [actions.pending, ({ amount, after }) => Time({ action: [actions.add, amount], after })],
    addLaterWithProps: [[actions.add, ({ amount }) => amount], ({ amount, after }) => Time({ action: [actions.add, amount], after })],
    addLaterWithConstant: [[actions.pending, true], ({ amount, after }) => Time({ action: [actions.add, amount], after })],
    addLaterWithConstantAlternative: [[actions.pending, _ => true], ({ amount, after }) => Time({ action: [actions.add, amount], after })],
    addLaterUpdateStateBeffoerEffectPoorWay: ({ amount, after }) => BatchFx(toEffect(actions.pending), Time({ action: [actions.add, amount], after })),
    addLaterPossibleButOverkill: [(state, { amount }) => actions.add(state, amount), ({ amount, after }) => Time({ action: [actions.add, amount], after })],
  })
}
