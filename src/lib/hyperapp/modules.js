import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {}, views = {};

const addInit = (slice, map, { init }, props, acc) => !init && !props ? acc.init
  : map(s => slice.state = { ...s, ...(init || {}), ...(props || {}) })(acc.init);

const bind = (slice, map, ops = {}) => Object.keys(ops).reduce((acc, key) => {
  const op = ops[key];
  acc[key] = (state, props, ev) => map(s => slice.state = op(s, props, ev))(state);
  return acc;
}, {});

const addApi = (slice, map, { actions, private: _actions, effects: getEffects }) => {
  if (actions) slice.api = bind(slice, map, actions);
  if (getEffects) {
    const effects = getEffects({ ...(slice.api || {}), ...bind(slice, map, _actions) });
    Object.keys(effects).forEach(key => {
      const effect = effects[key];
      slice.api[key] = !Array.isArray(effect) ? (state, props) => [state, effect(props)]
        : !Array.isArray(effect[0]) ? (state, props) => [effect[0](state, props), effect[1](props)]
        : typeof effect[0][1] !== 'function' ? (state, props) => [effect[0][0](state, effect[0][1]), effect[1](props)]
        : (state, props) => [effect[0][0](state, effect[0][1](props)), effect[1](props)];
    });
  }
  slices = map(_ => slice)(slices);
};

const addViews = (map, mapToProps, _views = {}) => Object.keys(_views).forEach(key => {
  const view = _views[key];
  const fn = Array.isArray(view) ? (props, children) => view[1]({ ...view[0](slices), ...props }, children)
    : (props, children) => view({ ...mapToProps(slices), ...props }, children);
  views = squirrel([key], map)(_ => fn)(views)
});

const addModules = (modules = [], basePath = [], seed = {}) => modules.reduce((acc, item) => {
  if (!Array.isArray(item)) return { ...acc, init: squirrel([...basePath].reverse())(state => ({ ...state, ...item }))(acc.init) };
  if (Array.isArray(item[1])) return addModules(item[1], [...basePath, ...item[0].split('.')], acc);

  const slice = {}, [name, module, props] = item;
  const path = [...basePath, ...name.split('.')];
  const map = squirrel([...path].reverse());
  acc.init = addInit(slice, map, module, props, acc);
  addApi(slice, map, module);
  addViews(map, module.mapToProps || (slices => ({ ...path.reduce((o, k) => o[k], slices) })), module.views);
  return acc;
}, seed);

const app = ({ modules, init, subscriptions: subs, ...props }) => {
  const res = {}, acc = addModules(modules);
  if (init || acc.init) res.init = { ...init, ...acc.init };
  return hyperapp({ ...props, ...res });
}

export { h, app, views }
