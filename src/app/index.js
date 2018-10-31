import '../style.css'

import { h, app } from '../npm/hyperapp-v2'

app({
  init: {title: 'Hyperapp v2 - slices'},
  view: state =>
    h('div', {}, [
      h('h2', {}, state.title)
    ]),
    container: document.getElementById('app'),
});
