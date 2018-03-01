const points = []

function getRandomPosition () {
  return Math.round(Math.random() * 1000) - 500
}

function completePoints () {
  for (let x = -250; x < 250; x++) {
    for (let y = -250; y < 250; y++) {
      points.push([x, y])
    }
  }
}

completePoints()

const targetPoint = [getRandomPosition(), getRandomPosition()]

module.exports = {
  initialState: () => ({
    position: 0,
    best: {
      point: null,
      distance: null
    }
  }),

  configNode: {
    targetPoint
  },

  nodeFilesModule: ['compute.js'],

  workSize: points.length,

  next (state) {
    const toCompute = []
    const maxPosition = Math.min(state.position + 1000, points.length)
    for (; state.position < maxPosition; state.position++) {
      toCompute.push(points[state.position])
    }
    return toCompute
  },

  analyze (toCompute, results, state) {
    for (let i = 0; i < toCompute.length && i < results.length; i++) {
      if (!state.best.point || state.best.distance > results[i]) {
        state.best.point = toCompute[i]
        state.best.distance = results[i]
      }
    }
  },

  result (state) {
    const prefix = `Nearest point of [${targetPoint.toString()}]: `
    if (state.best.point) {
      return `${prefix}[${state.best.point.toString()}] with a distance of ${state.best.distance}`
    }
    return prefix + 'N/A'
  }
}
