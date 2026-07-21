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

      {docs.map((doc) => (
        <section className="print-page" key={doc.id}>
          <header className="print-header">
            <img src="./logo-full-bw.png" alt="Logo Badan Gizi Nasional" className="print-logo" />
            <div className="print-header-text">
              <div className="print-title">SURAT JALAN</div>
              <div className="print-title">PROGRAM MAKAN BERGIZI GRATIS</div>
              <div className="print-title">{sppg.namaSppg}</div>
            </div>
          </header>

          <table className="print-meta-table">
            <colgroup>
              <col style={{ width: '10.6%' }} />
              <col style={{ width: '37.8%' }} />
              <col style={{ width: '22.7%' }} />
              <col style={{ width: '28.9%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="meta-label">Kepada</td>
                <td className="meta-value">
                  <strong>: {schoolName(doc.sekolahId)}</strong>
                </td>
                <td className="meta-label">Hari, Tanggal</td>
                <td className="meta-value">
                  : {hariIndonesia(doc.tanggal)}, {tanggalIndonesia(doc.tanggal)}
                </td>
              </tr>
              <tr>
                <td className="meta-label"></td>
                <td className="meta-value"></td>
                <td className="meta-label"></td>
                <td className="meta-value"></td>
              </tr>
              <tr>
                <td className="meta-label"></td>
                <td className="meta-value"></td>
                <td className="meta-label">Waktu Pengiriman</td>
                <td className="meta-value">: {doc.waktuPengiriman || ''}</td>
              </tr>
              <tr>
                <td className="meta-label"></td>
                <td className="meta-value"></td>
                <td className="meta-label">Driver</td>
                <td className="meta-value">: {doc.driver || ''}</td>
              </tr>
            </tbody>
          </table>

          <table className="print-main-table">
            <colgroup>
              <col style={{ width: '6.3%' }} />
              <col style={{ width: '16.6%' }} />
              <col style={{ width: '12.3%' }} />
              <col style={{ width: '20.3%' }} />
              <col style={{ width: '15.5%' }} />
              <col style={{ width: '28.9%' }} />
            </colgroup>
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
                  <td>{idx + 1}</td>
                  <td>{r.kelas}</td>
                  <td>{r.jumlahPorsi}</td>
                  <td>{r.alatSebelum}</td>
                  <td>{r.alatSesudah}</td>
                  <td>{r.keterangan}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={2} className="total-label">
                  Total
                </td>
                <td className="total-value">{sumPorsi(doc.rows)}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>

          <table className="print-signature-table">
            <colgroup>
              <col style={{ width: '37.3%' }} />
              <col style={{ width: '32.4%' }} />
              <col style={{ width: '30.3%' }} />
            </colgroup>
            <tbody>
              <tr>
                <td className="sig-col" colSpan={2}>
                  Diperiksa oleh,
                </td>
                <td className="sig-col">Diterima Oleh,</td>
              </tr>
              <tr>
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

          <div className="tim-distribusi-wrap">
            <table className="print-tim-distribusi">
              <tbody>
                <tr>
                  <td>Tim Distribusi,</td>
                </tr>
                <tr className="sig-space-row">
                  <td></td>
                </tr>
                <tr>
                  <td className="sig-name-center">......................................</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
