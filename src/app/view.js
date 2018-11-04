import '../assets/style.css'

import { h } from '../npm/hyperapp-v2'
import { views } from './app-setup'
import ShowState from '../lib/show-state'

export default state =>
  h('div', {}, [
    h('h2', {}, state.title),
    views.Pantry(),
    h('hr'),
    views.pantry.controls.Temperature({ label: 'Temperature', units: '°C', step: 0.1 }),
    views.pantry.controls.Humidity({ label: 'Humidity', units: '%', step: 5 }),
    ShowState(state),
  ])
