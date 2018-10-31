import { h } from '../../npm/hyperapp-v2'
import { connect } from '../../lib/hyperapp/slices'
import { Counter } from '../../lib/components'
import { countingToCounter } from '../mappings';

const FruitCounters = ({ apples, bananas }) =>
  h('div', {}, [
    Counter({ label: 'Apples', ...apples }),
    Counter({ label: 'Bananas', ...bananas }),
  ])

const mapToProps = slices => ({
  apples: countingToCounter(slices.x.y.z.applesCounting),
  bananas: countingToCounter(slices.x.a.b.bananasCounting),
})

export default connect(mapToProps, FruitCounters);
