import squirrel from '../../npm/squirrel'

let slices = {};
let state = {};

const add = (path, slice, init) => {
  const sliceInfo = {};

  const map = squirrel(path);
  const { _init = s => s, ...actions } = slice.actions(action => map(state => sliceInfo.state = action(state)));

  Object.keys(actions).forEach(key => {
    const action = actions[key];
    actions[key] = (_, props, ev) => action(props, ev); // ditch the state ;)
  });
  sliceInfo.operations = slice.operations(actions);

  state = map(_ => sliceInfo.state = _init(init))(state);
  slices = map(_ => sliceInfo)(slices);
};

const connect = (mapToProps, component) => state => component(mapToProps(slices), state);

const init = init => ({ ...state, ...init });

export {
  add,
  init,
  connect,
}
