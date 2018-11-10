import '../assets/style.css'

import { h, app } from '../lib/hyperapp/modules'
import { controlPanel, counting } from '../lib/modules'
import { pantry } from './views'
import { Pantry } from './components'
import ShowState from '../lib/show-state'

app({
  modules: [
    { title: 'Hyperapp v2 - modules' }, // a way how to add extra state poperties (not a module)
    ['pantry', pantry, { name2: 'optional props' }], // connected view with access to multiple slices
    ['pantry', [ // namespace
      { name: 'Food sweet food' }, // extra properties can be at any level
      ['food.fruits', [ // namespace shortcut
        ['apples', counting, { amount: 2, boxSize: 10 }], // business logic only module (actions and effects)
        ['bananas', counting, { amount: 5, boxSize: 5 }], // ...another instance of the same module
      ]],
      ['controls', [ // namespace
        ['temperature', controlPanel, { desired: 18 }], // self contained module (actions, effects, view)
        ['humidity', controlPanel, { desired: 85 }], // ...and again another instance of the module
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
