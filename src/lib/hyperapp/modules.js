import squirrel from '../../npm/squirrel'
// TODO: better names

let slices = {};

const addModules = (modules, path, seed) => modules.reduce((res, module) => {
  if (!Array.isArray(module)) res.init = squirrel(path)(_ => module)(res.init);
  else {
    const subPath = [...module[0].split('.').reverse(), ...path];
    if (Array.isArray(module[1])) res = addModules(module[1], subPath, res);
    else {
      // TODO: simplier and cleaner implementation
      const slice = module[1];
      const props = module[2] || {};
      if (slice.actions) {
        const mapSlice = squirrel(subPath);

        const sliceInfo = {};
        const actions = Object.keys(slice.actions).reduce((actions, key) => {
          const action = slice.actions[key];
          actions[key] = (_, props, ev) => mapSlice(state => sliceInfo.state = action(props, ev)(state)); // ditch the state ;)
          return actions;
        }, {});

        sliceInfo.api = slice.api ? slice.api(actions) : actions;
        slices = mapSlice(_ => sliceInfo)(slices);
        res.init = mapSlice(_ => sliceInfo.state = { ...(slice.init || {}), ...props })(res.init);
      }

      if (slice.view) {
        const pr = [...subPath].reverse();
        const mapToProps = slice.mapToProps || (slices => ({ ...pr.reduce((o, k) => o[k], slices) }));
        const view = (props, children) => slice.view({ ...mapToProps(slices), ...props }, children);

        const [viewName, ...rest] = subPath;
        const mapView = squirrel([viewName.replace(/^./, c => c.toUpperCase()), ...rest]);
        res.views = mapView(_ => view)(res.views);
      }
    }
  }
  return res;
}, { ...seed });

export default (...modules) => addModules(modules, [], { init: {}, views: {} });
