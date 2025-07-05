import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Excel functionality
export interface Cell {
  value: string | number | boolean | null;
  formula?: string;
  type: "text" | "number" | "boolean" | "date" | "formula";
  format?: CellFormat;
  validation?: CellValidation;
}

export interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  backgroundColor?: string;
  alignment?: "left" | "center" | "right";
  verticalAlignment?: "top" | "middle" | "bottom";
  border?: BorderStyle;
  numberFormat?: string;
}

export interface BorderStyle {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  color?: string;
  width?: number;
}

export interface CellValidation {
  type: "range" | "list" | "date" | "custom";
  criteria: any;
  errorMessage?: string;
}

export interface Worksheet {
  id: string;
  name: string;
  cells: { [key: string]: Cell }; // key format: "A1", "B2", etc.
  rowCount: number;
  columnCount: number;
  selectedRange?: CellRange;
  frozenRows?: number;
  frozenColumns?: number;
  filters?: { [column: string]: string[] };
  conditionalFormatting?: ConditionalFormat[];
  charts?: Chart[];
  pivotTables?: PivotTable[];
}

export interface CellRange {
  start: { row: number; col: number };
  end: { row: number; col: number };
}

export interface ConditionalFormat {
  id: string;
  range: CellRange;
  condition: FormatCondition;
  format: CellFormat;
}

export interface FormatCondition {
  type: "equal" | "greater" | "less" | "between" | "contains" | "custom";
  value: any;
  value2?: any;
  formula?: string;
}

export interface Chart {
  id: string;
  type: "line" | "bar" | "column" | "pie" | "scatter" | "area";
  title: string;
  dataRange: CellRange;
  position: { x: number; y: number };
  size: { width: number; height: number };
  options: ChartOptions;
}

export interface ChartOptions {
  showLegend?: boolean;
  showDataLabels?: boolean;
  colors?: string[];
  xAxisTitle?: string;
  yAxisTitle?: string;
  gridlines?: boolean;
}

export interface PivotTable {
  id: string;
  name: string;
  sourceRange: CellRange;
  rows: string[];
  columns: string[];
  values: PivotValue[];
  filters: string[];
  position: { row: number; col: number };
}

export interface PivotValue {
  field: string;
  aggregation: "sum" | "count" | "average" | "max" | "min";
}

export interface Workbook {
  id: string;
  name: string;
  worksheets: Worksheet[];
  activeWorksheetId: string;
  createdAt: Date;
  modifiedAt: Date;
  metadata?: {
    author?: string;
    description?: string;
    tags?: string[];
  };
}

export interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  mapping: { [key: string]: string };
  transformations?: DataTransformation[];
}

export interface DataTransformation {
  type: "format" | "calculate" | "filter" | "sort";
  column: string;
  operation: string;
  parameters?: any;
}

export interface ExcelStoreState {
  workbooks: { [id: string]: Workbook };
  activeWorkbookId: string | null;
  clipboard: {
    data: Cell[][];
    range: CellRange;
    operation: "copy" | "cut";
  } | null;
  formulaBar: {
    isEditing: boolean;
    currentFormula: string;
    selectedCell: string | null;
  };
  importTemplates: ImportTemplate[];
  recentFiles: string[];
  autoSaveEnabled: boolean;
  calculationMode: "automatic" | "manual";
  
  // Actions
  createWorkbook: (name: string) => string;
  deleteWorkbook: (id: string) => void;
  openWorkbook: (id: string) => void;
  saveWorkbook: (id: string) => Promise<void>;
  renameWorkbook: (id: string, name: string) => void;
  
  // Worksheet management
  createWorksheet: (workbookId: string, name: string) => string;
  deleteWorksheet: (workbookId: string, worksheetId: string) => void;
  renameWorksheet: (workbookId: string, worksheetId: string, name: string) => void;
  setActiveWorksheet: (workbookId: string, worksheetId: string) => void;
  
  // Cell operations
  setCellValue: (worksheetId: string, cellRef: string, value: any) => void;
  setCellFormula: (worksheetId: string, cellRef: string, formula: string) => void;
  setCellFormat: (worksheetId: string, cellRef: string, format: CellFormat) => void;
  clearCells: (worksheetId: string, range: CellRange) => void;
  
  // Selection and clipboard
  setSelectedRange: (worksheetId: string, range: CellRange) => void;
  copyCells: (worksheetId: string, range: CellRange) => void;
  pasteCells: (worksheetId: string, targetCell: string) => void;
  
  // Formula and calculation
  calculateWorksheet: (worksheetId: string) => void;
  setCalculationMode: (mode: "automatic" | "manual") => void;
  
  // Data import/export
  importData: (worksheetId: string, data: any[][], startCell: string) => void;
  exportWorkbook: (workbookId: string, format: "xlsx" | "csv" | "json") => Promise<Blob>;
  createImportTemplate: (template: ImportTemplate) => void;
  
  // Charts and visualization
  createChart: (worksheetId: string, chart: Omit<Chart, "id">) => string;
  updateChart: (worksheetId: string, chartId: string, updates: Partial<Chart>) => void;
  deleteChart: (worksheetId: string, chartId: string) => void;
  
  // Pivot tables
  createPivotTable: (worksheetId: string, pivotTable: Omit<PivotTable, "id">) => string;
  updatePivotTable: (worksheetId: string, pivotTableId: string, updates: Partial<PivotTable>) => void;
  deletePivotTable: (worksheetId: string, pivotTableId: string) => void;
  
  // Collaboration
  shareWorkbook: (workbookId: string, permissions: SharePermission[]) => Promise<string>;
  getWorkbookHistory: (workbookId: string) => Promise<HistoryEntry[]>;
  
  // Settings
  setAutoSave: (enabled: boolean) => void;
  addRecentFile: (workbookId: string) => void;
}

export interface SharePermission {
  userId: string;
  email: string;
  role: "view" | "edit" | "admin";
}

export interface HistoryEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details: any;
}

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const createEmptyWorksheet = (name: string): Worksheet => ({
  id: generateId(),
  name,
  cells: {},
  rowCount: 1000,
  columnCount: 26,
  conditionalFormatting: [],
  charts: [],
  pivotTables: [],
});

const createEmptyWorkbook = (name: string): Workbook => ({
  id: generateId(),
  name,
  worksheets: [createEmptyWorksheet("Sheet1")],
  activeWorksheetId: "",
  createdAt: new Date(),
  modifiedAt: new Date(),
});

// Cell reference utilities
const columnToIndex = (col: string): number => {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 64);
  }
  return result - 1;
};

const indexToColumn = (index: number): string => {
  let result = "";
  index += 1;
  while (index > 0) {
    index--;
    result = String.fromCharCode(65 + (index % 26)) + result;
    index = Math.floor(index / 26);
  }
  return result;
};

const parseCellRef = (cellRef: string): { row: number; col: number } => {
  const match = cellRef.match(/([A-Z]+)(\d+)/);
  if (!match) throw new Error(`Invalid cell reference: ${cellRef}`);
  return {
    col: columnToIndex(match[1]),
    row: parseInt(match[2]) - 1,
  };
};

const formatCellRef = (row: number, col: number): string => {
  return `${indexToColumn(col)}${row + 1}`;
};

// Formula calculation engine (simplified)
const calculateFormula = (formula: string, cells: { [key: string]: Cell }): any => {
  // This is a simplified formula engine
  // In a real implementation, you'd want a proper parser and evaluator
  if (formula.startsWith("=")) {
    const expression = formula.slice(1);
    
    // Handle basic functions
    if (expression.startsWith("SUM(")) {
      const range = expression.slice(4, -1);
      return calculateSum(range, cells);
    }
    
    if (expression.startsWith("AVERAGE(")) {
      const range = expression.slice(8, -1);
      return calculateAverage(range, cells);
    }
    
    // Handle cell references
    const cellRefMatch = expression.match(/[A-Z]+\d+/g);
    if (cellRefMatch) {
      let result = expression;
      cellRefMatch.forEach(ref => {
        const cell = cells[ref];
        const value = cell?.value || 0;
        result = result.replace(ref, value.toString());
      });
      
      try {
        return eval(result);
      } catch (e) {
        return "#ERROR!";
      }
    }
  }
  
  return formula;
};

const calculateSum = (range: string, cells: { [key: string]: Cell }): number => {
  const cellRefs = expandRange(range);
  return cellRefs.reduce((sum, ref) => {
    const cell = cells[ref];
    const value = cell?.value;
    return sum + (typeof value === "number" ? value : 0);
  }, 0);
};

const calculateAverage = (range: string, cells: { [key: string]: Cell }): number => {
  const cellRefs = expandRange(range);
  const values = cellRefs.map(ref => {
    const cell = cells[ref];
    const value = cell?.value;
    return typeof value === "number" ? value : 0;
  }).filter(v => v !== 0);
  
  return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
};

const expandRange = (range: string): string[] => {
  if (range.includes(":")) {
    const [start, end] = range.split(":");
    const startPos = parseCellRef(start);
    const endPos = parseCellRef(end);
    
    const refs: string[] = [];
    for (let row = startPos.row; row <= endPos.row; row++) {
      for (let col = startPos.col; col <= endPos.col; col++) {
        refs.push(formatCellRef(row, col));
      }
    }
    return refs;
  }
  return [range];
};

export const useExcelStore = create<ExcelStoreState>()(
  persist(
    (set, get) => ({
      workbooks: {},
      activeWorkbookId: null,
      clipboard: null,
      formulaBar: {
        isEditing: false,
        currentFormula: "",
        selectedCell: null,
      },
      importTemplates: [],
      recentFiles: [],
      autoSaveEnabled: true,
      calculationMode: "automatic",

      createWorkbook: (name: string) => {
        const workbook = createEmptyWorkbook(name);
        workbook.activeWorksheetId = workbook.worksheets[0].id;
        
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [workbook.id]: workbook,
          },
          activeWorkbookId: workbook.id,
        }));
        
        return workbook.id;
      },

      deleteWorkbook: (id: string) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.workbooks;
          return {
            workbooks: remaining,
            activeWorkbookId: state.activeWorkbookId === id ? null : state.activeWorkbookId,
          };
        });
      },

      openWorkbook: (id: string) => {
        set({ activeWorkbookId: id });
        get().addRecentFile(id);
      },

      saveWorkbook: async (id: string) => {
        const workbook = get().workbooks[id];
        if (!workbook) return;
        
        // Update modified timestamp
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [id]: {
              ...workbook,
              modifiedAt: new Date(),
            },
          },
        }));
        
        // In a real implementation, you'd save to a backend or local storage
        console.log("Saving workbook:", workbook.name);
      },

      renameWorkbook: (id: string, name: string) => {
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [id]: {
              ...state.workbooks[id],
              name,
              modifiedAt: new Date(),
            },
          },
        }));
      },

      createWorksheet: (workbookId: string, name: string) => {
        const worksheet = createEmptyWorksheet(name);
        
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [workbookId]: {
              ...state.workbooks[workbookId],
              worksheets: [...state.workbooks[workbookId].worksheets, worksheet],
              modifiedAt: new Date(),
            },
          },
        }));
        
        return worksheet.id;
      },

      deleteWorksheet: (workbookId: string, worksheetId: string) => {
        set((state) => {
          const workbook = state.workbooks[workbookId];
          const updatedWorksheets = workbook.worksheets.filter(ws => ws.id !== worksheetId);
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbookId]: {
                ...workbook,
                worksheets: updatedWorksheets,
                activeWorksheetId: workbook.activeWorksheetId === worksheetId 
                  ? updatedWorksheets[0]?.id || ""
                  : workbook.activeWorksheetId,
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      renameWorksheet: (workbookId: string, worksheetId: string, name: string) => {
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [workbookId]: {
              ...state.workbooks[workbookId],
              worksheets: state.workbooks[workbookId].worksheets.map(ws =>
                ws.id === worksheetId ? { ...ws, name } : ws
              ),
              modifiedAt: new Date(),
            },
          },
        }));
      },

      setActiveWorksheet: (workbookId: string, worksheetId: string) => {
        set((state) => ({
          workbooks: {
            ...state.workbooks,
            [workbookId]: {
              ...state.workbooks[workbookId],
              activeWorksheetId: worksheetId,
            },
          },
        }));
      },

      setCellValue: (worksheetId: string, cellRef: string, value: any) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
          if (!worksheet) return state;
          
          const cell: Cell = worksheet.cells[cellRef] || {
            value: null,
            type: "text",
          };
          
          // Determine cell type
          let cellType: Cell["type"] = "text";
          if (typeof value === "number") {
            cellType = "number";
          } else if (typeof value === "boolean") {
            cellType = "boolean";
          } else if (typeof value === "string" && value.startsWith("=")) {
            cellType = "formula";
          }
          
          const updatedCell: Cell = {
            ...cell,
            value: cellType === "formula" ? calculateFormula(value, worksheet.cells) : value,
            formula: cellType === "formula" ? value : undefined,
            type: cellType,
          };
          
          const updatedWorksheet = {
            ...worksheet,
            cells: {
              ...worksheet.cells,
              [cellRef]: updatedCell,
            },
          };
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId ? updatedWorksheet : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
        
        // Recalculate if in automatic mode
        if (get().calculationMode === "automatic") {
          get().calculateWorksheet(worksheetId);
        }
      },

      setCellFormula: (worksheetId: string, cellRef: string, formula: string) => {
        get().setCellValue(worksheetId, cellRef, formula);
      },

      setCellFormat: (worksheetId: string, cellRef: string, format: CellFormat) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
          if (!worksheet) return state;
          
          const cell: Cell = worksheet.cells[cellRef] || {
            value: null,
            type: "text",
          };
          
          const updatedCell: Cell = {
            ...cell,
            format: { ...cell.format, ...format },
          };
          
          const updatedWorksheet = {
            ...worksheet,
            cells: {
              ...worksheet.cells,
              [cellRef]: updatedCell,
            },
          };
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId ? updatedWorksheet : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      clearCells: (worksheetId: string, range: CellRange) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
          if (!worksheet) return state;
          
          const updatedCells = { ...worksheet.cells };
          
          for (let row = range.start.row; row <= range.end.row; row++) {
            for (let col = range.start.col; col <= range.end.col; col++) {
              const cellRef = formatCellRef(row, col);
              delete updatedCells[cellRef];
            }
          }
          
          const updatedWorksheet = {
            ...worksheet,
            cells: updatedCells,
          };
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId ? updatedWorksheet : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      setSelectedRange: (worksheetId: string, range: CellRange) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId ? { ...ws, selectedRange: range } : ws
                ),
              },
            },
          };
        });
      },

      copyCells: (worksheetId: string, range: CellRange) => {
        const workbook = Object.values(get().workbooks).find(wb =>
          wb.worksheets.some(ws => ws.id === worksheetId)
        );
        
        if (!workbook) return;
        
        const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
        if (!worksheet) return;
        
        const data: Cell[][] = [];
        for (let row = range.start.row; row <= range.end.row; row++) {
          const rowData: Cell[] = [];
          for (let col = range.start.col; col <= range.end.col; col++) {
            const cellRef = formatCellRef(row, col);
            const cell = worksheet.cells[cellRef];
            rowData.push(cell || { value: null, type: "text" });
          }
          data.push(rowData);
        }
        
        set({ clipboard: { data, range, operation: "copy" } });
      },

      pasteCells: (worksheetId: string, targetCell: string) => {
        const { clipboard } = get();
        if (!clipboard) return;
        
        const targetPos = parseCellRef(targetCell);
        
        clipboard.data.forEach((row, rowIndex) => {
          row.forEach((cell, colIndex) => {
            const cellRef = formatCellRef(
              targetPos.row + rowIndex,
              targetPos.col + colIndex
            );
            
            get().setCellValue(worksheetId, cellRef, cell.value);
            if (cell.format) {
              get().setCellFormat(worksheetId, cellRef, cell.format);
            }
          });
        });
      },

      calculateWorksheet: (worksheetId: string) => {
        // Recalculate all formulas in the worksheet
        const workbook = Object.values(get().workbooks).find(wb =>
          wb.worksheets.some(ws => ws.id === worksheetId)
        );
        
        if (!workbook) return;
        
        const worksheet = workbook.worksheets.find(ws => ws.id === worksheetId);
        if (!worksheet) return;
        
        // This is a simplified calculation - in reality, you'd need dependency tracking
        Object.entries(worksheet.cells).forEach(([cellRef, cell]) => {
          if (cell.formula) {
            const newValue = calculateFormula(cell.formula, worksheet.cells);
            get().setCellValue(worksheetId, cellRef, newValue);
          }
        });
      },

      setCalculationMode: (mode: "automatic" | "manual") => {
        set({ calculationMode: mode });
      },

      importData: (worksheetId: string, data: any[][], startCell: string) => {
        const startPos = parseCellRef(startCell);
        
        data.forEach((row, rowIndex) => {
          row.forEach((value, colIndex) => {
            const cellRef = formatCellRef(
              startPos.row + rowIndex,
              startPos.col + colIndex
            );
            get().setCellValue(worksheetId, cellRef, value);
          });
        });
      },

      exportWorkbook: async (workbookId: string, format: "xlsx" | "csv" | "json") => {
        const workbook = get().workbooks[workbookId];
        if (!workbook) throw new Error("Workbook not found");
        
        // This is a simplified export - in reality, you'd use libraries like xlsx.js
        const data = JSON.stringify(workbook);
        return new Blob([data], { type: "application/json" });
      },

      createImportTemplate: (template: ImportTemplate) => {
        set((state) => ({
          importTemplates: [...state.importTemplates, template],
        }));
      },

      createChart: (worksheetId: string, chart: Omit<Chart, "id">) => {
        const chartId = generateId();
        const newChart: Chart = { ...chart, id: chartId };
        
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? { ...ws, charts: [...ws.charts, newChart] }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
        
        return chartId;
      },

      updateChart: (worksheetId: string, chartId: string, updates: Partial<Chart>) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? {
                        ...ws,
                        charts: ws.charts.map(chart =>
                          chart.id === chartId ? { ...chart, ...updates } : chart
                        ),
                      }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      deleteChart: (worksheetId: string, chartId: string) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? { ...ws, charts: ws.charts.filter(chart => chart.id !== chartId) }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      createPivotTable: (worksheetId: string, pivotTable: Omit<PivotTable, "id">) => {
        const pivotTableId = generateId();
        const newPivotTable: PivotTable = { ...pivotTable, id: pivotTableId };
        
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? { ...ws, pivotTables: [...ws.pivotTables, newPivotTable] }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
        
        return pivotTableId;
      },

      updatePivotTable: (worksheetId: string, pivotTableId: string, updates: Partial<PivotTable>) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? {
                        ...ws,
                        pivotTables: ws.pivotTables.map(pt =>
                          pt.id === pivotTableId ? { ...pt, ...updates } : pt
                        ),
                      }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      deletePivotTable: (worksheetId: string, pivotTableId: string) => {
        set((state) => {
          const workbook = Object.values(state.workbooks).find(wb =>
            wb.worksheets.some(ws => ws.id === worksheetId)
          );
          
          if (!workbook) return state;
          
          return {
            workbooks: {
              ...state.workbooks,
              [workbook.id]: {
                ...workbook,
                worksheets: workbook.worksheets.map(ws =>
                  ws.id === worksheetId 
                    ? { ...ws, pivotTables: ws.pivotTables.filter(pt => pt.id !== pivotTableId) }
                    : ws
                ),
                modifiedAt: new Date(),
              },
            },
          };
        });
      },

      shareWorkbook: async (workbookId: string, permissions: SharePermission[]) => {
        // In a real implementation, this would make an API call
        console.log("Sharing workbook:", workbookId, "with permissions:", permissions);
        return `https://fo.office/shared/${workbookId}`;
      },

      getWorkbookHistory: async (workbookId: string) => {
        // In a real implementation, this would fetch from backend
        return [] as HistoryEntry[];
      },

      setAutoSave: (enabled: boolean) => {
        set({ autoSaveEnabled: enabled });
      },

      addRecentFile: (workbookId: string) => {
        set((state) => ({
          recentFiles: [
            workbookId,
            ...state.recentFiles.filter(id => id !== workbookId)
          ].slice(0, 10), // Keep only last 10
        }));
      },
    }),
    {
      name: "excel-store",
      version: 1,
    }
  )
);