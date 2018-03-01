class Individual {
  constructor (caches, config) {
    this.caches = caches
    this.config = config
    this._score = null
  }

  get score () {
    if (this._score === null) {
      let time = 0
      let nbRequests = 0
      this.config.output.endpoints.forEach(e => {
        e.v.forEach(v => {
          let latency = e.d
          e.c.forEach(c => {
            if (!this.config.output.caches[c.c].solutions[this.caches[c.c]]) {
              // console.log(this.config.output.caches[c.c].solutions, this.caches[c.c])
            }
            if (c.l < latency && this.config.output.caches[c.c].solutions[this.caches[c.c]].indexOf(v.v) !== -1) {
              latency = c.l
            }
          })
          time += v.n * (e.d - latency)
          nbRequests += v.n
        })
      })
      this._score = Math.floor(time / nbRequests * 1000)
    }
    return this._score
  }

  crossover (b) {
    for (let index = 0; index < this.caches.length; index++) {
      if (this.caches[index] !== b.caches[index]) {
        if (Math.random() > 0.5) {
          this.caches[index] = b.caches[index]
        } else {
          b.caches[index] = this.caches[index]
        }
      }
    }
    this._score = null
    b._score = null
  }

  mutate () {
    const index = Math.floor(Math.random() * this.caches.length)
    this.caches[index] = Math.floor(Math.random() * this.config.output.caches[index].solutions.length)
    this._score = null
  }

  clone () {
    return new Individual(this.caches.slice(0), this.config)
  }
}

function compareIndividuals (a, b) {
  return b.score - a.score
}

function generatePops (pops, config) {
  return pops.map(p => new Individual(p, config))
}

function breeding (pops, a, b) {
  if (Math.random() < 0.8) {
    a.crossover(b)
  }
  if (Math.random() < 0.1) {
    a.mutate()
  }
  if (Math.random() < 0.1) {
    b.mutate()
  }
  pops.push(a)
  pops.push(b)
}

module.exports = async function (config, toCompute) {
  let pops = generatePops(toCompute, config)
  // await new Promise(resolve => setTimeout(resolve, 50000))
  pops.sort(compareIndividuals)

  let turn = 0
  while (turn++ < 100) {
    const newPops = [pops[0]]
    for (let index = 0; index < Math.floor(pops.length / 2); index++) {
      breeding(newPops, pops[index * 2].clone(), pops[index * 2 + 1].clone())
    }
    pops = newPops
    pops.sort(compareIndividuals)
  }

  return { pops: pops.slice(0, pops.length / 2).map(p => p.caches), score: pops[0].score }
}
