import squirrel from '../../npm/squirrel'

let slices = {};

const maps = path => ({
  map: squirrel(path),
  mapView: squirrel([path[0].replace(/^./, c => c.toUpperCase()), ...path.slice(1)]),
});

const addModules = (modules, path, seed) => modules.reduce((acc, moduleInfo) => {
  if (!Array.isArray(moduleInfo)) acc.init = squirrel(path)(state => ({ ...state, ...moduleInfo }))(acc.init);
  else if (Array.isArray(moduleInfo[1])) acc = addModules(moduleInfo[1], [...path, ...moduleInfo[0].split('.')], acc);
  else {
    const [subPath, module, init] = moduleInfo;
    const modulePath = [...path, ...subPath.split('.')];
    const { map, mapView } = maps([...modulePath].reverse());

    const slice = {};
    if (module.init || init) acc.init = map(state => slice.state = { ...state, ...(module.init || {}), ...(init || {}) })(acc.init);

    if (module.actions) {
      slice.api = {};
      const actions = Object.keys(module.actions).reduce((acc, key) => {
        const action = module.actions[key];
        acc[key] = (_, props, ev) => map(state => slice.state = action(props, ev)(state)); // ditch the state ;)
        if (key.charAt() !== '_') slice.api[key] = acc[key]; // don't publish "private" actions
        return acc;
      }, {});

      if (module.effects) {
        const effects = module.effects(actions);
        Object.keys(effects).forEach(key => {
          const effect = effects[key];
          slice.api[key] = (state, props) => [state, effect(props)];
        });
      }

      slices = map(_ => slice)(slices);
    }

    if (module.view) {
      const mapToProps = module.mapToProps || (slices => ({ ...modulePath.reduce((o, k) => o[k], slices) }));
      const view = (props, children) => module.view({ ...mapToProps(slices), ...props }, children);
      acc.views = mapView(_ => view)(acc.views);
    }
  }
  return acc;
}, { ...seed });

export default (...modules) => addModules(modules, [], { init: {}, views: {} });
