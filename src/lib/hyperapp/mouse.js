const mouseEffect = (props, dispatch) => {
  const addListener = (name, action) => {
    const listener = { name };
    if (action) addEventListener(listener.name, listener.handler = event => dispatch(action, event));
    return listener;
  };

  const listeners = [
    addListener("mousemove", props.mouseMove),
    addListener("click", props.click),
  ];

  return () => listeners.forEach(l => l.handler && removeEventListener(l.name, l.handler));
};

export default props => ({ ...props, effect: mouseEffect })
