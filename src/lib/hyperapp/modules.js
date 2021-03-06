// TODO: replace forEach with map?
import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {}, views = {};

const isF = f => typeof f === 'function';
const isA = a => Array.isArray(a);
const toA = i => isA(i) ? i : [i];
const rA = a => [...a].reverse();

function app({ modules = [], init, subscriptions: subs, ...props }) {
  const res = {}, acc = modules.reduce(reduceModules, {});
  if (init || acc.init) res.init = { ...init, ...acc.init };

  const accSubs = acc.subs ? acc.subs : [];
  if (subs || acc.subs) res.subscriptions = function subscriptions(state) {
    return accSubs.reduce(
      function reduceSubs(acc, sub) { return acc.concat(sub[1](sub[0](slices))); },
      subs ? subs(state) : []);
  }
  return hyperapp({ ...props, ...res });

  function reduceModules({ basePath = [], init, subs }, item) {
    if (!isA(item)) return { basePath, init: squirrel(rA(basePath))(state => ({ ...state, ...item }))(init), subs };

    const [name, module, props] = item;
    const path = [...basePath, ...name.split('.')];
    if (isA(module)) return { ...module.reduce(reduceModules, { basePath: path, init, subs }), basePath };

    const mapToProps = isF(module.mapToProps) ? module.mapToProps : slices => ({ ...path.reduce((o, k) => o[k], slices) });
    const map = squirrel(rA(path)), slice = {};
    if (module.init || props) init = map(
      function updateInit(state) { return slice.state = { ...state, ...module.init, ...props }; }
    )(init);

    const { actions, private: _actions, effects: getEffects } = module;
    if (actions) slice.api = bind(actions);
    if (getEffects) {
      const effects = getEffects({ ...slice.api, ...bind(_actions) });
      Object.keys(effects).forEach(key => {
        const effect = effects[key];
        if (!isA(effect)) slice.api[key] = (state, props) => [state, effect(props)];
        else if (!isA(effect[0])) slice.api[key] = (state, props) => [effect[0](state, props), effect[1](props)];
        else if (!isF(effect[0][1])) slice.api[key] = (state, props) => [effect[0][0](state, effect[0][1]), effect[1](props)];
        else slice.api[key] = (state, props) => [effect[0][0](state, effect[0][1](props)), effect[1](props)];
      });
    }
    if (slice.api) slices = map(_ => slice)(slices); // TODO: mergse slices?

    if (module.views) Object.keys(module.views).forEach(key => {
      const view = module.views[key];
      const fn = isA(view) ? (props, children) => view[1]({ ...view[0](slices), ...props }, children)
        : (props, children) => view({ ...mapToProps(slices), ...props }, children);
      views = squirrel([key], map)(_ => fn)(views) // TODO: mergse views?
    });

    if (module.subscriptions) subs = toA(module.subscriptions).reduce(
      function reduceSubs(acc = [], item) {
        acc.push(isF(item) ? [mapToProps, item] : item);
        return acc;
      }, subs);

    return { basePath, init, subs };

    function bind(ops = {}) {
      return Object.keys(ops).reduce(
        function bindOps(acc, key) {
          const op = ops[key]
          acc[key] = (state, props, ev) => map(s => slice.state = op(s, props, ev))(state);
          return acc;
        }, {});
    }
  }
}

export { h, app, views }
