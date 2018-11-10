import { h, views } from '../../lib/hyperapp/modules'
import { Counter } from '../../lib/components'

export default {
  mapToProps: slices => ({ // default mapToProps in case View doesn't provide it's own mapping
    food: slices.pantry.food,
    controls: slices.pantry.controls,
  }),
  views: {
    Fruits: [
      slices => ({ apples: slices.pantry.food.fruits.apples, bananas: slices.pantry.food.fruits.bananas }),
      ({ apples, bananas }) =>
        h('div', { class: 'border' }, [
          h('h3', {}, 'Fruits'),
          Counter({ label: 'Apples', delay: 1500, ...apples }),
          Counter({ label: 'Bananas', delay: 2000, ...bananas }),
        ]),
    ],
    ControlPanels: [
      _ => { }, // explicitly remove access to slices
      _ =>
        h('div', { class: 'border' }, [
          h('h3', {}, 'Control panels'),
          views.pantry.controls.temperature.ControlPanel({ label: 'Temperature', units: '°C', step: 0.1 }),
          views.pantry.controls.humidity.ControlPanel({ label: 'Humidity', units: '%', step: 5 }),
        ]),
    ],
  }
}
