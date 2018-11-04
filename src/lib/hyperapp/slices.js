import squirrel from '../../npm/squirrel'

let state = {};
let slices = {};
let views = {};

const add = (path, slice, init) => {
  const map = squirrel(path);

  const sliceInfo = {};
  let _init = s => s;
  const actions = Object.keys(slice.actions).reduce((actions, key) => {
    const action = slice.actions[key];
    if (key === "_init") _init = action;
    else actions[key] = (_, props, ev) => map(state => sliceInfo.state = action(props, ev)(state)); // ditch the state ;)
    return actions;
  }, {});

  state = map(_ => sliceInfo.state = _init(init))(state);
  sliceInfo.api = slice.api ? slice.api(actions) : actions;
  slices = map(_ => sliceInfo)(slices);
};

const connect = (mapToProps, component) => (props, children) => component({ ...mapToProps(slices), ...props }, children);

const init = init => ({ ...state, ...init });

const buildSlice = (path, modules) => modules.forEach(module => {
  if (!Array.isArray(module)) state = squirrel(path)(_ => module)(state);
  else {
    const subPath = [...module[0].split('.').reverse(), ...path];
    if (Array.isArray(module[1])) buildSlice(subPath, module[1]);
    else add(subPath, module[1], module[2]);
  }
});

const modules = (...modules) => {
  buildSlice([], modules);
  return { init: state, views, a:'a', slices };
};

export {
  modules,
  add,
  init,
  connect,
}
