import { h } from '../../npm/hyperapp-v2'
import { connect } from '../../lib/hyperapp/slices'
import { Counter } from '../../lib/components'
import { countingToCounter } from '../mappings';
import { C1 } from './cx'

const FruitCounters = (props, children) => {
  const { apples, bananas } = props;

  return h('div', {}, [
    children(props, C1),
    Counter({ label: 'Apples', ...apples }),
    Counter({ label: 'Bananas', ...bananas }),
  ])
};

const mapToProps = slices => ({
  apples: countingToCounter(slices.x.y.z.applesCounting),
  bananas: countingToCounter(slices.x.a.b.bananasCounting),
});

export default connect(mapToProps, FruitCounters)
