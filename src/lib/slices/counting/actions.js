export default map => {

  const state = {
    count: 1,
    pending: false,
  };

  const _init = map(_ => state);

  const add = amount => map(state => ({
      ...state,
      count: state.count + Math.floor(amount + 0.5),
      pending: false,
  }));

  return {
    _init,
    add,
  };
}
