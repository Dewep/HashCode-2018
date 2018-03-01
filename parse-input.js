const fs = require('fs')
const content = fs.readFileSync(process.argv[2]).toString().split('\n')

const firstLine = content[0].split(' ').map(n => +n)

const res = {
  videos: content[1].split(' ').map(s => +s),
  caches: [],
  endpoints: [],
  cacheSize: firstLine[4]
}

let lineIndex = 2

for (let index = 0; index < firstLine[3]; index++) {
  res.caches.push({
    all: [],
    solutions: [],
    v: {}
  })
}

for (let index = 0; index < firstLine[1]; index++) {
  let line = content[lineIndex++].split(' ').map(n => +n)
  res.endpoints.push({
    d: line[0], // latency to datacenter
    c: [], // cache
    v: [] // videos
  })
  for (let j = 0; j < line[1]; j++) {
    let line2 = content[lineIndex++].split(' ').map(n => +n)
    res.endpoints[index].c.push({ c: line2[0], l: line2[1] })
  }
}

function addToCache (line, c) {
  res.caches[c.c].v[line[0]] = (res.caches[c.c].v[line[0]] || 0) + line[2]
}

for (let index = 0; index < firstLine[2]; index++) {
  let line = content[lineIndex++].split(' ').map(n => +n)
  res.endpoints[line[1]].v.push({ v: line[0], n: line[2] })
  res.endpoints[line[1]].c.forEach(addToCache.bind(null, line))
}

res.caches.forEach(c => {
  c.all = Object.keys(c.v).map(n => +n)
})

function checkSum (arr, newPos) {
  let total = res.videos[newPos]
  for (let index = 0; index < arr.length; index++) {
    total += res.videos[arr[index]]
  }
  return total < res.cacheSize
}

function findCacheSolutionsRec (c, arr, pos) {
  if (!arr) {
    arr = []
  }
  if (!pos) {
    pos = 0
  }

  for (let newPos = pos; newPos < c.all.length; newPos++) {
    if (c.solutions.length < 500 && checkSum(arr, c.all[newPos])) { // Check newArr < cacheSize
      const newArr = arr.slice(0)
      newArr.push(c.all[newPos])
      findCacheSolutionsRec(c, newArr, newPos + 1)
    }
  }

  if (arr.length || !c.solutions.length) {
    c.solutions.push(arr)
  }
}

function findCacheSolutions (c, i) {
  console.log('Cache', i, '/', res.caches.length, `(${c.all.length})`)
  findCacheSolutionsRec(c)
}

res.caches.forEach(findCacheSolutions)

fs.writeFileSync(process.argv[3], JSON.stringify(res))
