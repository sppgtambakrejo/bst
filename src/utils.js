// utils.js — helper tanggal & angka dalam format Indonesia

export function todayISO() {
  const d = new Date()
  const tz = d.getTimezoneOffset() * 60000
  return new Date(d - tz).toISOString().slice(0, 10)
}

export function hariIndonesia(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d)
}

export function tanggalIndonesia(isoDate) {
  if (!isoDate) return ''
  const d = new Date(isoDate + 'T00:00:00')
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export function sumPorsi(rows) {
  return rows.reduce((total, r) => total + (Number(r.jumlahPorsi) || 0), 0)
}
