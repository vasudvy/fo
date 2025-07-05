import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Dashboard {
  id: string;
  name: string;
  description: string;
  cards: DashboardCard[];
  filters: DashboardFilter[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DashboardCard {
  id: string;
  questionId: string;
  title: string;
  visualization: any;
  position: { x: number; y: number; width: number; height: number };
}

export interface Question {
  id: string;
  name: string;
  query: any;
  visualization: any;
  databaseId: string;
  collectionId?: string;
  isPublic: boolean;
  createdAt: Date;
}

export interface Database {
  id: string;
  name: string;
  engine: string;
  connectionString: string;
  isActive: boolean;
  tables: DatabaseTable[];
}

export interface DatabaseTable {
  id: string;
  name: string;
  schema: string;
  fields: TableField[];
}

export interface TableField {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: string;
  target: string[];
}

export interface MetabaseStoreState {
  dashboards: { [id: string]: Dashboard };
  questions: { [id: string]: Question };
  databases: { [id: string]: Database };
  activeDashboardId: string | null;
  activeQuestionId: string | null;
  
  createDashboard: (dashboard: Omit<Dashboard, "id" | "createdAt" | "updatedAt">) => string;
  updateDashboard: (id: string, updates: Partial<Dashboard>) => void;
  deleteDashboard: (id: string) => void;
  
  createQuestion: (question: Omit<Question, "id" | "createdAt">) => string;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  deleteQuestion: (id: string) => void;
  
  connectDatabase: (database: Omit<Database, "id">) => string;
  syncDatabase: (id: string) => Promise<void>;
  
  setActiveDashboard: (id: string | null) => void;
  setActiveQuestion: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useMetabaseStore = create<MetabaseStoreState>()(
  persist(
    (set, get) => ({
      dashboards: {},
      questions: {},
      databases: {},
      activeDashboardId: null,
      activeQuestionId: null,

      createDashboard: (dashboard) => {
        const id = generateId();
        const newDashboard: Dashboard = {
          ...dashboard,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          dashboards: { ...state.dashboards, [id]: newDashboard },
          activeDashboardId: id,
        }));
        
        return id;
      },

      updateDashboard: (id, updates) => {
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: { ...state.dashboards[id], ...updates, updatedAt: new Date() },
          },
        }));
      },

      deleteDashboard: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.dashboards;
          return {
            dashboards: remaining,
            activeDashboardId: state.activeDashboardId === id ? null : state.activeDashboardId,
          };
        });
      },

      createQuestion: (question) => {
        const id = generateId();
        const newQuestion: Question = { ...question, id, createdAt: new Date() };
        
        set((state) => ({
          questions: { ...state.questions, [id]: newQuestion },
          activeQuestionId: id,
        }));
        
        return id;
      },

      updateQuestion: (id, updates) => {
        set((state) => ({
          questions: {
            ...state.questions,
            [id]: { ...state.questions[id], ...updates },
          },
        }));
      },

      deleteQuestion: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.questions;
          return {
            questions: remaining,
            activeQuestionId: state.activeQuestionId === id ? null : state.activeQuestionId,
          };
        });
      },

      connectDatabase: (database) => {
        const id = generateId();
        const newDatabase: Database = { ...database, id };
        
        set((state) => ({
          databases: { ...state.databases, [id]: newDatabase },
        }));
        
        return id;
      },

      syncDatabase: async (id) => {
        console.log("Syncing database:", id);
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set((state) => ({
          databases: {
            ...state.databases,
            [id]: { ...state.databases[id], isActive: true },
          },
        }));
      },

      setActiveDashboard: (id) => {
        set({ activeDashboardId: id });
      },

      setActiveQuestion: (id) => {
        set({ activeQuestionId: id });
      },
    }),
    {
      name: "metabase-store",
      version: 1,
    }
  )
);