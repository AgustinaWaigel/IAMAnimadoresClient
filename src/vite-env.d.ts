/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_VAPID_KEY: string;
  readonly VITE_GOOGLE_CALENDAR_ID?: string;
  readonly VITE_GOOGLE_CALENDAR_TZ?: string;
  readonly VITE_GOOGLE_CALENDAR_ICS_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
