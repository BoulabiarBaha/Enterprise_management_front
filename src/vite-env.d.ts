/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENV: string
  // Ajoutez d'autres variables d'environnement ici si nécessaire
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}