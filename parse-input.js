const fs = require('fs')
const content = fs.readFileSync(process.argv[2]).toString().split('\n')

const firstLine = content[0].split(' ').map(n => +n)

const res = {
  nbRows: firstLine[0],
  nbCols: firstLine[1],
  nbVeh: firstLine[2],
  nbRides: firstLine[3],
  bonus: firstLine[4],
  nbSteps: firstLine[5],
  rides: []
}

let lineIndex = 1

for (let index = 0; index < res.nbRides; index++) {
  let line = content[lineIndex++].split(' ').map(n => +n)
  const ride = {
    sR: line[0],
    sC: line[1],
    fR: line[2],
    fC: line[3],
    eS: line[4],
    lT: line[5]
  }
  ride.d = Math.abs(ride.sR - ride.fR) + Math.abs(ride.sC - ride.fC)
  res.rides.push(ride)
}

fs.writeFileSync(process.argv[3], JSON.stringify(res))
