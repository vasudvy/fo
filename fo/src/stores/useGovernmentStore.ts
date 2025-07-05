import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Government functionality
export interface RegulatoryFiling {
  id: string;
  type: "tax" | "compliance" | "license" | "permit" | "employment" | "environmental" | "financial";
  title: string;
  description: string;
  agency: string;
  dueDate: Date;
  filingDate?: Date;
  status: "pending" | "submitted" | "approved" | "rejected" | "expired";
  priority: "low" | "medium" | "high" | "critical";
  documents: Document[];
  requirements: string[];
  cost?: number;
  renewalRequired?: boolean;
  renewalDate?: Date;
  contactPerson?: string;
  trackingNumber?: string;
  notes: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: Date;
  url?: string;
  content?: ArrayBuffer;
  isRequired: boolean;
  status: "pending" | "approved" | "rejected";
  reviewNotes?: string;
}

export interface ComplianceCheck {
  id: string;
  category: string;
  requirement: string;
  status: "compliant" | "non-compliant" | "pending-review" | "not-applicable";
  lastReviewDate: Date;
  nextReviewDate: Date;
  evidence: Document[];
  assignedTo?: string;
  remediationSteps?: string[];
  riskLevel: "low" | "medium" | "high" | "critical";
}

export interface GovernmentContact {
  id: string;
  name: string;
  title: string;
  agency: string;
  department: string;
  email: string;
  phone: string;
  address: string;
  specialization: string[];
  notes: string;
}

export interface TaxRecord {
  id: string;
  year: number;
  quarter?: number;
  type: "income" | "payroll" | "sales" | "property" | "other";
  amount: number;
  paid: boolean;
  dueDate: Date;
  paidDate?: Date;
  filingStatus: "not-filed" | "filed" | "amended" | "audit";
  documents: Document[];
  notes: string;
}

export interface License {
  id: string;
  name: string;
  type: string;
  issuingAuthority: string;
  licenseNumber: string;
  issueDate: Date;
  expirationDate: Date;
  status: "active" | "expired" | "suspended" | "revoked";
  renewalRequired: boolean;
  renewalNotificationDays: number;
  cost: number;
  documents: Document[];
  conditions?: string[];
  notes: string;
}

export interface Audit {
  id: string;
  type: "tax" | "compliance" | "financial" | "employment" | "environmental";
  agency: string;
  startDate: Date;
  endDate?: Date;
  status: "scheduled" | "in-progress" | "completed" | "closed";
  auditor: string;
  scope: string;
  findings: AuditFinding[];
  documents: Document[];
  notes: string;
}

export interface AuditFinding {
  id: string;
  category: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "resolved" | "disputed";
  remediationPlan?: string;
  dueDate?: Date;
  assignedTo?: string;
}

export interface GovernmentStoreState {
  // Data
  filings: { [id: string]: RegulatoryFiling };
  complianceChecks: { [id: string]: ComplianceCheck };
  contacts: { [id: string]: GovernmentContact };
  taxRecords: { [id: string]: TaxRecord };
  licenses: { [id: string]: License };
  audits: { [id: string]: Audit };
  
  // Current state
  activeFilingId: string | null;
  selectedFilingIds: string[];
  currentView: "dashboard" | "filings" | "compliance" | "taxes" | "licenses" | "audits";
  
  // Filters and search
  searchQuery: string;
  statusFilter: string[];
  typeFilter: string[];
  dateRange: { start: Date; end: Date } | null;
  
  // Notifications
  upcomingDeadlines: RegulatoryFiling[];
  overdueItems: RegulatoryFiling[];
  
  // Settings
  defaultReminderDays: number;
  autoRenewal: boolean;
  
  // Actions - Filings
  createFiling: (filing: Omit<RegulatoryFiling, "id">) => string;
  updateFiling: (id: string, updates: Partial<RegulatoryFiling>) => void;
  deleteFiling: (id: string) => void;
  submitFiling: (id: string) => Promise<void>;
  
  // Actions - Compliance
  createComplianceCheck: (check: Omit<ComplianceCheck, "id">) => string;
  updateComplianceCheck: (id: string, updates: Partial<ComplianceCheck>) => void;
  deleteComplianceCheck: (id: string) => void;
  runComplianceAudit: () => Promise<void>;
  
  // Actions - Contacts
  createContact: (contact: Omit<GovernmentContact, "id">) => string;
  updateContact: (id: string, updates: Partial<GovernmentContact>) => void;
  deleteContact: (id: string) => void;
  
  // Actions - Tax Records
  createTaxRecord: (record: Omit<TaxRecord, "id">) => string;
  updateTaxRecord: (id: string, updates: Partial<TaxRecord>) => void;
  deleteTaxRecord: (id: string) => void;
  
  // Actions - Licenses
  createLicense: (license: Omit<License, "id">) => string;
  updateLicense: (id: string, updates: Partial<License>) => void;
  deleteLicense: (id: string) => void;
  renewLicense: (id: string) => Promise<void>;
  
  // Actions - Audits
  createAudit: (audit: Omit<Audit, "id">) => string;
  updateAudit: (id: string, updates: Partial<Audit>) => void;
  deleteAudit: (id: string) => void;
  addAuditFinding: (auditId: string, finding: Omit<AuditFinding, "id">) => void;
  
  // Actions - UI
  setActiveFilingId: (id: string | null) => void;
  setSelectedFilingIds: (ids: string[]) => void;
  setCurrentView: (view: GovernmentStoreState["currentView"]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (statuses: string[]) => void;
  setTypeFilter: (types: string[]) => void;
  setDateRange: (range: { start: Date; end: Date } | null) => void;
  
  // Actions - Notifications
  refreshDeadlines: () => void;
  markDeadlineNotified: (filingId: string) => void;
  
  // Actions - Import/Export
  importData: (data: any) => Promise<void>;
  exportData: (format: "json" | "csv" | "pdf") => Promise<Blob>;
  
  // Actions - Reporting
  generateComplianceReport: () => Promise<Blob>;
  generateTaxSummary: (year: number) => Promise<Blob>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useGovernmentStore = create<GovernmentStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      filings: {},
      complianceChecks: {},
      contacts: {},
      taxRecords: {},
      licenses: {},
      audits: {},
      
      activeFilingId: null,
      selectedFilingIds: [],
      currentView: "dashboard",
      
      searchQuery: "",
      statusFilter: [],
      typeFilter: [],
      dateRange: null,
      
      upcomingDeadlines: [],
      overdueItems: [],
      
      defaultReminderDays: 30,
      autoRenewal: false,

      // Filings
      createFiling: (filing) => {
        const id = generateId();
        const newFiling: RegulatoryFiling = {
          ...filing,
          id,
          documents: [],
          notes: "",
        };
        
        set((state) => ({
          filings: {
            ...state.filings,
            [id]: newFiling,
          },
        }));
        
        return id;
      },

      updateFiling: (id, updates) => {
        set((state) => ({
          filings: {
            ...state.filings,
            [id]: { ...state.filings[id], ...updates },
          },
        }));
      },

      deleteFiling: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.filings;
          return { filings: remaining };
        });
      },

      submitFiling: async (id) => {
        const filing = get().filings[id];
        if (!filing) return;
        
        // Simulate submission
        console.log("Submitting filing:", filing.title);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        get().updateFiling(id, {
          status: "submitted",
          filingDate: new Date(),
          trackingNumber: `TR${Date.now()}`,
        });
      },

      // Compliance
      createComplianceCheck: (check) => {
        const id = generateId();
        const newCheck: ComplianceCheck = { ...check, id };
        
        set((state) => ({
          complianceChecks: {
            ...state.complianceChecks,
            [id]: newCheck,
          },
        }));
        
        return id;
      },

      updateComplianceCheck: (id, updates) => {
        set((state) => ({
          complianceChecks: {
            ...state.complianceChecks,
            [id]: { ...state.complianceChecks[id], ...updates },
          },
        }));
      },

      deleteComplianceCheck: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.complianceChecks;
          return { complianceChecks: remaining };
        });
      },

      runComplianceAudit: async () => {
        console.log("Running compliance audit...");
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Update compliance checks
        const checks = Object.values(get().complianceChecks);
        checks.forEach(check => {
          get().updateComplianceCheck(check.id, {
            lastReviewDate: new Date(),
            nextReviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          });
        });
      },

      // Contacts
      createContact: (contact) => {
        const id = generateId();
        const newContact: GovernmentContact = { ...contact, id };
        
        set((state) => ({
          contacts: {
            ...state.contacts,
            [id]: newContact,
          },
        }));
        
        return id;
      },

      updateContact: (id, updates) => {
        set((state) => ({
          contacts: {
            ...state.contacts,
            [id]: { ...state.contacts[id], ...updates },
          },
        }));
      },

      deleteContact: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.contacts;
          return { contacts: remaining };
        });
      },

      // Tax Records
      createTaxRecord: (record) => {
        const id = generateId();
        const newRecord: TaxRecord = { ...record, id };
        
        set((state) => ({
          taxRecords: {
            ...state.taxRecords,
            [id]: newRecord,
          },
        }));
        
        return id;
      },

      updateTaxRecord: (id, updates) => {
        set((state) => ({
          taxRecords: {
            ...state.taxRecords,
            [id]: { ...state.taxRecords[id], ...updates },
          },
        }));
      },

      deleteTaxRecord: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.taxRecords;
          return { taxRecords: remaining };
        });
      },

      // Licenses
      createLicense: (license) => {
        const id = generateId();
        const newLicense: License = { ...license, id };
        
        set((state) => ({
          licenses: {
            ...state.licenses,
            [id]: newLicense,
          },
        }));
        
        return id;
      },

      updateLicense: (id, updates) => {
        set((state) => ({
          licenses: {
            ...state.licenses,
            [id]: { ...state.licenses[id], ...updates },
          },
        }));
      },

      deleteLicense: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.licenses;
          return { licenses: remaining };
        });
      },

      renewLicense: async (id) => {
        const license = get().licenses[id];
        if (!license) return;
        
        console.log("Renewing license:", license.name);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const newExpirationDate = new Date(license.expirationDate);
        newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1);
        
        get().updateLicense(id, {
          expirationDate: newExpirationDate,
          status: "active",
        });
      },

      // Audits
      createAudit: (audit) => {
        const id = generateId();
        const newAudit: Audit = { ...audit, id };
        
        set((state) => ({
          audits: {
            ...state.audits,
            [id]: newAudit,
          },
        }));
        
        return id;
      },

      updateAudit: (id, updates) => {
        set((state) => ({
          audits: {
            ...state.audits,
            [id]: { ...state.audits[id], ...updates },
          },
        }));
      },

      deleteAudit: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.audits;
          return { audits: remaining };
        });
      },

      addAuditFinding: (auditId, finding) => {
        const findingId = generateId();
        const newFinding: AuditFinding = { ...finding, id: findingId };
        
        set((state) => ({
          audits: {
            ...state.audits,
            [auditId]: {
              ...state.audits[auditId],
              findings: [...state.audits[auditId].findings, newFinding],
            },
          },
        }));
      },

      // UI actions
      setActiveFilingId: (id) => {
        set({ activeFilingId: id });
      },

      setSelectedFilingIds: (ids) => {
        set({ selectedFilingIds: ids });
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },

      setStatusFilter: (statuses) => {
        set({ statusFilter: statuses });
      },

      setTypeFilter: (types) => {
        set({ typeFilter: types });
      },

      setDateRange: (range) => {
        set({ dateRange: range });
      },

      // Notifications
      refreshDeadlines: () => {
        const now = new Date();
        const reminderDate = new Date(now.getTime() + get().defaultReminderDays * 24 * 60 * 60 * 1000);
        
        const filings = Object.values(get().filings);
        const upcoming = filings.filter(f => 
          f.dueDate <= reminderDate && f.dueDate > now && f.status === "pending"
        );
        const overdue = filings.filter(f => 
          f.dueDate < now && f.status === "pending"
        );
        
        set({ upcomingDeadlines: upcoming, overdueItems: overdue });
      },

      markDeadlineNotified: (filingId) => {
        // Mark as notified in the filing
        get().updateFiling(filingId, {
          notes: get().filings[filingId].notes + `\nNotified: ${new Date().toISOString()}`,
        });
      },

      // Import/Export
      importData: async (data) => {
        console.log("Importing government data...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (data.filings) {
          set((state) => ({
            filings: { ...state.filings, ...data.filings },
          }));
        }
      },

      exportData: async (format) => {
        const data = {
          filings: get().filings,
          complianceChecks: get().complianceChecks,
          contacts: get().contacts,
          taxRecords: get().taxRecords,
          licenses: get().licenses,
          audits: get().audits,
        };
        
        const jsonData = JSON.stringify(data, null, 2);
        return new Blob([jsonData], { type: "application/json" });
      },

      // Reporting
      generateComplianceReport: async () => {
        console.log("Generating compliance report...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const report = "Compliance Report\n\nGenerated on: " + new Date().toISOString();
        return new Blob([report], { type: "text/plain" });
      },

      generateTaxSummary: async (year) => {
        console.log("Generating tax summary for year:", year);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const summary = `Tax Summary for ${year}\n\nGenerated on: ${new Date().toISOString()}`;
        return new Blob([summary], { type: "text/plain" });
      },
    }),
    {
      name: "government-store",
      version: 1,
    }
  )
);