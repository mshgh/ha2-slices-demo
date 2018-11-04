import { h } from '../../npm/hyperapp-v2'
import { Counter } from '../../lib/components'

export default {
  mapToProps: slices => ({
    apples: slices.pantry.food.fruits.apples,
    bananas: slices.pantry.food.fruits.bananas,
  }),
  view: ({ apples, bananas }) =>
    h('div', {}, [
      Counter({ label: 'Apples', delay: 1500, ...apples }),
      Counter({ label: 'Bananas', delay: 2000, ...bananas }),
    ]),
}
