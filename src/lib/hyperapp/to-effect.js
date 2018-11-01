// convert action(s) into effect; so it can be used in BatchFx
export default as => ({effect:(_,d)=>Array.isArray(as)?as.forEach(a=>d(a)):d(as)})
