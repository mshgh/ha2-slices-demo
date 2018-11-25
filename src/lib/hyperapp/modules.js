// TODO: lambdas `const XYZ = () =>` to functions `funcion XYZ()`

import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {}, views = {};

const isF = f => typeof f === 'function';
const isA = a => Array.isArray(a);
const toA = i => isA(i) ? i : [i];
const rA = a => [...a].reverse();

const addInit = (slice, map, { init }, props, acc) => !init && !props ? acc.init // TODO: move this check to caller method
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
      slice.api[key] = !isA(effect) ? (state, props) => [state, effect(props)]
        : !isA(effect[0]) ? (state, props) => [effect[0](state, props), effect[1](props)]
        : !isF(effect[0][1]) ? (state, props) => [effect[0][0](state, effect[0][1]), effect[1](props)]
        : (state, props) => [effect[0][0](state, effect[0][1](props)), effect[1](props)];
    });
  }
  slices = map(_ => slice)(slices); // TODO: mergse slices?
};

const addViews = (map, mapToProps, _views = {}) => Object.keys(_views).forEach(key => {
  const view = _views[key];
  const fn = isA(view) ? (props, children) => view[1]({ ...view[0](slices), ...props }, children)
    : (props, children) => view({ ...mapToProps(slices), ...props }, children);
  views = squirrel([key], map)(_ => fn)(views) // TODO: mergse views?
});

const addSubs = (mapToProps, subs, seed = []) => subs.reduce((acc, item) => {
  acc.push(isF(item) ? [mapToProps, item] : item);
  return acc;
}, seed);

const addModules = (modules = [], basePath = [], seed = {}) => modules.reduce((acc, item) => {
  if (!isA(item)) return { ...acc, init: squirrel(rA(basePath))(state => ({ ...state, ...item }))(acc.init) };
  if (isA(item[1])) return addModules(item[1], [...basePath, ...item[0].split('.')], acc);

  const slice = {}, [name, module, props] = item;
  const path = [...basePath, ...name.split('.')];
  const map = squirrel(rA(path));
  acc.init = addInit(slice, map, module, props, acc);
  addApi(slice, map, module);
  const mapToProps = module.mapToProps || (slices => ({ ...path.reduce((o, k) => o[k], slices) }));
  if (module.views) addViews(map, mapToProps, module.views);
  if (module.subscriptions) acc.subs = addSubs(mapToProps, toA(module.subscriptions), acc.subs);
  return acc;
}, seed);

const combineSubs = (subs = [], acc) => subs.reduce((acc, sub) => acc.concat(sub[1](sub[0](slices))), acc);

const app = ({ modules, init, subscriptions: subs, ...props }) => {
  const res = {}, acc = addModules(modules);
  if (init || acc.init) res.init = { ...init, ...acc.init };
  if (subs || acc.subs) res.subscriptions = state => combineSubs(acc.subs, subs ? subs(state) : []);
  return hyperapp({ ...props, ...res });
}

export { h, app, views }
