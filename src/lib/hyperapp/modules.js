import squirrel from '../../npm/squirrel'
// TODO: better names

// TODO: make these local variables
// TODO: if reasonable get rid of state variable
let state = {};
let slices = {};
let views = {};

const addModules = (path, modules) => modules.forEach(module => {
  if (!Array.isArray(module)) state = squirrel(path)(_ => module)(state);
  else {
    const subPath = [...module[0].split('.').reverse(), ...path];
    if (Array.isArray(module[1])) addModules(subPath, module[1]);
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
        state = mapSlice(_ => sliceInfo.state = { ...(slice.init || {}), ...props })(state);
      }

      if (slice.view) {
        const pr = [...subPath].reverse();
        const mapToProps = slice.mapToProps || (slices => ({ ...pr.reduce((o, k) => o[k], slices) }));
        const view = (props, children) => slice.view({ ...mapToProps(slices), ...props }, children);

        const [viewName, ...rest] = subPath;
        const mapView = squirrel([viewName.replace(/^./, c => c.toUpperCase()), ...rest]);
        views = mapView(_ => view)(views);
      }
    }
  }
});

export default (...modules) => {
  addModules([], modules);
  return { init: state, views };
};
