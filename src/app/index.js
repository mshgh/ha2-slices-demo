import '../assets/style.css'

import { h, app } from '../npm/hyperapp-v2'
import ShowState from '../lib/show-state';

import { add, init } from '../lib/hyperapp/slices'
import { counting } from '../lib/slices'
import { FruitCounters } from './components'

add('x.y.z.applesCounting', counting);
add('x.a.b.bananasCounting', counting);

app({
  init: init({title: 'Hyperapp v2 - slices'}),
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      FruitCounters(),
      ShowState(state),
    ]),
    container: document.getElementById('app'),
});
