export default counting => ({
  count: counting.state.count,
  pending: counting.state.pending,
  add: counting.operations.add,
})
