import React, { useState, useEffect } from 'react'
import * as db from './db.js'
import { uid } from './db.js'
import SchoolManager from './components/SchoolManager.jsx'
import SuratJalanForm from './components/SuratJalanForm.jsx'
import SuratJalanList from './components/SuratJalanList.jsx'
import PrintView from './components/PrintView.jsx'
import SppgSettings from './components/SppgSettings.jsx'

const CONTOH_SEKOLAH = {
  id: uid(),
  nama: 'SMA NEGERI 1 TEMPEL',
  kelasList: [
    { id: uid(), nama: 'X A', defaultPorsi: 36 },
    { id: uid(), nama: 'X B', defaultPorsi: 36 },
    { id: uid(), nama: 'X C', defaultPorsi: 36 },
    { id: uid(), nama: 'X D', defaultPorsi: 36 },
    { id: uid(), nama: 'XI A', defaultPorsi: 34 },
    { id: uid(), nama: 'XI B', defaultPorsi: 36 },
    { id: uid(), nama: 'XI C', defaultPorsi: 36 },
    { id: uid(), nama: 'XI D', defaultPorsi: 35 },
    { id: uid(), nama: 'XII A', defaultPorsi: 36 },
    { id: uid(), nama: 'XII B', defaultPorsi: 35 },
    { id: uid(), nama: 'XII C', defaultPorsi: 36 },
    { id: uid(), nama: 'XII D', defaultPorsi: 36 },
    { id: uid(), nama: 'GTK', defaultPorsi: 50 },
    { id: uid(), nama: 'SAMPEL', defaultPorsi: 1 },
  ],
}

export default function App() {
  const [tab, setTab] = useState('buat') // buat | daftar | sekolah | pengaturan
  const [schools, setSchools] = useState([])
  const [docs, setDocs] = useState([])
  const [sppg, setSppg] = useState(db.getSppgInfo())
  const [editingDoc, setEditingDoc] = useState(null)
  const [printIds, setPrintIds] = useState(null)

  useEffect(() => {
    let existing = db.getSchools()
    if (existing.length === 0) {
      // Seed satu contoh sekolah dari dokumen aslinya, biar aplikasi tidak kosong total
      // saat pertama kali dipakai. Bisa langsung dihapus/diubah dari tab Data Sekolah.
      existing = [CONTOH_SEKOLAH]
      db.saveSchools(existing)
    }
    setSchools(existing)
    setDocs(db.getSuratJalanList())
  }, [])

  function handleSaveSchool(school) {
    const next = db.upsertSchool(school)
    setSchools(next)
  }

  function handleDeleteSchool(id) {
    const next = db.deleteSchool(id)
    setSchools(next)
  }

  function handleSaveDoc(doc) {
    const next = db.upsertSuratJalan(doc)
    setDocs(next)
    setEditingDoc(null)
    setTab('daftar')
  }

  function handleEditDoc(doc) {
    setEditingDoc(doc)
    setTab('buat')
  }

  function handleDeleteDoc(id) {
    const next = db.deleteSuratJalan(id)
    setDocs(next)
  }

  function handleSaveSppg(info) {
    db.saveSppgInfo(info)
    setSppg(info)
  }

  function handleExport() {
    const data = db.exportAllData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cadangan-surat-jalan-${data.exportedAt.slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImport(data) {
    db.importAllData(data)
    setSchools(db.getSchools())
    setDocs(db.getSuratJalanList())
    setSppg(db.getSppgInfo())
  }

  if (printIds) {
    const selectedDocs = printIds
      .map((id) => docs.find((d) => d.id === id))
      .filter(Boolean)
    return (
      <PrintView
        docs={selectedDocs}
        schools={schools}
        sppg={sppg}
        onBack={() => setPrintIds(null)}
      />
    )
  }

  return (
    <div className="app-shell">
      <header className="app-header no-print">
        <img src="./logo-seal-bw.png" alt="Logo" className="app-logo" />
        <div>
          <h1>Surat Jalan MBG</h1>
          <div className="hint">Program Makan Bergizi Gratis</div>
        </div>
      </header>

      <nav className="tabs no-print">
        <button className={tab === 'buat' ? 'active' : ''} onClick={() => setTab('buat')}>
          Buat Surat Jalan
        </button>
        <button className={tab === 'daftar' ? 'active' : ''} onClick={() => setTab('daftar')}>
          Daftar Surat Jalan
        </button>
        <button className={tab === 'sekolah' ? 'active' : ''} onClick={() => setTab('sekolah')}>
          Data Sekolah
        </button>
        <button
          className={tab === 'pengaturan' ? 'active' : ''}
          onClick={() => setTab('pengaturan')}
        >
          Pengaturan
        </button>
      </nav>

      <main className="app-main no-print">
        {tab === 'buat' && (
          <SuratJalanForm
            schools={schools}
            editingDoc={editingDoc}
            onSaved={handleSaveDoc}
            onCancelEdit={() => {
              setEditingDoc(null)
              setTab('daftar')
            }}
          />
        )}
        {tab === 'daftar' && (
          <SuratJalanList
            docs={docs}
            schools={schools}
            onEdit={handleEditDoc}
            onDelete={handleDeleteDoc}
            onPrint={(ids) => setPrintIds(ids)}
          />
        )}
        {tab === 'sekolah' && (
          <SchoolManager schools={schools} onSave={handleSaveSchool} onDelete={handleDeleteSchool} />
        )}
        {tab === 'pengaturan' && (
          <SppgSettings
            sppg={sppg}
            onSave={handleSaveSppg}
            onExport={handleExport}
            onImport={handleImport}
          />
        )}
      </main>
    </div>
  )
}
