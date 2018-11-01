import { h } from '../../npm/hyperapp-v2'

export const C1 = (props) => {
  const { v2 } = props;

  return h('div', {}, `v2: ${v2}`);
}

export const C2 = (props, children) => {
  const { v1 } = props;

  return h('div', {}, [`v1: ${v1}`, children(props)]);
}
