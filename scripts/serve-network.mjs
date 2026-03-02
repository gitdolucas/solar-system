#!/usr/bin/env node

/**
 * Serves the Next.js app on all network interfaces so you can open it
 * on your phone (same Wi‑Fi). Run: npm run dev:network
 */

import { spawn } from 'child_process'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const PORT = process.env.PORT || 3000

function getLocalIPs() {
  const ifaces = os.networkInterfaces()
  const ips = []
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        ips.push(iface.address)
      }
    }
  }
  return [...new Set(ips)]
}

const ips = getLocalIPs()
console.log('')
console.log('  Serving on the network — open on your phone (same Wi‑Fi):')
console.log('')
if (ips.length) {
  ips.forEach((ip) => console.log(`    http://${ip}:${PORT}`))
} else {
  console.log('    (no non-internal IPv4 found; try opening http://0.0.0.0:' + PORT + ')')
}
console.log('')
console.log('  Local: http://localhost:' + PORT)
console.log('')

const child = spawn(
  'npx',
  ['next', 'dev', '--hostname', '0.0.0.0', '--port', String(PORT)],
  {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..'),
  }
)

child.on('error', (err) => {
  console.error('Failed to start:', err.message)
  process.exit(1)
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
