const output = require('./output.json')

const POP_SIZE = 500

const pops = []

for (let index = 0; index < POP_SIZE; index++) {
  pops.push(output.caches.map(c =>  Math.floor(Math.random() * c.solutions.length)))
}

module.exports = {
  initialState: () => ({
    pops,
    best: {
      caches: null,
      score: null
    }
  }),

  configNode: {
    POP_SIZE,
    output
  },

  nodeFileModule: 'compute.js',

  workSize: 2048,

  next (state) {
    return [state.pops]
  },

  analyze (toCompute, results, state) {
    state.pops = toCompute[0].slice(0, POP_SIZE / 2).concat(results[0].pops)
    if (!state.best.caches || state.best.score < results[0].score) {
      state.best.caches = results[0].pops[0]
      state.best.score = results[0].score
    }
  },

  result (state) {
    if (!state.best.caches) {
      return 'N/A'
    }
    return `Score: ${state.best.score}\n` + state.best.caches.map((c, i) => i + ' ' + output.caches[i].solutions[c].join(' ')).join('\n')
  }
}
