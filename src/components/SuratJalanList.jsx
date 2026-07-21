import React, { useState, useMemo } from 'react'
import { tanggalIndonesia, sumPorsi } from '../utils.js'

export default function SuratJalanList({ docs, schools, onEdit, onDelete, onPrint }) {
  const [selected, setSelected] = useState(() => new Set())
  const [filterTanggal, setFilterTanggal] = useState('')

  const schoolName = (id) => schools.find((s) => s.id === id)?.nama || '(sekolah tidak ditemukan)'

  const filtered = useMemo(() => {
    const list = filterTanggal ? docs.filter((d) => d.tanggal === filterTanggal) : docs
    return [...list].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1))
  }, [docs, filterTanggal])

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected((prev) => {
      if (prev.size === filtered.length) return new Set()
      return new Set(filtered.map((d) => d.id))
    })
  }

  function handlePrintSelected() {
    if (selected.size === 0) {
      alert('Pilih minimal satu surat jalan untuk dicetak.')
      return
    }
    const order = filtered.filter((d) => selected.has(d.id)).map((d) => d.id)
    onPrint(order)
  }

  return (
    <div className="card">
      <div className="card-head">
        <h2>Daftar Surat Jalan</h2>
        <label className="filter-tanggal">
          <span>Filter tanggal:</span>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
          />
          {filterTanggal && (
            <button type="button" className="btn-plain" onClick={() => setFilterTanggal('')}>
              Bersihkan
            </button>
          )}
        </label>
      </div>

      {filtered.length === 0 ? (
        <p className="hint">Belum ada surat jalan yang dibuat.</p>
      ) : (
        <>
          <div className="list-toolbar">
            <label className="checkbox-line">
              <input
                type="checkbox"
                checked={selected.size > 0 && selected.size === filtered.length}
                onChange={toggleAll}
              />
              Pilih Semua ({selected.size}/{filtered.length})
            </label>
            <button type="button" className="btn-primary" onClick={handlePrintSelected}>
              🖨 Cetak yang Dipilih
            </button>
          </div>

          <div className="doc-list">
            {filtered.map((d) => (
              <div className="doc-item" key={d.id}>
                <input
                  type="checkbox"
                  checked={selected.has(d.id)}
                  onChange={() => toggle(d.id)}
                />
                <div className="doc-item-info">
                  <strong>{schoolName(d.sekolahId)}</strong>
                  <div className="hint">
                    {tanggalIndonesia(d.tanggal)}
                    {d.waktuPengiriman ? ` · ${d.waktuPengiriman}` : ''}
                    {d.driver ? ` · Driver: ${d.driver}` : ''} · Total porsi:{' '}
                    {sumPorsi(d.rows)}
                  </div>
                </div>
                <div className="doc-item-actions">
                  <button type="button" className="btn-secondary" onClick={() => onPrint([d.id])}>
                    Cetak
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => onEdit(d)}>
                    Ubah
                  </button>
                  <button
                    type="button"
                    className="btn-plain"
                    onClick={() => {
                      if (confirm('Hapus surat jalan ini?')) onDelete(d.id)
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
