export function requestLogger(req, res, next) {
  const startNs = process.hrtime.bigint()
  const method = req.method
  const url = req.originalUrl || req.url
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '-'

  res.on('finish', () => {
    const endNs = process.hrtime.bigint()
    const durationMs = Number(endNs - startNs) / 1e6
    const tenant = req.params?.tenant || '-'
    const status = res.statusCode
    console.log(`[REQ] ${method} ${url} tenant=${tenant} status=${status} time=${durationMs.toFixed(1)}ms ip=${ip}`)
  })

  next()
}