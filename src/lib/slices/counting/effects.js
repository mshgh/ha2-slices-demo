import { BatchFx, Time } from '../../../npm/hyperapp-v2-fx'
import toEffect from '../../hyperapp/to-effect'

export default actions => {

  const addLater = (state, { amount, after }) => [
    state,
    BatchFx(toEffect(actions.pending), Time({ action: [actions.add, amount], after }))
  ];

  return {
    add: actions.add,
    addLater
  };
}
