import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Airtable functionality
export interface Base {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  tables: Table[];
  collaborators: Collaborator[];
  permissions: BasePermission;
  createdAt: Date;
  updatedAt: Date;
  isShared: boolean;
  templates: Template[];
}

export interface Table {
  id: string;
  baseId: string;
  name: string;
  description: string;
  primaryFieldId: string;
  fields: Field[];
  records: Record[];
  views: View[];
  forms: Form[];
  automations: Automation[];
  createdAt: Date;
  updatedAt: Date;
  recordCount: number;
}

export interface Field {
  id: string;
  name: string;
  type: FieldType;
  options: FieldOptions;
  description?: string;
  isRequired: boolean;
  isPrimary: boolean;
  order: number;
}

export type FieldType = 
  | "singleLineText"
  | "longText"
  | "richText"
  | "singleSelect"
  | "multipleSelect"
  | "number"
  | "currency"
  | "percent"
  | "date"
  | "dateTime"
  | "duration"
  | "phone"
  | "email"
  | "url"
  | "checkbox"
  | "rating"
  | "attachment"
  | "multipleRecordLinks"
  | "lookup"
  | "formula"
  | "rollup"
  | "count"
  | "createdTime"
  | "createdBy"
  | "lastModifiedTime"
  | "lastModifiedBy"
  | "barcode"
  | "button";

export interface FieldOptions {
  choices?: { id: string; name: string; color?: string }[];
  linkedTableId?: string;
  formula?: string;
  format?: string;
  precision?: number;
  symbol?: string;
  dateFormat?: string;
  timeFormat?: string;
  max?: number;
  min?: number;
  isReversed?: boolean;
  color?: string;
  icon?: string;
  validationRules?: ValidationRule[];
}

export interface ValidationRule {
  type: "required" | "unique" | "regex" | "range" | "custom";
  value?: any;
  message?: string;
}

export interface Record {
  id: string;
  fields: { [fieldId: string]: any };
  createdTime: Date;
  createdBy: string;
  lastModifiedTime: Date;
  lastModifiedBy: string;
  commentCount: number;
}

export interface View {
  id: string;
  name: string;
  type: "grid" | "form" | "calendar" | "gallery" | "kanban" | "timeline" | "gantt";
  visibleFields: string[];
  fieldOrder: string[];
  filterGroups: FilterGroup[];
  sortFields: SortField[];
  groupFields: GroupField[];
  colorBy?: string;
  configuration: ViewConfiguration;
}

export interface FilterGroup {
  combinator: "and" | "or";
  conditions: FilterCondition[];
}

export interface FilterCondition {
  fieldId: string;
  operator: FilterOperator;
  value: any;
}

export type FilterOperator = 
  | "is" | "isNot" | "isEmpty" | "isNotEmpty" 
  | "contains" | "doesNotContain" 
  | "greaterThan" | "lessThan" | "greaterThanOrEqual" | "lessThanOrEqual"
  | "isAfter" | "isBefore" | "isOnOrAfter" | "isOnOrBefore"
  | "isWithin" | "isExactly" | "isAnyOf" | "isNoneOf";

export interface SortField {
  fieldId: string;
  direction: "asc" | "desc";
}

export interface GroupField {
  fieldId: string;
  hideEmpty: boolean;
}

export interface ViewConfiguration {
  recordColorMode?: "byView" | "byField";
  cardCoverField?: string;
  cardPreviewFields?: string[];
  stackByField?: string;
  stackOrder?: string[];
  timelineSettings?: TimelineSettings;
  ganttSettings?: GanttSettings;
}

export interface TimelineSettings {
  startDateField: string;
  endDateField?: string;
  colorField?: string;
  titleField?: string;
}

export interface GanttSettings {
  startDateField: string;
  endDateField: string;
  durationField?: string;
  progressField?: string;
  dependencyField?: string;
}

export interface Form {
  id: string;
  tableId: string;
  name: string;
  description: string;
  isPublic: boolean;
  allowMultipleSubmissions: boolean;
  fields: FormField[];
  styling: FormStyling;
  submissions: FormSubmission[];
  createdAt: Date;
  updatedAt: Date;
  submitRedirect?: string;
  submitMessage?: string;
}

export interface FormField {
  fieldId: string;
  label: string;
  helpText?: string;
  isRequired: boolean;
  isVisible: boolean;
  order: number;
  validation?: ValidationRule[];
}

export interface FormStyling {
  theme: "default" | "minimal" | "colorful";
  primaryColor: string;
  backgroundColor: string;
  font: string;
  logo?: string;
  coverImage?: string;
}

export interface FormSubmission {
  id: string;
  recordId: string;
  submittedAt: Date;
  submitterInfo?: {
    ip?: string;
    userAgent?: string;
    referrer?: string;
  };
}

export interface Automation {
  id: string;
  tableId: string;
  name: string;
  description: string;
  isActive: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  runHistory: AutomationRun[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AutomationTrigger {
  type: "recordCreated" | "recordUpdated" | "fieldChanged" | "formSubmitted" | "scheduled" | "webhook";
  configuration: any;
  conditions?: FilterCondition[];
}

export interface AutomationAction {
  id: string;
  type: "createRecord" | "updateRecord" | "deleteRecord" | "sendEmail" | "sendSlack" | "webhook" | "script";
  configuration: any;
  order: number;
}

export interface AutomationRun {
  id: string;
  startedAt: Date;
  completedAt?: Date;
  status: "running" | "success" | "failed" | "cancelled";
  error?: string;
  logs: string[];
}

export interface Collaborator {
  id: string;
  email: string;
  name: string;
  role: "owner" | "creator" | "editor" | "commenter" | "readOnly";
  permissions: string[];
  invitedAt: Date;
  lastActive?: Date;
}

export interface BasePermission {
  allowAddingRecords: boolean;
  allowDeletingRecords: boolean;
  allowCreatingFields: boolean;
  allowDeletingFields: boolean;
  allowCreatingTables: boolean;
  allowDeletingTables: boolean;
  allowInvitingCollaborators: boolean;
  allowExporting: boolean;
  allowSyncing: boolean;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tables: Partial<Table>[];
  isPublic: boolean;
  usageCount: number;
  tags: string[];
}

export interface AirtableStoreState {
  // Data
  bases: { [id: string]: Base };
  templates: { [id: string]: Template };
  
  // Current state
  activeBaseId: string | null;
  activeTableId: string | null;
  activeViewId: string | null;
  selectedRecordIds: string[];
  
  // UI state
  currentView: "grid" | "form" | "calendar" | "gallery" | "kanban" | "timeline" | "gantt";
  sidebarOpen: boolean;
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  
  // Form builder
  formBuilder: {
    isOpen: boolean;
    formId: string | null;
    previewMode: boolean;
  };
  
  // Automation builder
  automationBuilder: {
    isOpen: boolean;
    automationId: string | null;
    testMode: boolean;
  };
  
  // Actions - Bases
  createBase: (base: Omit<Base, "id" | "createdAt" | "updatedAt">) => string;
  updateBase: (id: string, updates: Partial<Base>) => void;
  deleteBase: (id: string) => void;
  duplicateBase: (id: string) => string;
  shareBase: (id: string, collaborators: Collaborator[]) => void;
  
  // Actions - Tables
  createTable: (baseId: string, table: Omit<Table, "id" | "baseId" | "createdAt" | "updatedAt">) => string;
  updateTable: (id: string, updates: Partial<Table>) => void;
  deleteTable: (id: string) => void;
  duplicateTable: (id: string) => string;
  
  // Actions - Fields
  createField: (tableId: string, field: Omit<Field, "id">) => string;
  updateField: (fieldId: string, updates: Partial<Field>) => void;
  deleteField: (fieldId: string) => void;
  reorderFields: (tableId: string, fieldIds: string[]) => void;
  
  // Actions - Records
  createRecord: (tableId: string, fields: { [fieldId: string]: any }) => string;
  updateRecord: (recordId: string, fields: { [fieldId: string]: any }) => void;
  deleteRecord: (recordId: string) => void;
  duplicateRecord: (recordId: string) => string;
  bulkUpdateRecords: (updates: { recordId: string; fields: { [fieldId: string]: any } }[]) => void;
  
  // Actions - Views
  createView: (tableId: string, view: Omit<View, "id">) => string;
  updateView: (viewId: string, updates: Partial<View>) => void;
  deleteView: (viewId: string) => void;
  duplicateView: (viewId: string) => string;
  
  // Actions - Forms
  createForm: (tableId: string, form: Omit<Form, "id" | "tableId" | "createdAt" | "updatedAt">) => string;
  updateForm: (formId: string, updates: Partial<Form>) => void;
  deleteForm: (formId: string) => void;
  submitForm: (formId: string, data: { [fieldId: string]: any }) => Promise<string>;
  
  // Actions - Automations
  createAutomation: (tableId: string, automation: Omit<Automation, "id" | "tableId" | "createdAt" | "updatedAt">) => string;
  updateAutomation: (automationId: string, updates: Partial<Automation>) => void;
  deleteAutomation: (automationId: string) => void;
  triggerAutomation: (automationId: string, context?: any) => Promise<void>;
  
  // Actions - UI
  setActiveBase: (baseId: string | null) => void;
  setActiveTable: (tableId: string | null) => void;
  setActiveView: (viewId: string | null) => void;
  setSelectedRecords: (recordIds: string[]) => void;
  setCurrentView: (view: AirtableStoreState["currentView"]) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Actions - Search
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Actions - Form Builder
  openFormBuilder: (formId?: string) => void;
  closeFormBuilder: () => void;
  setFormPreviewMode: (preview: boolean) => void;
  
  // Actions - Automation Builder
  openAutomationBuilder: (automationId?: string) => void;
  closeAutomationBuilder: () => void;
  setAutomationTestMode: (test: boolean) => void;
  
  // Actions - Import/Export
  importData: (tableId: string, data: any[], mapping: { [column: string]: string }) => Promise<void>;
  exportData: (tableId: string, format: "csv" | "json" | "excel") => Promise<Blob>;
  
  // Actions - Templates
  createTemplate: (baseId: string, template: Omit<Template, "id">) => string;
  useTemplate: (templateId: string) => string;
  shareTemplate: (templateId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useAirtableStore = create<AirtableStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      bases: {},
      templates: {},
      
      activeBaseId: null,
      activeTableId: null,
      activeViewId: null,
      selectedRecordIds: [],
      
      currentView: "grid",
      sidebarOpen: true,
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      
      formBuilder: {
        isOpen: false,
        formId: null,
        previewMode: false,
      },
      
      automationBuilder: {
        isOpen: false,
        automationId: null,
        testMode: false,
      },

      // Bases
      createBase: (base) => {
        const id = generateId();
        const newBase: Base = {
          ...base,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          bases: {
            ...state.bases,
            [id]: newBase,
          },
          activeBaseId: id,
        }));
        
        return id;
      },

      updateBase: (id, updates) => {
        set((state) => ({
          bases: {
            ...state.bases,
            [id]: {
              ...state.bases[id],
              ...updates,
              updatedAt: new Date(),
            },
          },
        }));
      },

      deleteBase: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.bases;
          return {
            bases: remaining,
            activeBaseId: state.activeBaseId === id ? null : state.activeBaseId,
          };
        });
      },

      duplicateBase: (id) => {
        const base = get().bases[id];
        if (!base) return "";
        
        const newId = generateId();
        const duplicatedBase: Base = {
          ...base,
          id: newId,
          name: `${base.name} (Copy)`,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          bases: {
            ...state.bases,
            [newId]: duplicatedBase,
          },
        }));
        
        return newId;
      },

      shareBase: (id, collaborators) => {
        get().updateBase(id, { collaborators, isShared: true });
      },

      // Tables
      createTable: (baseId, table) => {
        const id = generateId();
        const newTable: Table = {
          ...table,
          id,
          baseId,
          createdAt: new Date(),
          updatedAt: new Date(),
          recordCount: 0,
        };
        
        set((state) => ({
          bases: {
            ...state.bases,
            [baseId]: {
              ...state.bases[baseId],
              tables: [...state.bases[baseId].tables, newTable],
              updatedAt: new Date(),
            },
          },
          activeTableId: id,
        }));
        
        return id;
      },

      updateTable: (id, updates) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const tableIndex = base.tables.findIndex(t => t.id === id);
            if (tableIndex !== -1) {
              base.tables[tableIndex] = {
                ...base.tables[tableIndex],
                ...updates,
                updatedAt: new Date(),
              };
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
      },

      deleteTable: (id) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables = base.tables.filter(t => t.id !== id);
            base.updatedAt = new Date();
          });
          return {
            bases: updatedBases,
            activeTableId: state.activeTableId === id ? null : state.activeTableId,
          };
        });
      },

      duplicateTable: (id) => {
        // Implementation for duplicating a table
        console.log("Duplicating table:", id);
        return generateId();
      },

      // Fields
      createField: (tableId, field) => {
        const id = generateId();
        const newField: Field = { ...field, id };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const tableIndex = base.tables.findIndex(t => t.id === tableId);
            if (tableIndex !== -1) {
              base.tables[tableIndex].fields.push(newField);
              base.tables[tableIndex].updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
        
        return id;
      },

      updateField: (fieldId, updates) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const fieldIndex = table.fields.findIndex(f => f.id === fieldId);
              if (fieldIndex !== -1) {
                table.fields[fieldIndex] = { ...table.fields[fieldIndex], ...updates };
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      deleteField: (fieldId) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              table.fields = table.fields.filter(f => f.id !== fieldId);
              table.updatedAt = new Date();
            });
            base.updatedAt = new Date();
          });
          return { bases: updatedBases };
        });
      },

      reorderFields: (tableId, fieldIds) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const table = base.tables.find(t => t.id === tableId);
            if (table) {
              const reorderedFields = fieldIds.map(id => 
                table.fields.find(f => f.id === id)
              ).filter(Boolean) as Field[];
              table.fields = reorderedFields;
              table.updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
      },

      // Records
      createRecord: (tableId, fields) => {
        const id = generateId();
        const newRecord: Record = {
          id,
          fields,
          createdTime: new Date(),
          createdBy: "current-user",
          lastModifiedTime: new Date(),
          lastModifiedBy: "current-user",
          commentCount: 0,
        };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const table = base.tables.find(t => t.id === tableId);
            if (table) {
              table.records.push(newRecord);
              table.recordCount++;
              table.updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
        
        return id;
      },

      updateRecord: (recordId, fields) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const recordIndex = table.records.findIndex(r => r.id === recordId);
              if (recordIndex !== -1) {
                table.records[recordIndex] = {
                  ...table.records[recordIndex],
                  fields: { ...table.records[recordIndex].fields, ...fields },
                  lastModifiedTime: new Date(),
                  lastModifiedBy: "current-user",
                };
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      deleteRecord: (recordId) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const originalLength = table.records.length;
              table.records = table.records.filter(r => r.id !== recordId);
              if (table.records.length < originalLength) {
                table.recordCount--;
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      duplicateRecord: (recordId) => {
        // Implementation for duplicating a record
        console.log("Duplicating record:", recordId);
        return generateId();
      },

      bulkUpdateRecords: (updates) => {
        updates.forEach(({ recordId, fields }) => {
          get().updateRecord(recordId, fields);
        });
      },

      // Views
      createView: (tableId, view) => {
        const id = generateId();
        const newView: View = { ...view, id };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const table = base.tables.find(t => t.id === tableId);
            if (table) {
              table.views.push(newView);
              table.updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
        
        return id;
      },

      updateView: (viewId, updates) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const viewIndex = table.views.findIndex(v => v.id === viewId);
              if (viewIndex !== -1) {
                table.views[viewIndex] = { ...table.views[viewIndex], ...updates };
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      deleteView: (viewId) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              table.views = table.views.filter(v => v.id !== viewId);
              table.updatedAt = new Date();
            });
            base.updatedAt = new Date();
          });
          return { 
            bases: updatedBases,
            activeViewId: state.activeViewId === viewId ? null : state.activeViewId,
          };
        });
      },

      duplicateView: (viewId) => {
        console.log("Duplicating view:", viewId);
        return generateId();
      },

      // Forms
      createForm: (tableId, form) => {
        const id = generateId();
        const newForm: Form = {
          ...form,
          id,
          tableId,
          createdAt: new Date(),
          updatedAt: new Date(),
          submissions: [],
        };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const table = base.tables.find(t => t.id === tableId);
            if (table) {
              table.forms.push(newForm);
              table.updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
        
        return id;
      },

      updateForm: (formId, updates) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const formIndex = table.forms.findIndex(f => f.id === formId);
              if (formIndex !== -1) {
                table.forms[formIndex] = {
                  ...table.forms[formIndex],
                  ...updates,
                  updatedAt: new Date(),
                };
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      deleteForm: (formId) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              table.forms = table.forms.filter(f => f.id !== formId);
              table.updatedAt = new Date();
            });
            base.updatedAt = new Date();
          });
          return { bases: updatedBases };
        });
      },

      submitForm: async (formId, data) => {
        console.log("Submitting form:", formId, data);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new record with the form data
        // Find the table that has this form
        let tableId = "";
        Object.values(get().bases).forEach(base => {
          base.tables.forEach(table => {
            if (table.forms.some(form => form.id === formId)) {
              tableId = table.id;
            }
          });
        });
        
        if (tableId) {
          return get().createRecord(tableId, data);
        }
        
        return "";
      },

      // Automations
      createAutomation: (tableId, automation) => {
        const id = generateId();
        const newAutomation: Automation = {
          ...automation,
          id,
          tableId,
          createdAt: new Date(),
          updatedAt: new Date(),
          runHistory: [],
        };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            const table = base.tables.find(t => t.id === tableId);
            if (table) {
              table.automations.push(newAutomation);
              table.updatedAt = new Date();
              base.updatedAt = new Date();
            }
          });
          return { bases: updatedBases };
        });
        
        return id;
      },

      updateAutomation: (automationId, updates) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const automationIndex = table.automations.findIndex(a => a.id === automationId);
              if (automationIndex !== -1) {
                table.automations[automationIndex] = {
                  ...table.automations[automationIndex],
                  ...updates,
                  updatedAt: new Date(),
                };
                table.updatedAt = new Date();
                base.updatedAt = new Date();
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      deleteAutomation: (automationId) => {
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              table.automations = table.automations.filter(a => a.id !== automationId);
              table.updatedAt = new Date();
            });
            base.updatedAt = new Date();
          });
          return { bases: updatedBases };
        });
      },

      triggerAutomation: async (automationId, context) => {
        console.log("Triggering automation:", automationId, context);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add to run history
        const run: AutomationRun = {
          id: generateId(),
          startedAt: new Date(),
          completedAt: new Date(),
          status: "success",
          logs: ["Automation executed successfully"],
        };
        
        set((state) => {
          const updatedBases = { ...state.bases };
          Object.keys(updatedBases).forEach(baseId => {
            const base = updatedBases[baseId];
            base.tables.forEach(table => {
              const automation = table.automations.find(a => a.id === automationId);
              if (automation) {
                automation.runHistory.push(run);
              }
            });
          });
          return { bases: updatedBases };
        });
      },

      // UI actions
      setActiveBase: (baseId) => {
        set({ activeBaseId: baseId });
      },

      setActiveTable: (tableId) => {
        set({ activeTableId: tableId });
      },

      setActiveView: (viewId) => {
        set({ activeViewId: viewId });
      },

      setSelectedRecords: (recordIds) => {
        set({ selectedRecordIds: recordIds });
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      setSidebarOpen: (open) => {
        set({ sidebarOpen: open });
      },

      // Search
      search: async (query) => {
        set({ isSearching: true, searchQuery: query });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate search results
          const results = [
            { type: "record", content: "Search result 1" },
            { type: "table", content: "Search result 2" },
          ];
          
          set({ searchResults: results, isSearching: false });
        } catch (error) {
          set({ isSearching: false });
        }
      },

      clearSearch: () => {
        set({ searchQuery: "", searchResults: [], isSearching: false });
      },

      // Form Builder
      openFormBuilder: (formId) => {
        set((state) => ({
          formBuilder: {
            ...state.formBuilder,
            isOpen: true,
            formId: formId || null,
          },
        }));
      },

      closeFormBuilder: () => {
        set((state) => ({
          formBuilder: {
            ...state.formBuilder,
            isOpen: false,
            formId: null,
            previewMode: false,
          },
        }));
      },

      setFormPreviewMode: (preview) => {
        set((state) => ({
          formBuilder: {
            ...state.formBuilder,
            previewMode: preview,
          },
        }));
      },

      // Automation Builder
      openAutomationBuilder: (automationId) => {
        set((state) => ({
          automationBuilder: {
            ...state.automationBuilder,
            isOpen: true,
            automationId: automationId || null,
          },
        }));
      },

      closeAutomationBuilder: () => {
        set((state) => ({
          automationBuilder: {
            ...state.automationBuilder,
            isOpen: false,
            automationId: null,
            testMode: false,
          },
        }));
      },

      setAutomationTestMode: (test) => {
        set((state) => ({
          automationBuilder: {
            ...state.automationBuilder,
            testMode: test,
          },
        }));
      },

      // Import/Export
      importData: async (tableId, data, mapping) => {
        console.log("Importing data to table:", tableId);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Create records from imported data
        data.forEach(row => {
          const fields: { [fieldId: string]: any } = {};
          Object.entries(mapping).forEach(([column, fieldId]) => {
            fields[fieldId] = row[column];
          });
          get().createRecord(tableId, fields);
        });
      },

      exportData: async (tableId, format) => {
        console.log("Exporting data from table:", tableId, "format:", format);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get table data
        let tableData: any = null;
        Object.values(get().bases).forEach(base => {
          const table = base.tables.find(t => t.id === tableId);
          if (table) {
            tableData = table;
          }
        });
        
        if (!tableData) {
          throw new Error("Table not found");
        }
        
        const data = JSON.stringify(tableData.records);
        return new Blob([data], { type: "application/json" });
      },

      // Templates
      createTemplate: (baseId, template) => {
        const id = generateId();
        const newTemplate: Template = { ...template, id };
        
        set((state) => ({
          templates: {
            ...state.templates,
            [id]: newTemplate,
          },
        }));
        
        return id;
      },

      useTemplate: (templateId) => {
        const template = get().templates[templateId];
        if (!template) return "";
        
        // Create a new base from template
        const baseId = get().createBase({
          name: template.name,
          description: template.description,
          color: "#4A90E2",
          icon: "📊",
          tables: [],
          collaborators: [],
          permissions: {
            allowAddingRecords: true,
            allowDeletingRecords: true,
            allowCreatingFields: true,
            allowDeletingFields: false,
            allowCreatingTables: true,
            allowDeletingTables: false,
            allowInvitingCollaborators: true,
            allowExporting: true,
            allowSyncing: false,
          },
          isShared: false,
          templates: [],
        });
        
        // Add tables from template
        template.tables.forEach(tableTemplate => {
          if (tableTemplate.name) {
            get().createTable(baseId, {
              name: tableTemplate.name,
              description: tableTemplate.description || "",
              primaryFieldId: "",
              fields: tableTemplate.fields || [],
              records: [],
              views: [],
              forms: [],
              automations: [],
            });
          }
        });
        
        return baseId;
      },

      shareTemplate: (templateId) => {
        get().updateTemplate(templateId, { isPublic: true });
      },

      updateTemplate: (templateId, updates) => {
        set((state) => ({
          templates: {
            ...state.templates,
            [templateId]: { ...state.templates[templateId], ...updates },
          },
        }));
      },
    }),
    {
      name: "airtable-store",
      version: 1,
    }
  )
);