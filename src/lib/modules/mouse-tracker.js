import { h } from '../../lib/hyperapp/modules'
import Mouse from '../../lib/hyperapp/mouse'

export default {
  init: { x: 0, y: 0, enabled: false },
  actions: {
    toggle: state => ({ ...state, enabled: !state.enabled }),
    mouseMove: (state, { x, y }) => ({ ...state, x, y }),
  },
  views: {
    Panel: ({ state: { enabled, x, y, color }, api: { toggle } }) =>
      h('div', { style: { padding: '4px', background: color } }, [
        h('button', { onClick: toggle }, enabled ? 'Stop' : 'Start'),
        h('div', { style: { 'text-align': 'center' } }, `[${x}; ${y}]`),
      ])
  },
  subscriptions: ({ state: { enabled }, api: { mouseMove } }) => enabled && Mouse({ mouseMove }),
}
