import '../assets/style.css'

import { h, app } from '../npm/hyperapp-v2'
import { init, views } from './app-setup'
import ShowState from '../lib/show-state'

import { FruitCounters, C2 } from './components'

app({
  init,
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      views.pantry.controls.Temperature({ label: 'Temperature', units: '°C', step: 0.1 }),
      views.pantry.controls.Humidity({ label: 'Humidity', units: '%', step: 5 }),
      h('hr'),
      FruitCounters({ v1: '_v1', v2: '_v2' }, C2),
      ShowState(state),
    ]),
  container: document.getElementById('app'),
});
