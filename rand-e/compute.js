function dist (sR, sC, fR, fC) {
  return Math.abs(sR - fR) + Math.abs(sC - fC)
}

function score (def, sol) {
  let points = 0
  let step = 0
  const veh = []

  for (let v = 0; v < def.nbVeh; v++) {
    veh.push({
      pR: 0,
      pC: 0,
      stepUntilAvailable: 0,
      currentRideIndex: 0
    })
  }

  while (step < def.nbSteps) {
    // console.log('STEP', step)
    veh.forEach((v, vI) => {
      if (v.stepUntilAvailable <= step) {
        if (v.currentRideIndex < sol[vI].length) {
          const ride = def.rides[sol[vI][v.currentRideIndex]]
          const before = Math.max(step + dist(v.pR, v.pC, ride.sR, ride.sC), ride.eS)
          v.stepUntilAvailable = before + ride.d
          if (v.stepUntilAvailable < ride.lT) {
            // console.log('earn', ride.d, vI, v.currentRideIndex)
            points += ride.d
            if (before === ride.eS) {
              points += def.bonus
              // console.log('earn bonus', def.bonus)
            }
          } else {
            // console.log('no point')
          }
          v.pR = ride.fR
          v.pC = ride.fC
          v.currentRideIndex++
        }
      }
    })
    step++
  }

  return points
}

function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
  }
}

module.exports = async function (config, toCompute) {
  const def = require('./data.json')
  let step = 0

  const veh = []
  for (let v = 0; v < def.nbVeh; v++) {
    veh.push({
      i: v,
      pR: 0,
      pC: 0,
      stepUntilAvailable: 0,
      sols: []
    })
  }
  shuffle(veh)

  let rides = def.rides.map((r, i) => ({
    ...r,
    i,
    taken: false
  })).sort((a, b) => a.eS - b.eS)

  while (step < def.nbSteps) {
    let nextStep = def.nbSteps
    console.log('STEP', step)
    const ran = false
    veh.forEach((v, vI) => {
      nextStep = Math.min(v.stepUntilAvailable, nextStep)
      if (v.stepUntilAvailable <= step) {
        const inter = rides.filter(r => !r.taken).map(r => {
          r.dist = dist(v.pR, v.pC, r.sR, r.sC)
          r.before = Math.max(step + r.dist, r.eS)
          r.points = r.d > 1000 ? 1 : r.d + (r.before === r.eS ? def.bonus : 0)
          r.ratio = Math.round(r.points * 100 / (r.before - step + r.d))
          return r
        }).filter(r => {
          return r.before + r.d < r.lT
        }).sort((a, b) => b.ratio - a.ratio)
        if (inter.length) {
          // console.log(step)
          const rideIndex = Math.round(Math.random() * (Math.min(inter.length, 2) - 1))
          const ride = inter[rideIndex]
          ride.taken = true
          v.stepUntilAvailable = ride.before + ride.d
          v.pR = ride.fR
          v.pC = ride.fC
          v.sols.push(ride.i)
        }
      }
    })
    rides = rides.filter(r => step < r.lT - r.d)
    step = Math.max(nextStep, step + 1)
  }

  const sol = veh.sort((a, b) => a.i - b.i).map(v => v.sols)
  // console.log({ sol })
  return {
    sol,
    score: score(def, sol)
  }
}
