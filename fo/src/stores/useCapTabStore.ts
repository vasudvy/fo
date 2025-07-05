import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Shareholder {
  id: string;
  name: string;
  email: string;
  type: "founder" | "employee" | "investor" | "advisor";
  investmentRounds: string[];
  totalShares: number;
  currentOwnership: number;
  vestedShares: number;
  unvestedShares: number;
  exercisedOptions: number;
  unexercisedOptions: number;
  joinDate: Date;
  lastUpdated: Date;
}

export interface InvestmentRound {
  id: string;
  name: string;
  type: "seed" | "series-a" | "series-b" | "series-c" | "bridge" | "pre-seed";
  status: "planned" | "active" | "completed" | "cancelled";
  targetAmount: number;
  raisedAmount: number;
  preMoneyValuation: number;
  postMoneyValuation: number;
  pricePerShare: number;
  startDate: Date;
  closeDate?: Date;
  leadInvestor?: string;
  investors: RoundInvestor[];
}

export interface RoundInvestor {
  shareholderId: string;
  investmentAmount: number;
  sharesIssued: number;
  investmentDate: Date;
}

export interface EquityPool {
  id: string;
  name: string;
  type: "employee" | "advisor" | "consultant";
  totalShares: number;
  allocatedShares: number;
  availableShares: number;
  vestingSchedule: VestingSchedule;
  createdAt: Date;
}

export interface VestingSchedule {
  totalMonths: number;
  cliffMonths: number;
  vestingType: "monthly" | "quarterly" | "yearly";
  accelerationTriggers?: string[];
}

export interface PerformanceMetric {
  id: string;
  name: string;
  category: "financial" | "operational" | "growth" | "efficiency";
  value: number;
  target?: number;
  unit: string;
  period: "monthly" | "quarterly" | "yearly";
  date: Date;
  trend: "up" | "down" | "stable";
}

export interface Valuation {
  id: string;
  date: Date;
  method: "dcf" | "comparable" | "venture-capital" | "asset-based";
  value: number;
  notes?: string;
  approved: boolean;
  approvedBy?: string;
}

export interface CapTabStoreState {
  shareholders: { [id: string]: Shareholder };
  investmentRounds: { [id: string]: InvestmentRound };
  equityPools: { [id: string]: EquityPool };
  performanceMetrics: { [id: string]: PerformanceMetric };
  valuations: { [id: string]: Valuation };
  
  // Company info
  companyInfo: {
    name: string;
    totalShares: number;
    authorizedShares: number;
    parValue: number;
    incorporationDate: Date;
  };
  
  // Current state
  activeRoundId: string | null;
  selectedShareholderId: string | null;
  
  // Actions - Shareholders
  addShareholder: (shareholder: Omit<Shareholder, "id" | "lastUpdated">) => string;
  updateShareholder: (id: string, updates: Partial<Shareholder>) => void;
  removeShareholder: (id: string) => void;
  
  // Actions - Investment Rounds
  createRound: (round: Omit<InvestmentRound, "id">) => string;
  updateRound: (id: string, updates: Partial<InvestmentRound>) => void;
  closeRound: (id: string) => void;
  addInvestorToRound: (roundId: string, investor: RoundInvestor) => void;
  
  // Actions - Equity Pools
  createEquityPool: (pool: Omit<EquityPool, "id" | "createdAt">) => string;
  allocateEquity: (poolId: string, shareholderId: string, shares: number) => void;
  
  // Actions - Performance
  addMetric: (metric: Omit<PerformanceMetric, "id">) => string;
  updateMetric: (id: string, updates: Partial<PerformanceMetric>) => void;
  
  // Actions - Valuations
  addValuation: (valuation: Omit<Valuation, "id">) => string;
  approveValuation: (id: string, approver: string) => void;
  
  // Actions - Calculations
  calculateOwnership: () => void;
  calculateVesting: (shareholderId: string, date: Date) => { vested: number; unvested: number };
  generateCapTable: () => Promise<Blob>;
  
  // Actions - UI
  setActiveRound: (id: string | null) => void;
  setSelectedShareholder: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCapTabStore = create<CapTabStoreState>()(
  persist(
    (set, get) => ({
      shareholders: {},
      investmentRounds: {},
      equityPools: {},
      performanceMetrics: {},
      valuations: {},
      
      companyInfo: {
        name: "Founder's Office Inc.",
        totalShares: 10000000,
        authorizedShares: 15000000,
        parValue: 0.001,
        incorporationDate: new Date(),
      },
      
      activeRoundId: null,
      selectedShareholderId: null,

      addShareholder: (shareholder) => {
        const id = generateId();
        const newShareholder: Shareholder = {
          ...shareholder,
          id,
          lastUpdated: new Date(),
        };
        
        set((state) => ({
          shareholders: { ...state.shareholders, [id]: newShareholder },
          selectedShareholderId: id,
        }));
        
        return id;
      },

      updateShareholder: (id, updates) => {
        set((state) => ({
          shareholders: {
            ...state.shareholders,
            [id]: { ...state.shareholders[id], ...updates, lastUpdated: new Date() },
          },
        }));
      },

      removeShareholder: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.shareholders;
          return {
            shareholders: remaining,
            selectedShareholderId: state.selectedShareholderId === id ? null : state.selectedShareholderId,
          };
        });
      },

      createRound: (round) => {
        const id = generateId();
        const newRound: InvestmentRound = { ...round, id, investors: [] };
        
        set((state) => ({
          investmentRounds: { ...state.investmentRounds, [id]: newRound },
          activeRoundId: id,
        }));
        
        return id;
      },

      updateRound: (id, updates) => {
        set((state) => ({
          investmentRounds: {
            ...state.investmentRounds,
            [id]: { ...state.investmentRounds[id], ...updates },
          },
        }));
      },

      closeRound: (id) => {
        set((state) => ({
          investmentRounds: {
            ...state.investmentRounds,
            [id]: { ...state.investmentRounds[id], status: "completed", closeDate: new Date() },
          },
        }));
      },

      addInvestorToRound: (roundId, investor) => {
        set((state) => ({
          investmentRounds: {
            ...state.investmentRounds,
            [roundId]: {
              ...state.investmentRounds[roundId],
              investors: [...state.investmentRounds[roundId].investors, investor],
              raisedAmount: state.investmentRounds[roundId].raisedAmount + investor.investmentAmount,
            },
          },
        }));
      },

      createEquityPool: (pool) => {
        const id = generateId();
        const newPool: EquityPool = { ...pool, id, createdAt: new Date() };
        
        set((state) => ({
          equityPools: { ...state.equityPools, [id]: newPool },
        }));
        
        return id;
      },

      allocateEquity: (poolId, shareholderId, shares) => {
        set((state) => ({
          equityPools: {
            ...state.equityPools,
            [poolId]: {
              ...state.equityPools[poolId],
              allocatedShares: state.equityPools[poolId].allocatedShares + shares,
              availableShares: state.equityPools[poolId].availableShares - shares,
            },
          },
        }));
      },

      addMetric: (metric) => {
        const id = generateId();
        const newMetric: PerformanceMetric = { ...metric, id };
        
        set((state) => ({
          performanceMetrics: { ...state.performanceMetrics, [id]: newMetric },
        }));
        
        return id;
      },

      updateMetric: (id, updates) => {
        set((state) => ({
          performanceMetrics: {
            ...state.performanceMetrics,
            [id]: { ...state.performanceMetrics[id], ...updates },
          },
        }));
      },

      addValuation: (valuation) => {
        const id = generateId();
        const newValuation: Valuation = { ...valuation, id, approved: false };
        
        set((state) => ({
          valuations: { ...state.valuations, [id]: newValuation },
        }));
        
        return id;
      },

      approveValuation: (id, approver) => {
        set((state) => ({
          valuations: {
            ...state.valuations,
            [id]: { ...state.valuations[id], approved: true, approvedBy: approver },
          },
        }));
      },

      calculateOwnership: () => {
        const { shareholders, companyInfo } = get();
        const totalShares = companyInfo.totalShares;
        
        Object.values(shareholders).forEach(shareholder => {
          const ownership = (shareholder.totalShares / totalShares) * 100;
          get().updateShareholder(shareholder.id, { currentOwnership: ownership });
        });
      },

      calculateVesting: (shareholderId, date) => {
        const shareholder = get().shareholders[shareholderId];
        if (!shareholder) return { vested: 0, unvested: 0 };
        
        // Simplified vesting calculation
        const monthsSinceJoin = Math.floor(
          (date.getTime() - shareholder.joinDate.getTime()) / (30 * 24 * 60 * 60 * 1000)
        );
        
        const vestingPeriod = 48; // 4 years
        const cliffPeriod = 12; // 1 year cliff
        
        if (monthsSinceJoin < cliffPeriod) {
          return { vested: 0, unvested: shareholder.totalShares };
        }
        
        const vestedPercentage = Math.min(monthsSinceJoin / vestingPeriod, 1);
        const vested = Math.floor(shareholder.totalShares * vestedPercentage);
        const unvested = shareholder.totalShares - vested;
        
        return { vested, unvested };
      },

      generateCapTable: async () => {
        console.log("Generating cap table...");
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const { shareholders, companyInfo } = get();
        const data = {
          company: companyInfo,
          shareholders: Object.values(shareholders),
          generatedAt: new Date(),
        };
        
        return new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      },

      setActiveRound: (id) => {
        set({ activeRoundId: id });
      },

      setSelectedShareholder: (id) => {
        set({ selectedShareholderId: id });
      },
    }),
    {
      name: "captab-store",
      version: 1,
    }
  )
);