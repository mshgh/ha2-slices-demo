import { app } from '../npm/hyperapp-v2'
import { init } from './app-setup'
import view from './view'

app({ init, view, container: document.getElementById('app') });
