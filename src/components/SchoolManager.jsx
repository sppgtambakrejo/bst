import React, { useState } from 'react'
import { uid } from '../db.js'

function emptyKelas() {
  return { id: uid(), nama: '', defaultPorsi: '' }
}

function emptySchool() {
  return { id: uid(), nama: '', kelasList: [emptyKelas()] }
}

export default function SchoolManager({ schools, onSave, onDelete }) {
  const [editing, setEditing] = useState(null) // school object being edited, or null
  const [confirmDeleteId, setConfirmDeleteId] = useState(null)

  function startNew() {
    setEditing(emptySchool())
  }

  function startEdit(school) {
    // deep copy supaya edit tidak langsung mengubah data asli sebelum disimpan
    setEditing(JSON.parse(JSON.stringify(school)))
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
      alert('Nama sekolah wajib diisi.')
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
    return (
      <div className="card">
        <h2>{editing.nama ? 'Ubah Sekolah' : 'Tambah Sekolah'}</h2>

        <label className="field">
          <span>Nama Sekolah</span>
          <input
            type="text"
            value={editing.nama}
            onChange={(e) => updateField('nama', e.target.value)}
            placeholder="Contoh: SMA NEGERI 1 TEMPEL"
          />
        </label>

        <h3>Daftar Kelas &amp; Porsi Default</h3>
        <p className="hint">
          Ini jadi template harian. Saat membuat surat jalan baru untuk sekolah ini,
          daftar kelas dan jumlah porsi akan otomatis terisi dari sini — kamu tinggal
          ubah kalau ada perubahan hari itu.
        </p>

        <div className="kelas-editor">
          <div className="kelas-editor-head">
            <span>Nama Kelas</span>
            <span>Porsi Default</span>
            <span></span>
          </div>
          {editing.kelasList.map((k, idx) => (
            <div className="kelas-editor-row" key={k.id}>
              <input
                type="text"
                value={k.nama}
                onChange={(e) => updateKelas(idx, 'nama', e.target.value)}
                placeholder="Contoh: X A"
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
          + Tambah Kelas
        </button>

        <div className="actions">
          <button type="button" className="btn-primary" onClick={handleSave}>
            Simpan Sekolah
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
        <h2>Data Sekolah</h2>
        <button type="button" className="btn-primary" onClick={startNew}>
          + Tambah Sekolah
        </button>
      </div>

      {schools.length === 0 && (
        <p className="hint">
          Belum ada sekolah. Tambahkan sekolah pertama untuk mulai membuat surat jalan.
        </p>
      )}

      <div className="school-list">
        {schools.map((s) => (
          <div className="school-item" key={s.id}>
            <div>
              <strong>{s.nama}</strong>
              <div className="hint">{s.kelasList.length} kelas terdaftar</div>
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
