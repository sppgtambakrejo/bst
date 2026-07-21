// db.js
// "Database" sederhana berbasis localStorage — tidak butuh koneksi internet
// atau layanan pihak ketiga (Supabase dll). Semua data tersimpan di browser
// perangkat yang dipakai. Kalau nanti mau pindah ke database sungguhan,
// cukup ganti isi fungsi-fungsi di file ini saja (bagian lain aplikasi tidak
// perlu berubah).

const KEYS = {
  SPPG: 'mbg_sppg_info',
  SCHOOLS: 'mbg_schools',
  SURAT_JALAN: 'mbg_surat_jalan',
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch (e) {
    console.error('Gagal membaca data', key, e)
    return fallback
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (e) {
    console.error('Gagal menyimpan data', key, e)
    return false
  }
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// ---------- SPPG (identitas pengirim, dipakai di semua surat jalan) ----------

const DEFAULT_SPPG = {
  namaSppg: 'SPPG KABUPATEN SLEMAN TEMPEL TAMBAKREJO',
  alamat: 'Jl. Tempel-Seyegan, Tambakrejo, Tempel, Sleman',
  ahliGizi: 'Dewi Nugraha Primastuti, S.Gz.',
  koordinatorLapangan: 'M. Syamsul Hadi',
}

export function getSppgInfo() {
  return read(KEYS.SPPG, DEFAULT_SPPG)
}

export function saveSppgInfo(info) {
  return write(KEYS.SPPG, info)
}

// ---------- Sekolah (data induk: nama sekolah + daftar kelas & porsi default) ----------

export function getSchools() {
  return read(KEYS.SCHOOLS, [])
}

export function saveSchools(schools) {
  return write(KEYS.SCHOOLS, schools)
}

export function upsertSchool(school) {
  const schools = getSchools()
  const idx = schools.findIndex((s) => s.id === school.id)
  if (idx >= 0) {
    schools[idx] = school
  } else {
    schools.push(school)
  }
  saveSchools(schools)
  return schools
}

export function deleteSchool(id) {
  const schools = getSchools().filter((s) => s.id !== id)
  saveSchools(schools)
  return schools
}

// ---------- Surat Jalan (dokumen harian) ----------

export function getSuratJalanList() {
  return read(KEYS.SURAT_JALAN, [])
}

export function saveSuratJalanList(list) {
  return write(KEYS.SURAT_JALAN, list)
}

export function upsertSuratJalan(doc) {
  const list = getSuratJalanList()
  const idx = list.findIndex((d) => d.id === doc.id)
  if (idx >= 0) {
    list[idx] = doc
  } else {
    list.unshift(doc)
  }
  saveSuratJalanList(list)
  return list
}

export function deleteSuratJalan(id) {
  const list = getSuratJalanList().filter((d) => d.id !== id)
  saveSuratJalanList(list)
  return list
}

// ---------- Import / Export cadangan (opsional, biar data tidak hilang) ----------

export function exportAllData() {
  return {
    sppg: getSppgInfo(),
    schools: getSchools(),
    suratJalan: getSuratJalanList(),
    exportedAt: new Date().toISOString(),
  }
}

export function importAllData(data) {
  if (data.sppg) saveSppgInfo(data.sppg)
  if (data.schools) saveSchools(data.schools)
  if (data.suratJalan) saveSuratJalanList(data.suratJalan)
}
