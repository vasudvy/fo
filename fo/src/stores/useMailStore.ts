import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Mail functionality
export interface Email {
  id: string;
  threadId: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  }[];
  cc?: {
    name: string;
    email: string;
  }[];
  bcc?: {
    name: string;
    email: string;
  }[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: Attachment[];
  date: Date;
  read: boolean;
  starred: boolean;
  flagged: boolean;
  importance: "low" | "normal" | "high";
  labels: string[];
  folder: string;
  isEncrypted?: boolean;
  signature?: EmailSignature;
  replyTo?: {
    name: string;
    email: string;
  };
  inReplyTo?: string;
  references?: string[];
}

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  content?: ArrayBuffer;
  isInline?: boolean;
  contentId?: string;
}

export interface EmailThread {
  id: string;
  subject: string;
  participants: {
    name: string;
    email: string;
  }[];
  emailCount: number;
  lastActivity: Date;
  read: boolean;
  starred: boolean;
  folder: string;
  labels: string[];
  emails: Email[];
}

export interface Folder {
  id: string;
  name: string;
  type: "inbox" | "sent" | "drafts" | "trash" | "spam" | "custom";
  parentId?: string;
  unreadCount: number;
  totalCount: number;
  color?: string;
  icon?: string;
  isCollapsed?: boolean;
  children?: Folder[];
}

export interface EmailSignature {
  id: string;
  name: string;
  content: string;
  htmlContent?: string;
  isDefault?: boolean;
}

export interface EmailAccount {
  id: string;
  name: string;
  email: string;
  type: "imap" | "pop3" | "exchange" | "gmail" | "outlook";
  settings: {
    incomingServer: string;
    outgoingServer: string;
    port: number;
    security: "none" | "ssl" | "tls";
    username: string;
    password?: string;
  };
  isDefault?: boolean;
  isActive: boolean;
  lastSyncTime?: Date;
  syncStatus: "idle" | "syncing" | "error";
  unreadCount: number;
  signatures: EmailSignature[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  htmlBody?: string;
  category: string;
  isSystem?: boolean;
  variables?: { [key: string]: string };
}

export interface EmailRule {
  id: string;
  name: string;
  isActive: boolean;
  conditions: FilterCondition[];
  actions: FilterAction[];
  priority: number;
}

export interface FilterCondition {
  field: "from" | "to" | "subject" | "body" | "attachment" | "date" | "size";
  operator: "contains" | "equals" | "startsWith" | "endsWith" | "greater" | "less" | "exists";
  value: string;
  caseSensitive?: boolean;
}

export interface FilterAction {
  type: "move" | "copy" | "label" | "star" | "delete" | "markRead" | "forward" | "reply";
  value?: string;
  template?: string;
}

export interface SearchQuery {
  query: string;
  folder?: string;
  from?: string;
  to?: string;
  subject?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  hasAttachments?: boolean;
  isRead?: boolean;
  isStarred?: boolean;
  labels?: string[];
}

export interface ComposeDraft {
  id: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  body: string;
  htmlBody?: string;
  attachments: Attachment[];
  signatureId?: string;
  importance: "low" | "normal" | "high";
  requestReadReceipt?: boolean;
  scheduledSend?: Date;
  lastSaved: Date;
  replyToId?: string;
  forwardFromId?: string;
}

export interface MailStoreState {
  // Email data
  emails: { [id: string]: Email };
  threads: { [id: string]: EmailThread };
  folders: { [id: string]: Folder };
  accounts: { [id: string]: EmailAccount };
  templates: { [id: string]: EmailTemplate };
  rules: { [id: string]: EmailRule };
  
  // Current state
  activeAccountId: string | null;
  activeFolderId: string | null;
  selectedThreadIds: string[];
  selectedEmailIds: string[];
  currentView: "threads" | "emails";
  
  // Composition
  composeDrafts: { [id: string]: ComposeDraft };
  activeComposeId: string | null;
  
  // Search and filters
  searchQuery: SearchQuery | null;
  searchResults: string[];
  isSearching: boolean;
  
  // UI state
  isComposing: boolean;
  previewEmailId: string | null;
  sidebarCollapsed: boolean;
  listViewMode: "comfortable" | "compact" | "list";
  
  // Settings
  autoSave: boolean;
  syncInterval: number;
  showImages: "always" | "never" | "ask";
  threadingEnabled: boolean;
  
  // Actions - Account management
  addAccount: (account: Omit<EmailAccount, "id">) => string;
  updateAccount: (id: string, updates: Partial<EmailAccount>) => void;
  removeAccount: (id: string) => void;
  setActiveAccount: (id: string) => void;
  syncAccount: (id: string) => Promise<void>;
  
  // Actions - Folder management
  createFolder: (folder: Omit<Folder, "id">) => string;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;
  moveFolder: (id: string, parentId: string | null) => void;
  
  // Actions - Email management
  fetchEmails: (folderId: string) => Promise<void>;
  sendEmail: (draft: ComposeDraft) => Promise<void>;
  moveEmails: (emailIds: string[], targetFolderId: string) => void;
  deleteEmails: (emailIds: string[]) => void;
  markAsRead: (emailIds: string[], read: boolean) => void;
  markAsStarred: (emailIds: string[], starred: boolean) => void;
  addLabels: (emailIds: string[], labels: string[]) => void;
  removeLabels: (emailIds: string[], labels: string[]) => void;
  
  // Actions - Composition
  createDraft: (draft?: Partial<ComposeDraft>) => string;
  updateDraft: (id: string, updates: Partial<ComposeDraft>) => void;
  deleteDraft: (id: string) => void;
  saveDraft: (id: string) => Promise<void>;
  
  // Actions - Search
  search: (query: SearchQuery) => Promise<void>;
  clearSearch: () => void;
  
  // Actions - Templates
  createTemplate: (template: Omit<EmailTemplate, "id">) => string;
  updateTemplate: (id: string, updates: Partial<EmailTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // Actions - Rules
  createRule: (rule: Omit<EmailRule, "id">) => string;
  updateRule: (id: string, updates: Partial<EmailRule>) => void;
  deleteRule: (id: string) => void;
  applyRules: (emailIds: string[]) => void;
  
  // Actions - UI
  setActiveFolder: (folderId: string) => void;
  setSelectedThreads: (threadIds: string[]) => void;
  setSelectedEmails: (emailIds: string[]) => void;
  setPreviewEmail: (emailId: string | null) => void;
  setCurrentView: (view: "threads" | "emails") => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setListViewMode: (mode: "comfortable" | "compact" | "list") => void;
  
  // Actions - Import/Export
  importEmails: (emails: Email[]) => Promise<void>;
  exportEmails: (emailIds: string[], format: "mbox" | "eml" | "json") => Promise<Blob>;
  
  // Actions - Attachments
  downloadAttachment: (attachmentId: string) => Promise<Blob>;
  previewAttachment: (attachmentId: string) => Promise<string>;
}

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultFolders = (): { [id: string]: Folder } => {
  const folders: { [id: string]: Folder } = {};
  
  const defaultFolders: Omit<Folder, "id">[] = [
    { name: "Inbox", type: "inbox", unreadCount: 0, totalCount: 0 },
    { name: "Sent", type: "sent", unreadCount: 0, totalCount: 0 },
    { name: "Drafts", type: "drafts", unreadCount: 0, totalCount: 0 },
    { name: "Trash", type: "trash", unreadCount: 0, totalCount: 0 },
    { name: "Spam", type: "spam", unreadCount: 0, totalCount: 0 },
  ];
  
  defaultFolders.forEach(folder => {
    const id = generateId();
    folders[id] = { ...folder, id };
  });
  
  return folders;
};

const createDefaultSignature = (): EmailSignature => ({
  id: generateId(),
  name: "Default",
  content: "Best regards,\nFounder's Office",
  htmlContent: "<p>Best regards,<br>Founder's Office</p>",
  isDefault: true,
});

const parseEmailAddress = (email: string): { name: string; email: string } => {
  const match = email.match(/^(.+?)\s*<(.+?)>$/);
  if (match) {
    return { name: match[1].trim(), email: match[2].trim() };
  }
  return { name: email, email };
};

const groupEmailsIntoThreads = (emails: Email[]): { [id: string]: EmailThread } => {
  const threads: { [id: string]: EmailThread } = {};
  
  emails.forEach(email => {
    if (!threads[email.threadId]) {
      threads[email.threadId] = {
        id: email.threadId,
        subject: email.subject,
        participants: [email.from, ...email.to],
        emailCount: 0,
        lastActivity: email.date,
        read: true,
        starred: false,
        folder: email.folder,
        labels: [],
        emails: [],
      };
    }
    
    const thread = threads[email.threadId];
    thread.emails.push(email);
    thread.emailCount++;
    thread.lastActivity = new Date(Math.max(thread.lastActivity.getTime(), email.date.getTime()));
    thread.read = thread.read && email.read;
    thread.starred = thread.starred || email.starred;
    
    // Add unique participants
    [...email.to, ...(email.cc || [])].forEach(participant => {
      if (!thread.participants.some(p => p.email === participant.email)) {
        thread.participants.push(participant);
      }
    });
  });
  
  return threads;
};

const applyRule = (email: Email, rule: EmailRule): FilterAction[] => {
  const matchedActions: FilterAction[] = [];
  
  if (!rule.isActive) return matchedActions;
  
  const allConditionsMet = rule.conditions.every(condition => {
    const fieldValue = getEmailFieldValue(email, condition.field);
    return evaluateCondition(fieldValue, condition);
  });
  
  if (allConditionsMet) {
    matchedActions.push(...rule.actions);
  }
  
  return matchedActions;
};

const getEmailFieldValue = (email: Email, field: FilterCondition["field"]): string => {
  switch (field) {
    case "from":
      return email.from.email;
    case "to":
      return email.to.map(t => t.email).join(", ");
    case "subject":
      return email.subject;
    case "body":
      return email.body;
    case "attachment":
      return email.attachments.length > 0 ? "true" : "false";
    case "date":
      return email.date.toISOString();
    case "size":
      return email.body.length.toString();
    default:
      return "";
  }
};

const evaluateCondition = (value: string, condition: FilterCondition): boolean => {
  const searchValue = condition.caseSensitive ? condition.value : condition.value.toLowerCase();
  const fieldValue = condition.caseSensitive ? value : value.toLowerCase();
  
  switch (condition.operator) {
    case "contains":
      return fieldValue.includes(searchValue);
    case "equals":
      return fieldValue === searchValue;
    case "startsWith":
      return fieldValue.startsWith(searchValue);
    case "endsWith":
      return fieldValue.endsWith(searchValue);
    case "greater":
      return parseFloat(fieldValue) > parseFloat(searchValue);
    case "less":
      return parseFloat(fieldValue) < parseFloat(searchValue);
    case "exists":
      return fieldValue.length > 0;
    default:
      return false;
  }
};

export const useMailStore = create<MailStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      emails: {},
      threads: {},
      folders: createDefaultFolders(),
      accounts: {},
      templates: {},
      rules: {},
      
      activeAccountId: null,
      activeFolderId: null,
      selectedThreadIds: [],
      selectedEmailIds: [],
      currentView: "threads",
      
      composeDrafts: {},
      activeComposeId: null,
      
      searchQuery: null,
      searchResults: [],
      isSearching: false,
      
      isComposing: false,
      previewEmailId: null,
      sidebarCollapsed: false,
      listViewMode: "comfortable",
      
      autoSave: true,
      syncInterval: 300000, // 5 minutes
      showImages: "ask",
      threadingEnabled: true,

      // Account management
      addAccount: (account) => {
        const id = generateId();
        const newAccount: EmailAccount = {
          ...account,
          id,
          signatures: [createDefaultSignature()],
        };
        
        set((state) => ({
          accounts: {
            ...state.accounts,
            [id]: newAccount,
          },
          activeAccountId: state.activeAccountId || id,
        }));
        
        return id;
      },

      updateAccount: (id, updates) => {
        set((state) => ({
          accounts: {
            ...state.accounts,
            [id]: { ...state.accounts[id], ...updates },
          },
        }));
      },

      removeAccount: (id) => {
        set((state) => {
          const { [id]: removed, ...remaining } = state.accounts;
          return {
            accounts: remaining,
            activeAccountId: state.activeAccountId === id ? null : state.activeAccountId,
          };
        });
      },

      setActiveAccount: (id) => {
        set({ activeAccountId: id });
      },

      syncAccount: async (id) => {
        const account = get().accounts[id];
        if (!account) return;
        
        set((state) => ({
          accounts: {
            ...state.accounts,
            [id]: { ...account, syncStatus: "syncing" },
          },
        }));
        
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          set((state) => ({
            accounts: {
              ...state.accounts,
              [id]: { 
                ...state.accounts[id], 
                syncStatus: "idle",
                lastSyncTime: new Date(),
              },
            },
          }));
        } catch (error) {
          set((state) => ({
            accounts: {
              ...state.accounts,
              [id]: { ...state.accounts[id], syncStatus: "error" },
            },
          }));
        }
      },

      // Folder management
      createFolder: (folder) => {
        const id = generateId();
        const newFolder: Folder = { ...folder, id };
        
        set((state) => ({
          folders: {
            ...state.folders,
            [id]: newFolder,
          },
        }));
        
        return id;
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: {
            ...state.folders,
            [id]: { ...state.folders[id], ...updates },
          },
        }));
      },

      deleteFolder: (id) => {
        set((state) => {
          const { [id]: removed, ...remaining } = state.folders;
          return {
            folders: remaining,
            activeFolderId: state.activeFolderId === id ? null : state.activeFolderId,
          };
        });
      },

      moveFolder: (id, parentId) => {
        set((state) => ({
          folders: {
            ...state.folders,
            [id]: { ...state.folders[id], parentId },
          },
        }));
      },

      // Email management
      fetchEmails: async (folderId) => {
        // Simulate API call
        console.log("Fetching emails for folder:", folderId);
        await new Promise(resolve => setTimeout(resolve, 1000));
      },

      sendEmail: async (draft) => {
        // Simulate sending email
        console.log("Sending email:", draft);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create email record
        const email: Email = {
          id: generateId(),
          threadId: draft.replyToId || generateId(),
          from: parseEmailAddress(draft.to[0]), // This would be current user
          to: draft.to.map(parseEmailAddress),
          cc: draft.cc?.map(parseEmailAddress),
          bcc: draft.bcc?.map(parseEmailAddress),
          subject: draft.subject,
          body: draft.body,
          htmlBody: draft.htmlBody,
          attachments: draft.attachments,
          date: new Date(),
          read: true,
          starred: false,
          flagged: false,
          importance: draft.importance,
          labels: [],
          folder: "sent",
        };
        
        set((state) => ({
          emails: {
            ...state.emails,
            [email.id]: email,
          },
        }));
        
        // Remove from drafts
        if (get().composeDrafts[draft.id]) {
          get().deleteDraft(draft.id);
        }
      },

      moveEmails: (emailIds, targetFolderId) => {
        set((state) => {
          const updatedEmails = { ...state.emails };
          emailIds.forEach(id => {
            if (updatedEmails[id]) {
              updatedEmails[id] = { ...updatedEmails[id], folder: targetFolderId };
            }
          });
          return { emails: updatedEmails };
        });
      },

      deleteEmails: (emailIds) => {
        get().moveEmails(emailIds, "trash");
      },

      markAsRead: (emailIds, read) => {
        set((state) => {
          const updatedEmails = { ...state.emails };
          emailIds.forEach(id => {
            if (updatedEmails[id]) {
              updatedEmails[id] = { ...updatedEmails[id], read };
            }
          });
          return { emails: updatedEmails };
        });
      },

      markAsStarred: (emailIds, starred) => {
        set((state) => {
          const updatedEmails = { ...state.emails };
          emailIds.forEach(id => {
            if (updatedEmails[id]) {
              updatedEmails[id] = { ...updatedEmails[id], starred };
            }
          });
          return { emails: updatedEmails };
        });
      },

      addLabels: (emailIds, labels) => {
        set((state) => {
          const updatedEmails = { ...state.emails };
          emailIds.forEach(id => {
            if (updatedEmails[id]) {
              const existingLabels = updatedEmails[id].labels;
              const newLabels = [...existingLabels, ...labels.filter(l => !existingLabels.includes(l))];
              updatedEmails[id] = { ...updatedEmails[id], labels: newLabels };
            }
          });
          return { emails: updatedEmails };
        });
      },

      removeLabels: (emailIds, labels) => {
        set((state) => {
          const updatedEmails = { ...state.emails };
          emailIds.forEach(id => {
            if (updatedEmails[id]) {
              const filteredLabels = updatedEmails[id].labels.filter(l => !labels.includes(l));
              updatedEmails[id] = { ...updatedEmails[id], labels: filteredLabels };
            }
          });
          return { emails: updatedEmails };
        });
      },

      // Composition
      createDraft: (draft) => {
        const id = generateId();
        const newDraft: ComposeDraft = {
          id,
          to: [],
          subject: "",
          body: "",
          attachments: [],
          importance: "normal",
          lastSaved: new Date(),
          ...draft,
        };
        
        set((state) => ({
          composeDrafts: {
            ...state.composeDrafts,
            [id]: newDraft,
          },
          activeComposeId: id,
          isComposing: true,
        }));
        
        return id;
      },

      updateDraft: (id, updates) => {
        set((state) => ({
          composeDrafts: {
            ...state.composeDrafts,
            [id]: { 
              ...state.composeDrafts[id], 
              ...updates,
              lastSaved: new Date(),
            },
          },
        }));
      },

      deleteDraft: (id) => {
        set((state) => {
          const { [id]: removed, ...remaining } = state.composeDrafts;
          return {
            composeDrafts: remaining,
            activeComposeId: state.activeComposeId === id ? null : state.activeComposeId,
            isComposing: state.activeComposeId === id ? false : state.isComposing,
          };
        });
      },

      saveDraft: async (id) => {
        // Simulate saving draft
        console.log("Saving draft:", id);
        await new Promise(resolve => setTimeout(resolve, 500));
      },

      // Search
      search: async (query) => {
        set({ isSearching: true, searchQuery: query });
        
        try {
          // Simulate search
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const emails = Object.values(get().emails);
          const results = emails
            .filter(email => {
              if (query.query && !email.subject.toLowerCase().includes(query.query.toLowerCase())) {
                return false;
              }
              if (query.from && !email.from.email.includes(query.from)) {
                return false;
              }
              if (query.folder && email.folder !== query.folder) {
                return false;
              }
              return true;
            })
            .map(email => email.id);
          
          set({ searchResults: results, isSearching: false });
        } catch (error) {
          set({ isSearching: false });
        }
      },

      clearSearch: () => {
        set({ searchQuery: null, searchResults: [], isSearching: false });
      },

      // Templates
      createTemplate: (template) => {
        const id = generateId();
        const newTemplate: EmailTemplate = { ...template, id };
        
        set((state) => ({
          templates: {
            ...state.templates,
            [id]: newTemplate,
          },
        }));
        
        return id;
      },

      updateTemplate: (id, updates) => {
        set((state) => ({
          templates: {
            ...state.templates,
            [id]: { ...state.templates[id], ...updates },
          },
        }));
      },

      deleteTemplate: (id) => {
        set((state) => {
          const { [id]: removed, ...remaining } = state.templates;
          return { templates: remaining };
        });
      },

      // Rules
      createRule: (rule) => {
        const id = generateId();
        const newRule: EmailRule = { ...rule, id };
        
        set((state) => ({
          rules: {
            ...state.rules,
            [id]: newRule,
          },
        }));
        
        return id;
      },

      updateRule: (id, updates) => {
        set((state) => ({
          rules: {
            ...state.rules,
            [id]: { ...state.rules[id], ...updates },
          },
        }));
      },

      deleteRule: (id) => {
        set((state) => {
          const { [id]: removed, ...remaining } = state.rules;
          return { rules: remaining };
        });
      },

      applyRules: (emailIds) => {
        const { emails, rules } = get();
        const ruleArray = Object.values(rules).sort((a, b) => a.priority - b.priority);
        
        emailIds.forEach(emailId => {
          const email = emails[emailId];
          if (!email) return;
          
          ruleArray.forEach(rule => {
            const actions = applyRule(email, rule);
            actions.forEach(action => {
              // Apply rule actions
              switch (action.type) {
                case "move":
                  if (action.value) {
                    get().moveEmails([emailId], action.value);
                  }
                  break;
                case "label":
                  if (action.value) {
                    get().addLabels([emailId], [action.value]);
                  }
                  break;
                case "star":
                  get().markAsStarred([emailId], true);
                  break;
                case "markRead":
                  get().markAsRead([emailId], true);
                  break;
                case "delete":
                  get().deleteEmails([emailId]);
                  break;
              }
            });
          });
        });
      },

      // UI actions
      setActiveFolder: (folderId) => {
        set({ activeFolderId: folderId });
      },

      setSelectedThreads: (threadIds) => {
        set({ selectedThreadIds: threadIds });
      },

      setSelectedEmails: (emailIds) => {
        set({ selectedEmailIds: emailIds });
      },

      setPreviewEmail: (emailId) => {
        set({ previewEmailId: emailId });
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setListViewMode: (mode) => {
        set({ listViewMode: mode });
      },

      // Import/Export
      importEmails: async (emails) => {
        const emailsMap = emails.reduce((acc, email) => {
          acc[email.id] = email;
          return acc;
        }, {} as { [id: string]: Email });
        
        set((state) => ({
          emails: {
            ...state.emails,
            ...emailsMap,
          },
        }));
      },

      exportEmails: async (emailIds, format) => {
        const { emails } = get();
        const exportData = emailIds.map(id => emails[id]).filter(Boolean);
        
        const data = JSON.stringify(exportData, null, 2);
        return new Blob([data], { type: "application/json" });
      },

      // Attachments
      downloadAttachment: async (attachmentId) => {
        // Simulate download
        console.log("Downloading attachment:", attachmentId);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return new Blob(["attachment content"], { type: "application/octet-stream" });
      },

      previewAttachment: async (attachmentId) => {
        // Simulate preview
        console.log("Previewing attachment:", attachmentId);
        await new Promise(resolve => setTimeout(resolve, 500));
        return "data:text/plain;base64,YXR0YWNobWVudCBjb250ZW50";
      },
    }),
    {
      name: "mail-store",
      version: 1,
    }
  )
);