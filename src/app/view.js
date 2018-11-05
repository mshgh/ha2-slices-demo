import '../assets/style.css'

import { h } from '../npm/hyperapp-v2'
import { views } from './app-setup'
import ShowState from '../lib/show-state'

export default state =>
  h('div', {}, [
    h('h2', {}, state.title),
    views.Pantry({ name: state.pantry.name }),
    ShowState(state),
  ])
