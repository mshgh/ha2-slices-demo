import squirrel from '../../npm/squirrel'

let slices = {};
let state = {};

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

export {
  add,
  init,
  connect,
}
