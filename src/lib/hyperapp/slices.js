import squirrel from '../../npm/squirrel'

let slices = {};

const add = (path, slice) => {
  const sliceInfo = {};

  const map = squirrel(path);
  const { _init = s => s, ...actions } = slice.actions(action => map(state => sliceInfo.state = action(state)));

  Object.keys(actions).forEach(key => {
    const action = actions[key];
    actions[key] = (_, props, ev) => action(props, ev); // ditch the state ;)
  });
  sliceInfo.init = _init;
  sliceInfo.operations = slice.operations(actions);

  slices = map(_ => sliceInfo)(slices);
};

const connect = (mapToProps, component) => state => component(mapToProps(slices), state);

const hydrate = (slices, init) => {
  let state = init;
  Object.keys(slices).forEach(key => {
    const sliceInfo = slices[key];
    state = sliceInfo.init && typeof sliceInfo.init === "function" ? sliceInfo.init(state) : hydrate(sliceInfo, state);
  });
  return state;
};

const init = state => hydrate(slices, state);

export {
  add,
  init,
  connect,
}
