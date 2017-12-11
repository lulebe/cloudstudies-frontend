export default function (raw) {
  if (raw < 1024)
    return raw + 'B'
  const kb = raw/1024
  if (kb < 1024)
    return Math.round(kb) + 'KB'
  const mb = kb/1024
  if (mb < 1024)
    return Math.round(mb) + 'MB'
  return Math.round(mb/1024) + 'GB'
}