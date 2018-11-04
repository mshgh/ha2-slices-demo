import { h } from '../../npm/hyperapp-v2'

export default (props) => {
  const {
    label, delay, // coming from view
    state: { amount, boxSize, pending },
    api: { add, addLater }
  } = props;

  return h('div', { class: 'border' }, [
    `${label}: `,
    h('button', { onClick: [add, boxSize] }, `Add box (${boxSize} pieces)`),
    ' ',
    h('button', { onClick: [addLater, { amount: 3, after: delay }] }, `Add box in ${delay / 1000.} secs`), ' ',
    `available: ${amount}${pending ? ' [working...]' : ''}`,
  ])
}
