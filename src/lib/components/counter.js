import { h } from '../../npm/hyperapp-v2'

export default ({
  label, delay,
  state: { amount, boxSize, pending },
  api: { add, addLater }
}) =>
  h('div', { class: 'border' }, [
    `${label}: `,
    h('button', { onClick: [add, boxSize] }, `Add box (${boxSize} pieces)`),
    ' ',
    h('button', { onClick: [addLater, { amount: boxSize, after: delay }] }, `Add box in ${delay / 1000.} secs`), ' ',
    `available: ${amount}${pending ? ' [working...]' : ''}`,
  ])
