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
  if (actions) slice.api = reduceActions(actions, bind(slice, map));
  if (getEffects) {
    const effects = getEffects({ ...(slice.api || {}), ...reduceActions(_actions, bind(slice, map)) });
    Object.keys(effects).forEach(key => {
      const effect = effects[key];
      slice.api[key] = !isA(effect) ? (state, props) => [state, effect(props)]
        : !isA(effect[0]) ? (state, props) => [effect[0](state, props), effect[1](props)]
        : !isF(effect[0][1]) ? (state, props) => [effect[0][0](state, effect[0][1]), effect[1](props)]
        : (state, props) => [effect[0][0](state, effect[0][1](props)), effect[1](props)];
    });
  }
  if (slice.api) slices = map(_ => slice)(slices); // TODO: mergse slices?

  function reduceActions(actions = {}, fn, seed = {}) {
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

function addModules(modules = [], basePath = [], seed = {}) {
  return modules.reduce((acc, item) => {
    if (!isA(item)) return { ...acc, init: squirrel(rA(basePath))(state => ({ ...state, ...item }))(acc.init) };
    if (isA(item[1])) return addModules(item[1], [...basePath, ...item[0].split('.')], acc);

    const slice = {}, [name, module, props] = item;
    const path = [...basePath, ...name.split('.')];
    const map = squirrel(rA(path));
    const mapToProps = module.mapToProps || (slices => ({ ...path.reduce((o, k) => o[k], slices) }));

    if (module.init || props) acc.init = map(addInit(slice, module.init, props))(acc.init);
    addApi(slice, map, module);
    if (module.views) Object.keys(module.views).forEach(key => {
      const view = module.views[key];
      const fn = isA(view) ? (props, children) => view[1]({ ...view[0](slices), ...props }, children)
        : (props, children) => view({ ...mapToProps(slices), ...props }, children);
      views = squirrel([key], map)(_ => fn)(views) // TODO: mergse views?
    });
    if (module.subscriptions) acc.subs = toA(module.subscriptions).reduce(reduceSubs, acc.subs);
    return acc;

    function reduceSubs(acc = [], item) {
      acc.push(isF(item) ? [mapToProps, item] : item);
      return acc;
    }
  }, seed);
}

function app({ modules, init, subscriptions: subs, ...props }) {
  const res = {}, acc = addModules(modules);
  if (init || acc.init) res.init = { ...init, ...acc.init };
  if (subs || acc.subs) {
    const modulesSubs = acc.subs || [];

    res.subscriptions = function subscriptions(state) {
      return modulesSubs.reduce(function reduceSubs(acc, sub) {
        return acc.concat(sub[1](sub[0](slices)));
      }, subs ? subs(state) : []);
    }
  }
  return hyperapp({ ...props, ...res });
}

export { h, app, views }
