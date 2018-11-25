// TODO: replace forEach with map?
import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {}, views = {};

const isF = f => typeof f === 'function';
const isA = a => Array.isArray(a);
const toA = i => isA(i) ? i : [i];
const rA = a => [...a].reverse();

function addInit(slice, init, props) {
  return state => slice.state = { ...state, ...(init || {}), ...(props || {}) };
}

function addApi(slice, map, { actions, private: _actions, effects: getEffects }) {
  if (actions) slice.api = bindActions(actions, bind(slice, map));
  if (getEffects) {
    const effects = getEffects({ ...(slice.api || {}), ...bindActions(_actions, bind(slice, map)) });
    Object.keys(effects).forEach(key => {
      const effect = effects[key];
      slice.api[key] = !isA(effect) ? (state, props) => [state, effect(props)]
        : !isA(effect[0]) ? (state, props) => [effect[0](state, props), effect[1](props)]
        : !isF(effect[0][1]) ? (state, props) => [effect[0][0](state, effect[0][1]), effect[1](props)]
        : (state, props) => [effect[0][0](state, effect[0][1](props)), effect[1](props)];
    });
  }
  if (slice.api) slices = map(_ => slice)(slices); // TODO: mergse slices?

  function bindActions(actions = {}, fn, seed = {}) {
    return Object.keys(actions).reduce((action, key) => fn(action, key, actions), seed);
  }

  function bind(slice, map) {
    return function bindbindCallback(acc, key, ops) {
      const op = ops[key]
      acc[key] = (state, props, ev) => map(s => slice.state = op(s, props, ev))(state);
      return acc;
    }
  }
};

function addViews(map, mapToProps, _views = {}) {
  Object.keys(_views).forEach(key => {
    const view = _views[key];
    const fn = isA(view) ? (props, children) => view[1]({ ...view[0](slices), ...props }, children)
      : (props, children) => view({ ...mapToProps(slices), ...props }, children);
    views = squirrel([key], map)(_ => fn)(views) // TODO: mergse views?
  });
}

function addModules(modules = [], basePath = [], seed = {}) {
  return modules.reduce((acc, item) => {
    if (!isA(item)) return { ...acc, init: squirrel(rA(basePath))(state => ({ ...state, ...item }))(acc.init) };
    if (isA(item[1])) return addModules(item[1], [...basePath, ...item[0].split('.')], acc);

    const slice = {}, [name, module, props] = item;
    const path = [...basePath, ...name.split('.')];
    const map = squirrel(rA(path));
    if (module.init || props) acc.init = map(addInit(slice, module.init, props))(acc.init);
    addApi(slice, map, module);
    const mapToProps = module.mapToProps || (slices => ({ ...path.reduce((o, k) => o[k], slices) }));
    if (module.views) addViews(map, mapToProps, module.views);
    if (module.subscriptions) acc.subs = toA(module.subscriptions).reduce(reduceSubs(mapToProps), acc.subs);
    return acc;
  }, seed);

  function reduceSubs(mapToProps) {
    return function addSub(acc = [], item) {
      acc.push(isF(item) ? [mapToProps, item] : item);
      return acc;
    }
  }
}

function app({ modules, init, subscriptions, ...props }) {
  const res = {}, acc = addModules(modules);
  if (init || acc.init) res.init = { ...init, ...acc.init };
  if (subscriptions || acc.subs) res.subscriptions = combineSubs(subscriptions, acc.subs);
  return hyperapp({ ...props, ...res });

  function combineSubs(subs, modulesSubs = []) {
    return function subscriptions(state) {
      return modulesSubs.reduce(reduceSubs, subs ? subs(state) : []);
    }

    function reduceSubs(acc, sub) {
      return acc.concat(sub[1](sub[0](slices)));
    }
  }
}

export { h, app, views }
