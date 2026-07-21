import React, { useState, useEffect, useRef } from 'react'

export default function SppgSettings({ sppg, onSave, onExport, onImport }) {
  const [form, setForm] = useState(sppg)
  const fileInputRef = useRef(null)

  useEffect(() => setForm(sppg), [sppg])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave(e) {
    e.preventDefault()
    onSave(form)
    alert('Identitas SPPG tersimpan.')
  }

  function handleImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        onImport(data)
        alert('Data berhasil dipulihkan dari file cadangan.')
      } catch (err) {
        alert('File cadangan tidak valid.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="card">
      <h2>Identitas SPPG</h2>
      <p className="hint">Data ini muncul di setiap surat jalan yang dicetak.</p>
      <form onSubmit={handleSave}>
        <label className="field">
          <span>Nama SPPG</span>
          <input
            type="text"
            value={form.namaSppg}
            onChange={(e) => update('namaSppg', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Alamat</span>
          <input
            type="text"
            value={form.alamat}
            onChange={(e) => update('alamat', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Nama Ahli Gizi (Diperiksa oleh)</span>
          <input
            type="text"
            value={form.ahliGizi}
            onChange={(e) => update('ahliGizi', e.target.value)}
          />
        </label>
        <label className="field">
          <span>Nama Koordinator Lapangan (Diterima Oleh)</span>
          <input
            type="text"
            value={form.koordinatorLapangan}
            onChange={(e) => update('koordinatorLapangan', e.target.value)}
          />
        </label>
        <div className="actions">
          <button type="submit" className="btn-primary">
            Simpan Identitas
          </button>
        </div>
      </form>

      <hr />

      <h2>Cadangan Data</h2>
      <p className="hint">
        Semua data (sekolah &amp; surat jalan) disimpan langsung di browser perangkat ini,
        bukan di server. Unduh cadangan secara berkala supaya data tidak hilang kalau
        cache browser dibersihkan, atau kalau kamu perlu memindahkan data ke perangkat lain.
      </p>
      <div className="actions">
        <button type="button" className="btn-secondary" onClick={onExport}>
          ⬇ Unduh Cadangan (.json)
        </button>
        <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>
          ⬆ Pulihkan dari File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={handleImportFile}
        />
      </div>
    </div>
  )
}
