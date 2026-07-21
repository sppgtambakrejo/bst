import React from 'react'
import { hariIndonesia, tanggalIndonesia, sumPorsi } from '../utils.js'

export default function PrintView({ docs, schools, sppg, onBack }) {
  const schoolName = (id) => schools.find((s) => s.id === id)?.nama || ''

  return (
    <div className="print-wrapper">
      <div className="print-toolbar no-print">
        <button type="button" className="btn-plain" onClick={onBack}>
          ← Kembali
        </button>
        <button type="button" className="btn-primary" onClick={() => window.print()}>
          🖨 Cetak Sekarang
        </button>
        <span className="hint">{docs.length} surat jalan siap dicetak</span>
      </div>

      {docs.map((doc, i) => (
        <section className="print-page" key={doc.id}>
          <header className="print-header">
            <img src="./logo-seal-bw.png" alt="Logo Badan Gizi Nasional" className="print-logo" />
            <div className="print-header-text">
              <div className="print-title">SURAT JALAN</div>
              <div className="print-subtitle">PROGRAM MAKAN BERGIZI GRATIS</div>
              <div className="print-subtitle">{sppg.namaSppg}</div>
            </div>
          </header>

          <table className="print-meta-table">
            <tbody>
              <tr>
                <td className="meta-label">Kepada</td>
                <td className="meta-colon">:</td>
                <td className="meta-value">
                  <strong>{schoolName(doc.sekolahId)}</strong>
                </td>
                <td className="meta-label">Hari, Tanggal</td>
                <td className="meta-colon">:</td>
                <td className="meta-value">
                  {hariIndonesia(doc.tanggal)}, {tanggalIndonesia(doc.tanggal)}
                </td>
              </tr>
              <tr>
                <td className="meta-label"></td>
                <td className="meta-colon"></td>
                <td className="meta-value"></td>
                <td className="meta-label">Waktu Pengiriman</td>
                <td className="meta-colon">:</td>
                <td className="meta-value">{doc.waktuPengiriman || ''}</td>
              </tr>
              <tr>
                <td className="meta-label"></td>
                <td className="meta-colon"></td>
                <td className="meta-value"></td>
                <td className="meta-label">Driver</td>
                <td className="meta-colon">:</td>
                <td className="meta-value">{doc.driver || ''}</td>
              </tr>
            </tbody>
          </table>

          <table className="print-main-table">
            <thead>
              <tr>
                <th rowSpan={2}>No.</th>
                <th rowSpan={2}>Kelas</th>
                <th rowSpan={2}>Jumlah Porsi</th>
                <th colSpan={2}>Jumlah Alat Makan</th>
                <th rowSpan={2}>Keterangan</th>
              </tr>
              <tr>
                <th>Sebelum</th>
                <th>Sesudah</th>
              </tr>
            </thead>
            <tbody>
              {doc.rows.map((r, idx) => (
                <tr key={r.id}>
                  <td className="col-no">{idx + 1}</td>
                  <td>{r.kelas}</td>
                  <td className="col-num">{r.jumlahPorsi}</td>
                  <td>{r.alatSebelum}</td>
                  <td>{r.alatSesudah}</td>
                  <td>{r.keterangan}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="total-label">
                  Total
                </td>
                <td className="col-num total-value">{sumPorsi(doc.rows)}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <table className="print-signature-table">
            <tbody>
              <tr>
                <td className="sig-col">Diperiksa oleh,</td>
                <td className="sig-col">Diterima Oleh,</td>
                <td className="sig-col"></td>
              </tr>
              <tr className="sig-role-row">
                <td className="sig-col">Ahli Gizi,</td>
                <td className="sig-col">Koordinator Lapangan,</td>
                <td className="sig-col">Pihak Sekolah,</td>
              </tr>
              <tr className="sig-space-row">
                <td className="sig-col"></td>
                <td className="sig-col"></td>
                <td className="sig-col"></td>
              </tr>
              <tr>
                <td className="sig-col sig-name">{sppg.ahliGizi}</td>
                <td className="sig-col sig-name">{sppg.koordinatorLapangan}</td>
                <td className="sig-col sig-name">......................................</td>
              </tr>
            </tbody>
          </table>

          <table className="print-signature-table print-signature-bottom">
            <tbody>
              <tr>
                <td className="sig-col">Tim Distribusi,</td>
              </tr>
              <tr className="sig-space-row">
                <td className="sig-col"></td>
              </tr>
              <tr>
                <td className="sig-col sig-name">......................................</td>
              </tr>
            </tbody>
          </table>
        </section>
      ))}
    </div>
  )
}
