import { h, app as hyperapp } from '../../npm/hyperapp-v2'
import squirrel from '../../npm/squirrel'

let slices = {};
let views = {};

const maps = path => ({
  map: squirrel(path),
  mapView: squirrel([path[0].replace(/^./, c => c.toUpperCase()), ...path.slice(1)]),
});

const bindActions = (slice, map, actions = {}) => Object.keys(actions).reduce((acc, key) => {
  const action = actions[key];
  acc[key] = (state, props, ev) => map(s => slice.state = action(s, props, ev))(state);
  return acc;
}, {});

const addModules = (modules, path = [], seed = {}) =>
  modules.reduce((init, moduleInfo) => {
    if (!Array.isArray(moduleInfo)) init = squirrel(path)(state => ({ ...state, ...moduleInfo }))(init);
    else if (Array.isArray(moduleInfo[1])) init = addModules(moduleInfo[1], [...path, ...moduleInfo[0].split('.')], init);
    else {
      const [subPath, module, props] = moduleInfo;
      const modulePath = [...path, ...subPath.split('.')];
      const { map, mapView } = maps([...modulePath].reverse());

      const slice = {};
      if (module.init || props) init = map(state => slice.state = { ...state, ...(module.init || {}), ...(props || {}) })(init);

      if (module.actions) {
        slice.api = bindActions(slice, map, module.actions);
        const privateActions = bindActions(slice, map, module.privateActions);

        if (module.effects) {
          const effects = module.effects({ ...slice.api, ...privateActions });
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
      }

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
