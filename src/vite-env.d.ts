/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_JD2CV_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
