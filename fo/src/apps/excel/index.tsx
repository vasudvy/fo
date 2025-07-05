import { BaseApp } from "../base/types";
import { ExcelAppComponent } from "./components/ExcelAppComponent";

export const helpItems = [
  {
    icon: "📊",
    title: "Spreadsheet Management",
    description: "Create and manage complex spreadsheets with formulas and functions",
  },
  {
    icon: "📈",
    title: "Charts & Visualization",
    description: "Generate charts, graphs and visual representations of your data",
  },
  {
    icon: "🔄",
    title: "Data Import/Export",
    description: "Import from CSV, JSON and export to multiple formats",
  },
  {
    icon: "⚡",
    title: "Formulas & Functions",
    description: "Use advanced formulas and functions for calculations",
  },
  {
    icon: "🗂️",
    title: "Pivot Tables",
    description: "Create pivot tables for advanced data analysis",
  },
];

export const appMetadata = {
  name: "Excel",
  version: "1.0",
  creator: {
    name: "Founder's Office",
    url: "https://fo.office",
  },
  github: "https://github.com/fo/office",
  icon: "/icons/excel.png",
};

export const ExcelApp: BaseApp = {
  id: "excel",
  name: "Excel",
  icon: { type: "image", src: appMetadata.icon },
  description: "Advanced spreadsheet application for data analysis",
  component: ExcelAppComponent,
  helpItems,
  metadata: appMetadata,
};