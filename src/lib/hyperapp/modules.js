import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {}, views = {};

const addInit = (slice, map, { init }, props, state) => !init && !props ? state
  : map(s => slice.state = { ...s, ...(init || {}), ...(props || {}) })(state);

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

const addViews = (moduleMap, moduleMapToProps, moduleViews = {}) => {
  Object.keys(moduleViews).forEach(key => {
    const viewInfo = moduleViews[key];
    const mapToProps = Array.isArray(viewInfo) ? viewInfo[0] : moduleMapToProps;
    const view = Array.isArray(viewInfo) ? viewInfo[1] : viewInfo;
    views = squirrel([key], moduleMap)(_ => (props, children) => view({ ...mapToProps(slices), ...props }, children))(views);
  });
}

const addModules = (modules, path = [], seed = {}) =>
  modules.reduce((init, moduleInfo) => {
    if (!Array.isArray(moduleInfo)) init = squirrel(path)(state => ({ ...state, ...moduleInfo }))(init);
    else if (Array.isArray(moduleInfo[1])) init = addModules(moduleInfo[1], [...path, ...moduleInfo[0].split('.')], init);
    else {
      const module = moduleInfo[1];
      const modulePath = [...path, ...moduleInfo[0].split('.')];
      const map = squirrel([...modulePath].reverse());

      const slice = {};
      init = addInit(slice, map, module, moduleInfo[2], init);
      addApi(slice, map, module);
      addViews(map, module.mapToProps || (slices => ({ ...modulePath.reduce((o, k) => o[k], slices) })), module.views);
    }
    return init;
  }, { ...seed });

const app = ({ modules, ...props }) => {
  if (modules) props.init = addModules(modules);
  hyperapp(props);
};

export { h, app, views }
