import { h } from '../../npm/hyperapp-v2'
import { connect } from '../../lib/hyperapp/slices'
import { Counter } from '../../lib/components'
import { countingToCounter } from '../mappings';

const FruitCounters = ({ apples, bananas }) =>
  h('div', {}, [
    Counter({ label: 'Apples', delay: 1500, ...apples }),
    Counter({ label: 'Bananas', delay: 2000, ...bananas }),
  ])

const mapToProps = slices => ({
  apples: countingToCounter(slices.pantry.food.fruits.apples),
  bananas: countingToCounter(slices.pantry.food.fruits.bananas),
});

export default connect(mapToProps, FruitCounters)
