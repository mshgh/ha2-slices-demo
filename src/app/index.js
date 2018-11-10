import '../assets/style.css'

import { h, app } from '../lib/hyperapp/modules'
import ShowState from '../lib/show-state'
import * as module from './modules'
import { Pantry } from './components'

app({
  modules: [
    { title: 'Hyperapp v2 - modules' }, // a way how to add extra state poperties (not a module)
    ['pantry', module.pantry, { name2: 'optional props' }], // connected view with access to multiple slices
    ['pantry', [ // namespace
      { name: 'Food sweet food' }, // extra properties can be at any level
      ['food.fruits', [ // namespace shortcut
        ['apples', module.counting, { amount: 2, boxSize: 10 }], // business logic only module (actions and effects)
        ['bananas', module.counting, { amount: 5, boxSize: 5 }], // ...another instance of the same module
      ]],
      ['controls', [ // namespace
        ['temperature', module.controlPanel, { desired: 18 }], // self contained module (actions, effects, view)
        ['humidity', module.controlPanel, { desired: 85 }], // ...and again another instance of the module
      ]],
    ]]
  ],
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      Pantry({ name: state.pantry.name }),
      ShowState(state),
    ]),
  container: document.getElementById('app')
});
