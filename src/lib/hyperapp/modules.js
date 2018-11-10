import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {};
let views = {};

const maps = path => ({
  map: squirrel(path),
  mapView: squirrel([path[0].replace(/^./, c => c.toUpperCase()), ...path.slice(1)]),
});

const addInit = (slice, map, { init }, props, state) => !init && !props ? state
  : map(s => slice.state = { ...s, ...(init || {}), ...(props || {}) })(state);

const bind = (slice, map, ops = {}) => Object.keys(ops).reduce((acc, key) => {
  const op = ops[key];
  acc[key] = (state, props, ev) => map(s => slice.state = op(s, props, ev))(state);
  return acc;
}, {});

const addApi = (slice, map, { actions, private: pActions, effects: getEffects }) => {
  slice.api = bind(slice, map, actions);
  if (getEffects) {
    const effects = getEffects({ ...slice.api, ...bind(slice, map, pActions) });
    Object.keys(effects).forEach(key => {
      const getEffect = effects[key];
      slice.api[key] = (state, props) => {
        const effect = getEffect(props);
        if (!Array.isArray(effect)) return [state, effect];
        const action = effect[0];
        return [Array.isArray(action) ? action[0](state, action[1]) : action(state), effect[1]];
      }
    });
  }
  slices = map(_ => slice)(slices);
};

const addModules = (modules, path = [], seed = {}) =>
  modules.reduce((init, moduleInfo) => {
    if (!Array.isArray(moduleInfo)) init = squirrel(path)(state => ({ ...state, ...moduleInfo }))(init);
    else if (Array.isArray(moduleInfo[1])) init = addModules(moduleInfo[1], [...path, ...moduleInfo[0].split('.')], init);
    else {
      const module = moduleInfo[1];
      const modulePath = [...path, ...moduleInfo[0].split('.')];
      const { map, mapView } = maps([...modulePath].reverse());

      const slice = {};
      init = addInit(slice, map, module, moduleInfo[2], init);
      addApi(slice, map, module);

      if (module.view) {
        const mapToProps = module.mapToProps || (slices => ({ ...modulePath.reduce((o, k) => o[k], slices) }));
        const view = (props, children) => module.view({ ...mapToProps(slices), ...props }, children);
        views = mapView(_ => view)(views);
      }
    }
    return init;
  }, { ...seed });

const app = ({ modules, ...props }) => {
  if (modules) props.init = addModules(modules);
  hyperapp(props);
};

export { h, app, views }
