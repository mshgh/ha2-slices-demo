import '../assets/style.css'

import { h, app } from '../lib/hyperapp/modules'
import Mouse from '../lib/hyperapp/mouse'
import ShowState from '../lib/show-state'
import * as module from './modules'
import * as components from './components'

const mouseMove = (state, { x, y }) => ({ ...state, m: { ...state.m, x, y } });
const click = (state) => ({ ...state, m: { ...state.m, e: !state.m.e } });

app({
  init: { m: { x: 0, y: 0, e: true } },
  modules: [
    { title: 'Hyperapp v2 - modules' }, // a way how to add extra state poperties (not a module)
    ['pantry', module.pantry, { name2: 'optional props' }], // connected view with access to multiple slices
    ['pantry', [ // namespace
      { name: 'Food sweet food' }, // extra properties can be at any level
      ['food.fruits', [ // namespace shortcut
        ['apples', module.counting, { amount: 2, boxSize: 10 }], // business logic only module (actions and effects)
        ['bananas', module.counting, { amount: 5, boxSize: 5 }], // ...another instance of the same module
        { baz: 'bar' },
      ]],
      ['controls', [ // namespace
        ['temperature', module.controlPanel, { desired: 18 }], // self contained module (actions, effects, view)
        ['humidity', module.controlPanel, { desired: 85 }], // ...and again another instance of the module
      ]],
    ]],
    ['mouse.trackers', [
      ['red', module.mouseTracker, { color: '#FAA' }],
      ['green', module.mouseTracker, { color: '#AFA' }],
      ['blue', module.mouseTracker, { color: '#AAF' }],
    ]]
  ],
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      components.Pantry({ name: state.pantry.name }),
      components.MouseTrackers(),
      ShowState(state),
    ]),
  container: document.getElementById('app'),
  subscriptions: state => [
    Mouse({ click }),
    state.m.e && Mouse({ mouseMove }),
  ]
});
