import '../assets/style.css'

import { h, app } from '../npm/hyperapp-v2'
import { init, views } from './app-setup'
import ShowState from '../lib/show-state'

import { FruitCounters } from './components'

app({
  init,
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title),
      FruitCounters(),
      h('hr'),
      views.pantry.controls.Temperature({ label: 'Temperature', units: '°C', step: 0.1 }),
      views.pantry.controls.Humidity({ label: 'Humidity', units: '%', step: 5 }),
      ShowState(state),
    ]),
  container: document.getElementById('app'),
});
