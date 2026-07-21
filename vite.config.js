import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// PENTING: ganti 'mbg-surat-jalan' di bawah dengan nama repository GitHub kamu.
// Kalau repo-nya bernama misalnya "surat-jalan-mbg", maka base harus '/surat-jalan-mbg/'
// Kalau dideploy ke domain sendiri (bukan github.io/nama-repo), base bisa diganti '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
