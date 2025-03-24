import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ecocoin-vite-faucet/', // 👈 this must match your repo name
  plugins: [react()],
})
