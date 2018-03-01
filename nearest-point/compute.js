module.exports = async function (config, toCompute) {
  const x1 = toCompute[0]
  const y1 = toCompute[1]
  const x2 = config.targetPoint[0]
  const y2 = config.targetPoint[1]

  if (Math.round(Math.random() * 20000) === 1602) {
    throw new Error('Error 16/02')
  }

  // return Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * 100) / 100
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.round(Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) * 100) / 100)
    })
  }, 50)
}
