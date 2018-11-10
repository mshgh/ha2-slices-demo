import { h, views } from '../../lib/hyperapp/modules'

export default ({ name }) =>
  h('div', { class: 'border' }, [
    h('h3', {}, `Pantry "${name}"`),
    views.pantry.Fruits(),
    views.pantry.ControlPanels(),
  ]);
