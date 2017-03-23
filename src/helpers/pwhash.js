import SHA256 from 'crypto-js/sha256'
import encBase64 from 'crypto-js/enc-base64'

export default function (password) {
  const p = SHA256(password).toString(encBase64)
  return p.replace(/\//g, '_').replace(/\+/g, '-').replace(/=/g, '')
}
