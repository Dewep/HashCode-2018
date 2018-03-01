module.exports = {
  initialState: () => ({
    work: 0,
    best: {
      sol: null,
      score: null
    }
  }),

  configNode: {
  },

  nodeFilesModule: ['compute.js', 'a_example.json'],

  workSize: 2048,

  next (state) {
    if (state.work > 2048) {
      return []
    }
    state.work++
    return new Array(100)
  },

  analyze (toCompute, results, state) {
    for (let i = 0; i < toCompute.length && i < results.length; i++) {
      if (!state.best.sol || state.best.score < results[i].score) {
        state.best.sol = results[i].sol
        state.best.score = results[i].score
      }
    }
  },

  result (state) {
    if (!state.best.sol) {
      return 'N/A'
    }
    return `Score: ${state.best.score}\n` + JSON.stringify(state.best.sol)
  }
}
