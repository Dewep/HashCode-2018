const botCluster = require('botcluster')

botCluster.Server({
  application: {
    secret: 41,
    modulesDirectory: __dirname
  },
  serverWeb: {
    host: '0.0.0.0'
  }
}).catch(err => {
  console.error('[general-error]', err)
  process.exit(1)
})
