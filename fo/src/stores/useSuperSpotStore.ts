import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Integration {
  id: string;
  name: string;
  category: string;
  provider: string;
  status: "active" | "inactive" | "error" | "pending";
  lastSync: Date;
  nextSync?: Date;
  apiKey?: string;
  config: any;
  metrics: IntegrationMetric[];
  alerts: Alert[];
}

export interface IntegrationMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  trend: "up" | "down" | "stable";
}

export interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface SuperSpotStoreState {
  integrations: { [id: string]: Integration };
  selectedIntegrationId: string | null;
  
  addIntegration: (integration: Omit<Integration, "id">) => string;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;
  removeIntegration: (id: string) => void;
  
  syncIntegration: (id: string) => Promise<void>;
  testConnection: (id: string) => Promise<boolean>;
  
  acknowledgeAlert: (integrationId: string, alertId: string) => void;
  addAlert: (integrationId: string, alert: Omit<Alert, "id">) => void;
  
  setSelectedIntegration: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useSuperSpotStore = create<SuperSpotStoreState>()(
  persist(
    (set, get) => ({
      integrations: {},
      selectedIntegrationId: null,

      addIntegration: (integration) => {
        const id = generateId();
        const newIntegration: Integration = {
          ...integration,
          id,
          lastSync: new Date(),
          metrics: [],
          alerts: [],
        };
        
        set((state) => ({
          integrations: { ...state.integrations, [id]: newIntegration },
          selectedIntegrationId: id,
        }));
        
        return id;
      },

      updateIntegration: (id, updates) => {
        set((state) => ({
          integrations: {
            ...state.integrations,
            [id]: { ...state.integrations[id], ...updates },
          },
        }));
      },

      removeIntegration: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.integrations;
          return {
            integrations: remaining,
            selectedIntegrationId: state.selectedIntegrationId === id ? null : state.selectedIntegrationId,
          };
        });
      },

      syncIntegration: async (id) => {
        console.log("Syncing integration:", id);
        
        set((state) => ({
          integrations: {
            ...state.integrations,
            [id]: { ...state.integrations[id], status: "pending" },
          },
        }));
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        set((state) => ({
          integrations: {
            ...state.integrations,
            [id]: {
              ...state.integrations[id],
              status: "active",
              lastSync: new Date(),
            },
          },
        }));
      },

      testConnection: async (id) => {
        console.log("Testing connection for integration:", id);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Math.random() > 0.2; // 80% success rate
      },

      acknowledgeAlert: (integrationId, alertId) => {
        set((state) => ({
          integrations: {
            ...state.integrations,
            [integrationId]: {
              ...state.integrations[integrationId],
              alerts: state.integrations[integrationId].alerts.map(alert =>
                alert.id === alertId ? { ...alert, acknowledged: true } : alert
              ),
            },
          },
        }));
      },

      addAlert: (integrationId, alert) => {
        const id = generateId();
        const newAlert: Alert = { ...alert, id };
        
        set((state) => ({
          integrations: {
            ...state.integrations,
            [integrationId]: {
              ...state.integrations[integrationId],
              alerts: [...state.integrations[integrationId].alerts, newAlert],
            },
          },
        }));
      },

      setSelectedIntegration: (id) => {
        set({ selectedIntegrationId: id });
      },
    }),
    {
      name: "superspot-store",
      version: 1,
    }
  )
);