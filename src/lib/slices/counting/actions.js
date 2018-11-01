const init = {
  count: 1,
  pending: false,
};

const _init = state => ({ ...init, ...state });

const add = amount => state => ({
  ...state,
  count: state.count + Math.floor(amount + 0.5),
  pending: false,
});

export default {
  _init,
  add,
}
