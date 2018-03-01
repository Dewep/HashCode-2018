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

module.exports = async function (config, toCompute) {
  const def = require('./data.json')
  let step = 0

  const veh = []
  for (let v = 0; v < def.nbVeh; v++) {
    veh.push({
      pR: 0,
      pC: 0,
      stepUntilAvailable: 0,
      sols: []
    })
  }

  const rides = def.rides.map((r, i) => ({
    ...r,
    i,
    taken: false
  }))

  while (step < def.nbSteps) {
    // console.log('STEP', step)
    veh.forEach((v, vI) => {
      if (v.stepUntilAvailable <= step) {
        const inter = rides.filter(r => !r.taken).filter(r => {
          return Math.max(step + dist(v.pR, v.pC, r.sR, r.sC), r.eS) + r.d < r.lT
        })
        if (inter.length) {
          const rideIndex = Math.round(Math.random() * (inter.length - 1))
          const ride = inter[rideIndex]
          ride.taken = true
          v.stepUntilAvailable = Math.max(step + dist(v.pR, v.pC, ride.sR, ride.sC), ride.eS) + ride.d
          v.pR = ride.fR
          v.pC = ride.fC
          v.sols.push(ride.i)
        }
      }
    })
    step++
  }

  const sol = veh.map(v => v.sols)
  // console.log({ sol })
  return {
    sol,
    score: score(def, sol)
  }
}
