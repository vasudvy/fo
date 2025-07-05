export const appIds = [
  "finder",
  "soundboard",
  "internet-explorer",
  "chats",
  "textedit",
  "paint",
  "photo-booth",
  "minesweeper",
  "videos",
  "ipod",
  "synth",
  "pc",
  "terminal",
  "control-panels",
  // New business applications for Founder's Office
  "excel",
  "mail",
  "government",
  "team",
  "airtable",
  "metabase",
  "superspot",
  "cultural",
  "captab",
] as const;

export type AppId = typeof appIds[number]; 