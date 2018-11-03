// convert action(s) into effect; so it can be used in BatchFx
export default (...actions) => ({ effect: (_, dispatch) => actions.forEach(action => dispatch(action)) })
