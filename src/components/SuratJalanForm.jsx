import React, { useState, useEffect } from 'react'
import { uid } from '../db.js'
import { todayISO, hariIndonesia, sumPorsi } from '../utils.js'

function buildRowsFromSchool(school) {
  return school.kelasList.map((k) => ({
    id: uid(),
    kelas: k.nama,
    jumlahPorsi: k.defaultPorsi || 0,
    alatSebelum: '',
    alatSesudah: '',
    keterangan: '',
  }))
}

export default function SuratJalanForm({ schools, editingDoc, onSaved, onCancelEdit }) {
  const [sekolahId, setSekolahId] = useState('')
  const [tanggal, setTanggal] = useState(todayISO())
  const [waktuPengiriman, setWaktuPengiriman] = useState('')
  const [driver, setDriver] = useState('')
  const [rows, setRows] = useState([])

  useEffect(() => {
    if (editingDoc) {
      setSekolahId(editingDoc.sekolahId)
      setTanggal(editingDoc.tanggal)
      setWaktuPengiriman(editingDoc.waktuPengiriman || '')
      setDriver(editingDoc.driver || '')
      setRows(editingDoc.rows)
    }
  }, [editingDoc])

  function handlePilihSekolah(id) {
    setSekolahId(id)
    if (!editingDoc || editingDoc.sekolahId !== id) {
      const school = schools.find((s) => s.id === id)
      if (school) setRows(buildRowsFromSchool(school))
    }
  }

  function updateRow(idx, field, value) {
    setRows((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  function addRow() {
    setRows((prev) => [
      ...prev,
      { id: uid(), kelas: '', jumlahPorsi: 0, alatSebelum: '', alatSesudah: '', keterangan: '' },
    ])
  }

  function removeRow(idx) {
    setRows((prev) => prev.filter((_, i) => i !== idx))
  }

  function resetForm() {
    setSekolahId('')
    setTanggal(todayISO())
    setWaktuPengiriman('')
    setDriver('')
    setRows([])
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!sekolahId) {
      alert('Pilih sekolah tujuan dulu.')
      return
    }
    if (rows.length === 0) {
      alert('Tambahkan minimal satu baris kelas.')
      return
    }
    const doc = {
      id: editingDoc ? editingDoc.id : uid(),
      sekolahId,
      tanggal,
      waktuPengiriman,
      driver,
      rows,
      createdAt: editingDoc ? editingDoc.createdAt : new Date().toISOString(),
    }
    onSaved(doc)
    if (!editingDoc) resetForm()
  }

  const total = sumPorsi(rows)
  const selectedSchool = schools.find((s) => s.id === sekolahId)

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="card-head">
        <h2>{editingDoc ? 'Ubah Surat Jalan' : 'Buat Surat Jalan Baru'}</h2>
        {editingDoc && (
          <button type="button" className="btn-plain" onClick={onCancelEdit}>
            Batal ubah
          </button>
        )}
      </div>

      {schools.length === 0 ? (
        <p className="hint">
          Belum ada data sekolah. Tambahkan sekolah dulu di tab &quot;Data Sekolah&quot;.
        </p>
      ) : (
        <>
          <div className="form-grid">
            <label className="field">
              <span>Sekolah Tujuan</span>
              <select value={sekolahId} onChange={(e) => handlePilihSekolah(e.target.value)}>
                <option value="">— Pilih Sekolah —</option>
                {schools.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nama}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span>Tanggal</span>
              <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
              <span className="hint">Hari: {hariIndonesia(tanggal) || '-'}</span>
            </label>

            <label className="field">
              <span>Waktu Pengiriman</span>
              <input
                type="time"
                value={waktuPengiriman}
                onChange={(e) => setWaktuPengiriman(e.target.value)}
              />
            </label>

            <label className="field">
              <span>Driver</span>
              <input
                type="text"
                value={driver}
                onChange={(e) => setDriver(e.target.value)}
                placeholder="Nama driver"
              />
            </label>
          </div>

          {selectedSchool && (
            <>
              <h3>Daftar Kelas &amp; Porsi</h3>
              <div className="rows-editor">
                <div className="rows-editor-head">
                  <span>Kelas</span>
                  <span>Jumlah Porsi</span>
                  <span>Alat Sebelum</span>
                  <span>Alat Sesudah</span>
                  <span>Keterangan</span>
                  <span></span>
                </div>
                {rows.map((r, idx) => (
                  <div className="rows-editor-row" key={r.id}>
                    <input
                      type="text"
                      value={r.kelas}
                      onChange={(e) => updateRow(idx, 'kelas', e.target.value)}
                    />
                    <input
                      type="number"
                      min="0"
                      value={r.jumlahPorsi}
                      onChange={(e) => updateRow(idx, 'jumlahPorsi', e.target.value)}
                    />
                    <input
                      type="text"
                      value={r.alatSebelum}
                      onChange={(e) => updateRow(idx, 'alatSebelum', e.target.value)}
                    />
                    <input
                      type="text"
                      value={r.alatSesudah}
                      onChange={(e) => updateRow(idx, 'alatSesudah', e.target.value)}
                    />
                    <input
                      type="text"
                      value={r.keterangan}
                      onChange={(e) => updateRow(idx, 'keterangan', e.target.value)}
                    />
                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => removeRow(idx)}
                      title="Hapus baris"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button type="button" className="btn-secondary" onClick={addRow}>
                + Tambah Baris
              </button>

              <div className="total-line">
                Total Porsi: <strong>{total}</strong>
              </div>
            </>
          )}

          <div className="actions">
            <button type="submit" className="btn-primary">
              {editingDoc ? 'Simpan Perubahan' : 'Simpan Surat Jalan'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}
