export default ({ state, api }) => ({
  ...state, ...api,
  add10: [api.add, 10],
})
