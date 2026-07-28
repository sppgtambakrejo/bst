import React, { useState } from 'react'
import { uid } from '../db.js'

function emptyKelas() {
  return { id: uid(), nama: '', defaultPorsi: '' }
}

function emptySchool() {
  return { id: uid(), nama: '', jenis: 'sekolah', kelasList: [emptyKelas()] }
}

// Label istilah "Kelas" berbeda tergantung jenis tujuan. Field data tetap
// pakai nama internal `kelasList` / `kelas` supaya tidak perlu migrasi data,
// hanya labelnya saja yang berubah di tampilan.
function labelKelompok(jenis) {
  return jenis === 'posyandu' ? 'Kelompok Sasaran' : 'Kelas'
}

export default function SchoolManager({ schools, onSave, onDelete }) {
  const [editing, setEditing] = useState(null) // school object being edited, or null
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function startNew() {
    setEditing(emptySchool())
  }

  function startEdit(school) {
    // deep copy supaya edit tidak langsung mengubah data asli sebelum disimpan
    setEditing({ jenis: 'sekolah', ...JSON.parse(JSON.stringify(school)) })
  }

  function cancelEdit() {
    setEditing(null)
  }

  function updateField(field, value) {
    setEditing((prev) => ({ ...prev, [field]: value }))
  }

  function updateKelas(idx, field, value) {
    setEditing((prev) => {
      const kelasList = [...prev.kelasList]
      kelasList[idx] = { ...kelasList[idx], [field]: value }
      return { ...prev, kelasList }
    })
  }

  function addKelas() {
    setEditing((prev) => ({ ...prev, kelasList: [...prev.kelasList, emptyKelas()] }))
  }

  function removeKelas(idx) {
    setEditing((prev) => ({
      ...prev,
      kelasList: prev.kelasList.filter((_, i) => i !== idx),
    }))
  }

  function handleSave() {
    if (!editing.nama.trim()) {
      alert(editing.jenis === 'posyandu' ? 'Nama posyandu wajib diisi.' : 'Nama sekolah wajib diisi.')
      return
    }
    const cleaned = {
      ...editing,
      kelasList: editing.kelasList
        .filter((k) => k.nama.trim())
        .map((k) => ({ ...k, defaultPorsi: Number(k.defaultPorsi) || 0 })),
    }
    onSave(cleaned)
    setEditing(null)
  }

  if (editing) {
    const label = labelKelompok(editing.jenis)
    return (
      <div className="card">
        <h2>{editing.nama ? 'Ubah Tujuan' : 'Tambah Tujuan'}</h2>

        <label className="field">
          <span>Jenis Tujuan</span>
          <select value={editing.jenis || 'sekolah'} onChange={(e) => updateField('jenis', e.target.value)}>
            <option value="sekolah">Sekolah</option>
            <option value="posyandu">Posyandu</option>
          </select>
        </label>

        <label className="field">
          <span>{editing.jenis === 'posyandu' ? 'Nama Posyandu' : 'Nama Sekolah'}</span>
          <input
            type="text"
            value={editing.nama}
            onChange={(e) => updateField('nama', e.target.value)}
            placeholder={
              editing.jenis === 'posyandu' ? 'Contoh: POSYANDU MELATI 1' : 'Contoh: SMA NEGERI 1 TEMPEL'
            }
          />
        </label>

        <h3>Daftar {label} &amp; Porsi Default</h3>
        <p className="hint">
          Ini jadi template harian. Saat membuat surat jalan baru untuk tujuan ini,
          daftar {label.toLowerCase()} dan jumlah porsi akan otomatis terisi dari sini — kamu tinggal
          ubah kalau ada perubahan hari itu.
        </p>

        <div className="kelas-editor">
          <div className="kelas-editor-head">
            <span>Nama {label}</span>
            <span>Porsi Default</span>
            <span></span>
          </div>
          {editing.kelasList.map((k, idx) => (
            <div className="kelas-editor-row" key={k.id}>
              <input
                type="text"
                value={k.nama}
                onChange={(e) => updateKelas(idx, 'nama', e.target.value)}
                placeholder={editing.jenis === 'posyandu' ? 'Contoh: Baduta' : 'Contoh: X A'}
              />
              <input
                type="number"
                min="0"
                value={k.defaultPorsi}
                onChange={(e) => updateKelas(idx, 'defaultPorsi', e.target.value)}
                placeholder="0"
              />
              <button
                type="button"
                className="btn-icon danger"
                onClick={() => removeKelas(idx)}
                title="Hapus baris"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button type="button" className="btn-secondary" onClick={addKelas}>
          + Tambah {label}
        </button>

        <div className="actions">
          <button type="button" className="btn-primary" onClick={handleSave}>
            Simpan
          </button>
          <button type="button" className="btn-plain" onClick={cancelEdit}>
            Batal
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-head">
        <h2>Data Sekolah &amp; Posyandu</h2>
        <button type="button" className="btn-primary" onClick={startNew}>
          + Tambah Tujuan
        </button>
      </div>

      {schools.length === 0 && (
        <p className="hint">
          Belum ada sekolah atau posyandu. Tambahkan tujuan pertama untuk mulai membuat surat jalan.
        </p>
      )}

      <div className="school-list">
        {schools.map((s) => (
          <div className="school-item" key={s.id}>
            <div>
              <strong>{s.nama}</strong>{' '}
              <span
                style={{
                  fontSize: '0.75em',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: s.jenis === 'posyandu' ? '#e0f2ee' : '#e8eefb',
                  color: s.jenis === 'posyandu' ? '#0f766e' : '#3b5bdb',
                }}
              >
                {s.jenis === 'posyandu' ? 'Posyandu' : 'Sekolah'}
              </span>
              <div className="hint">
                {s.kelasList.length} {labelKelompok(s.jenis).toLowerCase()} terdaftar
              </div>
            </div>
            <div className="school-item-actions">
              <button type="button" className="btn-secondary" onClick={() => startEdit(s)}>
                Ubah
              </button>
              {confirmDeleteId === s.id ? (
                <>
                  <button
                    type="button"
                    className="btn-icon danger"
                    onClick={() => {
                      onDelete(s.id)
                      setConfirmDeleteId(null)
                    }}
                  >
                    Yakin, Hapus
                  </button>
                  <button
                    type="button"
                    className="btn-plain"
                    onClick={() => setConfirmDeleteId(null)}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="btn-plain"
                  onClick={() => setConfirmDeleteId(s.id)}
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
