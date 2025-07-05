import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Assessment {
  id: string;
  name: string;
  type: "cultural" | "performance" | "360-feedback" | "engagement" | "onboarding";
  status: "draft" | "active" | "completed" | "archived";
  questions: Question[];
  participants: Participant[];
  results: AssessmentResult[];
  createdAt: Date;
  dueDate?: Date;
}

export interface Question {
  id: string;
  text: string;
  type: "scale" | "multiple-choice" | "text" | "yes-no";
  options?: string[];
  required: boolean;
  category: string;
}

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "invited" | "in-progress" | "completed";
  invitedAt: Date;
  completedAt?: Date;
}

export interface AssessmentResult {
  id: string;
  participantId: string;
  responses: { [questionId: string]: any };
  score?: number;
  feedback?: string;
  submittedAt: Date;
}

export interface CulturalInsight {
  id: string;
  category: string;
  metric: string;
  value: number;
  trend: "improving" | "declining" | "stable";
  description: string;
  recommendations: string[];
  generatedAt: Date;
}

export interface CulturalStoreState {
  assessments: { [id: string]: Assessment };
  insights: { [id: string]: CulturalInsight };
  activeAssessmentId: string | null;
  
  createAssessment: (assessment: Omit<Assessment, "id" | "createdAt">) => string;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  deleteAssessment: (id: string) => void;
  
  addParticipant: (assessmentId: string, participant: Omit<Participant, "id" | "invitedAt">) => string;
  removeParticipant: (assessmentId: string, participantId: string) => void;
  
  submitResponse: (assessmentId: string, participantId: string, responses: { [questionId: string]: any }) => string;
  
  generateInsights: (assessmentId: string) => Promise<void>;
  
  setActiveAssessment: (id: string | null) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCulturalStore = create<CulturalStoreState>()(
  persist(
    (set, get) => ({
      assessments: {},
      insights: {},
      activeAssessmentId: null,

      createAssessment: (assessment) => {
        const id = generateId();
        const newAssessment: Assessment = {
          ...assessment,
          id,
          createdAt: new Date(),
          participants: [],
          results: [],
        };
        
        set((state) => ({
          assessments: { ...state.assessments, [id]: newAssessment },
          activeAssessmentId: id,
        }));
        
        return id;
      },

      updateAssessment: (id, updates) => {
        set((state) => ({
          assessments: {
            ...state.assessments,
            [id]: { ...state.assessments[id], ...updates },
          },
        }));
      },

      deleteAssessment: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.assessments;
          return {
            assessments: remaining,
            activeAssessmentId: state.activeAssessmentId === id ? null : state.activeAssessmentId,
          };
        });
      },

      addParticipant: (assessmentId, participant) => {
        const id = generateId();
        const newParticipant: Participant = {
          ...participant,
          id,
          invitedAt: new Date(),
          status: "invited",
        };
        
        set((state) => ({
          assessments: {
            ...state.assessments,
            [assessmentId]: {
              ...state.assessments[assessmentId],
              participants: [...state.assessments[assessmentId].participants, newParticipant],
            },
          },
        }));
        
        return id;
      },

      removeParticipant: (assessmentId, participantId) => {
        set((state) => ({
          assessments: {
            ...state.assessments,
            [assessmentId]: {
              ...state.assessments[assessmentId],
              participants: state.assessments[assessmentId].participants.filter(p => p.id !== participantId),
            },
          },
        }));
      },

      submitResponse: (assessmentId, participantId, responses) => {
        const id = generateId();
        const result: AssessmentResult = {
          id,
          participantId,
          responses,
          submittedAt: new Date(),
        };
        
        set((state) => ({
          assessments: {
            ...state.assessments,
            [assessmentId]: {
              ...state.assessments[assessmentId],
              results: [...state.assessments[assessmentId].results, result],
              participants: state.assessments[assessmentId].participants.map(p =>
                p.id === participantId 
                  ? { ...p, status: "completed", completedAt: new Date() }
                  : p
              ),
            },
          },
        }));
        
        return id;
      },

      generateInsights: async (assessmentId) => {
        console.log("Generating insights for assessment:", assessmentId);
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate sample insights
        const insights = [
          {
            id: generateId(),
            category: "Engagement",
            metric: "Overall Satisfaction",
            value: 7.8,
            trend: "improving" as const,
            description: "Employee satisfaction has increased by 12% compared to last quarter",
            recommendations: [
              "Continue current engagement initiatives",
              "Focus on work-life balance improvements",
            ],
            generatedAt: new Date(),
          },
          {
            id: generateId(),
            category: "Communication",
            metric: "Team Collaboration",
            value: 6.9,
            trend: "stable" as const,
            description: "Team collaboration scores remain consistent",
            recommendations: [
              "Implement better communication tools",
              "Increase cross-team interactions",
            ],
            generatedAt: new Date(),
          },
        ];
        
        set((state) => ({
          insights: {
            ...state.insights,
            ...insights.reduce((acc, insight) => ({ ...acc, [insight.id]: insight }), {}),
          },
        }));
      },

      setActiveAssessment: (id) => {
        set({ activeAssessmentId: id });
      },
    }),
    {
      name: "cultural-store",
      version: 1,
    }
  )
);