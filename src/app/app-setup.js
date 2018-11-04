import { modules } from '../lib/hyperapp/slices'
import { controlPanel } from '../lib/modules'
import { counting } from '../lib/slices'
import { pantry } from './modules'

const { init, views } = modules(
  { title: 'Hyperapp v2 - slices' }, // a way how to add extra state poperties (not a module)
  ['pantry', pantry], // connected view
  ['pantry', [
    { name: 'Food sweet food' }, // extra properties at any level
    ['food.fruits', [
      ['apples', counting, { amount: 2, boxSize: 10 }],
      ['bananas', counting, { amount: 5, boxSize: 5 }],
    ]],
    ['controls', [
      ['temperature', controlPanel, { desired: 18 }],
      ['humidity', controlPanel, { desired: 85 }],
    ]]
  ]]
);

export { init, views }
