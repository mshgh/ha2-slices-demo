import '../assets/style.css'

import { h, app } from '../npm/hyperapp-v2'
import ShowState from '../lib/show-state';

import { add, init, connect } from '../lib/hyperapp/slices'
import { counting } from '../lib/slices'
import { FruitCounters, C2 } from './components'

add('x.y.z.applesCounting', counting, { count: 2 });
add('x.a.b.bananasCounting', counting, { count: 3 });

// ----- How to bundle slice with view into 'module' -----
import { Time } from '../npm/hyperapp-v2-fx'

const counterModule = {
  actions: {
    inc: () => state => state + 1,
    sub: amount => state => state - amount,
  },
  api: actions => ({
    ...actions,
    incLater: state => [
      state,
      Time({ action: actions.inc, after: 2000 })
    ],
  }),
  view: ({ label, state, api }) => {
    return h('div', {class: 'border'}, [
      h('button', { onClick: api.inc }, 'Inc'), ' ',
      h('button', { onClick: api.incLater }, 'Inc later'), ' ',
      h('button', { onClick: [api.sub, 5] }, 'Sub 5'), ' ',
      h('span', {}, `${label}: ${state}`),
    ]);
  }
}

const module = (path, module, init) => {
  add(path, module, init);
  // with this trivial approach 'path' cannot contain dots '.'
  return connect(slices => ({ ...slices[path] }), module.view);
}

const Temperature = module("temperature", counterModule, 27);
const Humidity = module("huminidity", counterModule, 85);
// ----- How to bundle slice with view into 'module' -----

app({
  init: init({ title: 'Hyperapp v2 - slices' }),
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      Temperature({ label: 'Temperature' }),
      Humidity({ label: 'Humidity' }),
      h('hr'),
      FruitCounters({ v1: '_v1', v2: '_v2' }, C2),
      ShowState(state),
    ]),
  container: document.getElementById('app'),
});
