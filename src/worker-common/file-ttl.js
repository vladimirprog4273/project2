const fs = require('fs')
const path = require('path')

function fileTTL(dir, expiresMs) {
  const files = fs.readdirSync(dir)

  const expiresTime = Date.now() - expiresMs

  files.forEach((fileName) => {
    const fullPath = path.join(dir, fileName)

    if (fs.statSync(fullPath).mtimeMs < expiresTime) {
      fs.unlinkSync(fullPath)
    }
  })
}

module.exports = fileTTL
