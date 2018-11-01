import '../assets/style.css'

import { h, app } from '../npm/hyperapp-v2'
import ShowState from '../lib/show-state';

import { add, init } from '../lib/hyperapp/slices'
import { counting } from '../lib/slices'
import { FruitCounters, C2 } from './components'

add('x.y.z.applesCounting', counting, { count: 2 });
add('x.a.b.bananasCounting', counting, { count: 3 });

app({
  init: init({ title: 'Hyperapp v2 - slices' }),
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      FruitCounters({ v1: '_v1', v2: '_v2' }, C2),
      ShowState(state),
    ]),
  container: document.getElementById('app'),
});
