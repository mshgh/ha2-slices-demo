import { h } from '../../npm/hyperapp-v2'
import { views } from '../app-setup'
import { Counter } from '../../lib/components'

export default {
  mapToProps: slices => ({
    apples: slices.pantry.food.fruits.apples,
    bananas: slices.pantry.food.fruits.bananas,
  }),
  view: ({ name, apples, bananas }) =>
    h('div', { class: 'border' }, [
      h('h2', {}, `Pantry - ${name}`),
      h('div', { class: 'border' }, [
        h('h3', {}, 'Fruits'),
        Counter({ label: 'Apples', delay: 1500, ...apples }),
        Counter({ label: 'Bananas', delay: 2000, ...bananas }),
      ]),
      h('h3', {}, 'Control panels'),
      h('div', { class: 'border' }, [
        views.pantry.controls.Temperature({ label: 'Temperature', units: '°C', step: 0.1 }),
        views.pantry.controls.Humidity({ label: 'Humidity', units: '%', step: 5 }),
      ]),
    ]),
}
