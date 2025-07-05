import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types for Team functionality
export interface Team {
  id: string;
  name: string;
  description: string;
  type: "general" | "project" | "department" | "external";
  privacy: "public" | "private";
  members: TeamMember[];
  channels: Channel[];
  apps: TeamApp[];
  settings: TeamSettings;
  createdAt: Date;
  updatedAt: Date;
  avatar?: string;
  tags: string[];
}

export interface TeamMember {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  role: "owner" | "admin" | "member" | "guest";
  status: "active" | "inactive" | "busy" | "away" | "do-not-disturb";
  avatar?: string;
  title?: string;
  department?: string;
  lastActive: Date;
  permissions: TeamPermission[];
}

export interface TeamPermission {
  action: string;
  resource: string;
  allowed: boolean;
}

export interface Channel {
  id: string;
  teamId: string;
  name: string;
  description: string;
  type: "standard" | "private" | "shared";
  isFavorite: boolean;
  isMuted: boolean;
  messages: Message[];
  members: string[];
  tabs: ChannelTab[];
  settings: ChannelSettings;
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  unreadCount: number;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "file" | "image" | "system" | "call" | "meeting";
  timestamp: Date;
  editedAt?: Date;
  replyToId?: string;
  reactions: MessageReaction[];
  attachments: MessageAttachment[];
  mentions: string[];
  isDeleted: boolean;
  isImportant: boolean;
  threadId?: string;
  threadReplies?: Message[];
}

export interface MessageReaction {
  emoji: string;
  users: string[];
  count: number;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  thumbnail?: string;
  isInline: boolean;
}

export interface ChannelTab {
  id: string;
  name: string;
  type: "files" | "wiki" | "planner" | "app" | "website" | "notebook";
  url?: string;
  appId?: string;
  settings: any;
  isDefault: boolean;
  order: number;
}

export interface ChannelSettings {
  allowGuestAccess: boolean;
  allowMentions: boolean;
  allowCustomMemes: boolean;
  allowGifs: boolean;
  allowStickers: boolean;
  messageDeletion: "owner" | "everyone" | "none";
  notificationSettings: NotificationSettings;
}

export interface NotificationSettings {
  mentions: boolean;
  allMessages: boolean;
  replies: boolean;
  reactions: boolean;
  customKeywords: string[];
  scheduleEnabled: boolean;
  quietHours: { start: string; end: string } | null;
}

export interface TeamSettings {
  guestAccess: boolean;
  allowMembersToCreateChannels: boolean;
  allowMembersToDeleteChannels: boolean;
  allowMembersToAddApps: boolean;
  allowCustomMemes: boolean;
  showMemberJoinLeaveMessages: boolean;
  discoverability: "public" | "private" | "hidden";
  allowTeamMentions: boolean;
  funStuffEnabled: boolean;
}

export interface TeamApp {
  id: string;
  name: string;
  description: string;
  type: "tab" | "bot" | "messaging-extension" | "connector";
  isEnabled: boolean;
  configuration: any;
  permissions: string[];
  addedBy: string;
  addedAt: Date;
  icon?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  organizer: string;
  participants: MeetingParticipant[];
  startTime: Date;
  endTime: Date;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  location?: string;
  isOnline: boolean;
  meetingUrl?: string;
  dialInNumbers?: string[];
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  agenda?: string;
  notes?: string;
  recordings?: MeetingRecording[];
  chatTranscript?: string;
}

export interface MeetingParticipant {
  userId: string;
  displayName: string;
  email: string;
  role: "organizer" | "presenter" | "attendee";
  status: "accepted" | "declined" | "tentative" | "no-response";
  joinedAt?: Date;
  leftAt?: Date;
}

export interface RecurrencePattern {
  type: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  daysOfWeek?: string[];
  dayOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
}

export interface MeetingRecording {
  id: string;
  title: string;
  url: string;
  duration: number;
  createdAt: Date;
  size: number;
  hasTranscript: boolean;
  transcriptUrl?: string;
}

export interface Activity {
  id: string;
  type: "message" | "file-upload" | "meeting" | "call" | "channel-created" | "member-added" | "app-installed";
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
  teamId?: string;
  channelId?: string;
  data?: any;
}

export interface TeamStoreState {
  // Data
  teams: { [id: string]: Team };
  meetings: { [id: string]: Meeting };
  activities: Activity[];
  
  // Current state
  activeTeamId: string | null;
  activeChannelId: string | null;
  selectedMessageIds: string[];
  currentView: "teams" | "calendar" | "calls" | "files" | "activity";
  
  // UI state
  sidebarCollapsed: boolean;
  chatPanelOpen: boolean;
  searchQuery: string;
  searchResults: any[];
  isSearching: boolean;
  
  // User state
  currentUser: TeamMember | null;
  presenceStatus: TeamMember["status"];
  statusMessage: string;
  
  // Notifications
  notifications: Notification[];
  unreadCount: number;
  
  // Settings
  notificationSettings: NotificationSettings;
  appearanceSettings: AppearanceSettings;
  
  // Actions - Teams
  createTeam: (team: Omit<Team, "id" | "createdAt" | "updatedAt">) => string;
  updateTeam: (id: string, updates: Partial<Team>) => void;
  deleteTeam: (id: string) => void;
  joinTeam: (teamId: string, userId: string) => void;
  leaveTeam: (teamId: string, userId: string) => void;
  
  // Actions - Channels
  createChannel: (teamId: string, channel: Omit<Channel, "id" | "teamId" | "createdAt" | "updatedAt">) => string;
  updateChannel: (id: string, updates: Partial<Channel>) => void;
  deleteChannel: (id: string) => void;
  favoriteChannel: (channelId: string, favorite: boolean) => void;
  muteChannel: (channelId: string, muted: boolean) => void;
  
  // Actions - Messages
  sendMessage: (channelId: string, message: Omit<Message, "id" | "timestamp" | "reactions" | "isDeleted">) => string;
  editMessage: (messageId: string, content: string) => void;
  deleteMessage: (messageId: string) => void;
  reactToMessage: (messageId: string, emoji: string, userId: string) => void;
  replyToMessage: (messageId: string, reply: Omit<Message, "id" | "timestamp" | "reactions" | "isDeleted">) => void;
  
  // Actions - Meetings
  createMeeting: (meeting: Omit<Meeting, "id">) => string;
  updateMeeting: (id: string, updates: Partial<Meeting>) => void;
  deleteMeeting: (id: string) => void;
  joinMeeting: (meetingId: string, userId: string) => void;
  leaveMeeting: (meetingId: string, userId: string) => void;
  
  // Actions - UI
  setActiveTeam: (teamId: string | null) => void;
  setActiveChannel: (channelId: string | null) => void;
  setCurrentView: (view: TeamStoreState["currentView"]) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setChatPanelOpen: (open: boolean) => void;
  
  // Actions - Search
  search: (query: string) => Promise<void>;
  clearSearch: () => void;
  
  // Actions - User
  setCurrentUser: (user: TeamMember) => void;
  setPresenceStatus: (status: TeamMember["status"]) => void;
  setStatusMessage: (message: string) => void;
  
  // Actions - Notifications
  addNotification: (notification: Omit<Notification, "id">) => void;
  removeNotification: (id: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  
  // Actions - Import/Export
  exportTeamData: (teamId: string) => Promise<Blob>;
  importTeamData: (data: any) => Promise<void>;
}

export interface Notification {
  id: string;
  type: "mention" | "message" | "meeting" | "channel" | "team" | "app";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  data?: any;
}

export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  compact: boolean;
  fontSize: "small" | "medium" | "large";
  showAvatars: boolean;
  animationsEnabled: boolean;
  soundEnabled: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const createDefaultTeam = (): Team => ({
  id: generateId(),
  name: "General",
  description: "Default team for general discussions",
  type: "general",
  privacy: "public",
  members: [],
  channels: [],
  apps: [],
  settings: {
    guestAccess: false,
    allowMembersToCreateChannels: true,
    allowMembersToDeleteChannels: false,
    allowMembersToAddApps: true,
    allowCustomMemes: true,
    showMemberJoinLeaveMessages: true,
    discoverability: "public",
    allowTeamMentions: true,
    funStuffEnabled: true,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  tags: [],
});

const createDefaultChannel = (teamId: string): Channel => ({
  id: generateId(),
  teamId,
  name: "General",
  description: "General discussion channel",
  type: "standard",
  isFavorite: false,
  isMuted: false,
  messages: [],
  members: [],
  tabs: [],
  settings: {
    allowGuestAccess: false,
    allowMentions: true,
    allowCustomMemes: true,
    allowGifs: true,
    allowStickers: true,
    messageDeletion: "owner",
    notificationSettings: {
      mentions: true,
      allMessages: false,
      replies: true,
      reactions: true,
      customKeywords: [],
      scheduleEnabled: false,
      quietHours: null,
    },
  },
  createdAt: new Date(),
  updatedAt: new Date(),
  unreadCount: 0,
});

export const useTeamStore = create<TeamStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      teams: {},
      meetings: {},
      activities: [],
      
      activeTeamId: null,
      activeChannelId: null,
      selectedMessageIds: [],
      currentView: "teams",
      
      sidebarCollapsed: false,
      chatPanelOpen: true,
      searchQuery: "",
      searchResults: [],
      isSearching: false,
      
      currentUser: null,
      presenceStatus: "active",
      statusMessage: "",
      
      notifications: [],
      unreadCount: 0,
      
      notificationSettings: {
        mentions: true,
        allMessages: false,
        replies: true,
        reactions: true,
        customKeywords: [],
        scheduleEnabled: false,
        quietHours: null,
      },
      
      appearanceSettings: {
        theme: "light",
        compact: false,
        fontSize: "medium",
        showAvatars: true,
        animationsEnabled: true,
        soundEnabled: true,
      },

      // Teams
      createTeam: (team) => {
        const id = generateId();
        const newTeam: Team = {
          ...team,
          id,
          createdAt: new Date(),
          updatedAt: new Date(),
          channels: [createDefaultChannel(id)],
        };
        
        set((state) => ({
          teams: {
            ...state.teams,
            [id]: newTeam,
          },
        }));
        
        return id;
      },

      updateTeam: (id, updates) => {
        set((state) => ({
          teams: {
            ...state.teams,
            [id]: {
              ...state.teams[id],
              ...updates,
              updatedAt: new Date(),
            },
          },
        }));
      },

      deleteTeam: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.teams;
          return {
            teams: remaining,
            activeTeamId: state.activeTeamId === id ? null : state.activeTeamId,
          };
        });
      },

      joinTeam: (teamId, userId) => {
        // Logic to add user to team
        console.log("Joining team:", teamId, "user:", userId);
      },

      leaveTeam: (teamId, userId) => {
        // Logic to remove user from team
        console.log("Leaving team:", teamId, "user:", userId);
      },

      // Channels
      createChannel: (teamId, channel) => {
        const id = generateId();
        const newChannel: Channel = {
          ...channel,
          id,
          teamId,
          createdAt: new Date(),
          updatedAt: new Date(),
          messages: [],
          members: [],
          tabs: [],
          unreadCount: 0,
        };
        
        set((state) => ({
          teams: {
            ...state.teams,
            [teamId]: {
              ...state.teams[teamId],
              channels: [...state.teams[teamId].channels, newChannel],
              updatedAt: new Date(),
            },
          },
        }));
        
        return id;
      },

      updateChannel: (id, updates) => {
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            const channelIndex = team.channels.findIndex(c => c.id === id);
            if (channelIndex !== -1) {
              team.channels[channelIndex] = {
                ...team.channels[channelIndex],
                ...updates,
                updatedAt: new Date(),
              };
            }
          });
          return { teams: updatedTeams };
        });
      },

      deleteChannel: (id) => {
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            team.channels = team.channels.filter(c => c.id !== id);
          });
          return {
            teams: updatedTeams,
            activeChannelId: state.activeChannelId === id ? null : state.activeChannelId,
          };
        });
      },

      favoriteChannel: (channelId, favorite) => {
        get().updateChannel(channelId, { isFavorite: favorite });
      },

      muteChannel: (channelId, muted) => {
        get().updateChannel(channelId, { isMuted: muted });
      },

      // Messages
      sendMessage: (channelId, message) => {
        const id = generateId();
        const newMessage: Message = {
          ...message,
          id,
          timestamp: new Date(),
          reactions: [],
          isDeleted: false,
        };
        
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            const channelIndex = team.channels.findIndex(c => c.id === channelId);
            if (channelIndex !== -1) {
              team.channels[channelIndex].messages.push(newMessage);
              team.channels[channelIndex].lastMessageAt = new Date();
              team.channels[channelIndex].updatedAt = new Date();
            }
          });
          return { teams: updatedTeams };
        });
        
        return id;
      },

      editMessage: (messageId, content) => {
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            team.channels.forEach(channel => {
              const messageIndex = channel.messages.findIndex(m => m.id === messageId);
              if (messageIndex !== -1) {
                channel.messages[messageIndex] = {
                  ...channel.messages[messageIndex],
                  content,
                  editedAt: new Date(),
                };
              }
            });
          });
          return { teams: updatedTeams };
        });
      },

      deleteMessage: (messageId) => {
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            team.channels.forEach(channel => {
              const messageIndex = channel.messages.findIndex(m => m.id === messageId);
              if (messageIndex !== -1) {
                channel.messages[messageIndex].isDeleted = true;
              }
            });
          });
          return { teams: updatedTeams };
        });
      },

      reactToMessage: (messageId, emoji, userId) => {
        set((state) => {
          const updatedTeams = { ...state.teams };
          Object.keys(updatedTeams).forEach(teamId => {
            const team = updatedTeams[teamId];
            team.channels.forEach(channel => {
              const messageIndex = channel.messages.findIndex(m => m.id === messageId);
              if (messageIndex !== -1) {
                const message = channel.messages[messageIndex];
                const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
                if (reactionIndex !== -1) {
                  const reaction = message.reactions[reactionIndex];
                  if (reaction.users.includes(userId)) {
                    reaction.users = reaction.users.filter(u => u !== userId);
                    reaction.count--;
                  } else {
                    reaction.users.push(userId);
                    reaction.count++;
                  }
                  if (reaction.count === 0) {
                    message.reactions.splice(reactionIndex, 1);
                  }
                } else {
                  message.reactions.push({
                    emoji,
                    users: [userId],
                    count: 1,
                  });
                }
              }
            });
          });
          return { teams: updatedTeams };
        });
      },

      replyToMessage: (messageId, reply) => {
        const replyId = get().sendMessage(reply.channelId, {
          ...reply,
          replyToId: messageId,
        });
        return replyId;
      },

      // Meetings
      createMeeting: (meeting) => {
        const id = generateId();
        const newMeeting: Meeting = { ...meeting, id };
        
        set((state) => ({
          meetings: {
            ...state.meetings,
            [id]: newMeeting,
          },
        }));
        
        return id;
      },

      updateMeeting: (id, updates) => {
        set((state) => ({
          meetings: {
            ...state.meetings,
            [id]: { ...state.meetings[id], ...updates },
          },
        }));
      },

      deleteMeeting: (id) => {
        set((state) => {
          const { [id]: deleted, ...remaining } = state.meetings;
          return { meetings: remaining };
        });
      },

      joinMeeting: (meetingId, userId) => {
        console.log("Joining meeting:", meetingId, "user:", userId);
      },

      leaveMeeting: (meetingId, userId) => {
        console.log("Leaving meeting:", meetingId, "user:", userId);
      },

      // UI actions
      setActiveTeam: (teamId) => {
        set({ activeTeamId: teamId });
      },

      setActiveChannel: (channelId) => {
        set({ activeChannelId: channelId });
      },

      setCurrentView: (view) => {
        set({ currentView: view });
      },

      setSidebarCollapsed: (collapsed) => {
        set({ sidebarCollapsed: collapsed });
      },

      setChatPanelOpen: (open) => {
        set({ chatPanelOpen: open });
      },

      // Search
      search: async (query) => {
        set({ isSearching: true, searchQuery: query });
        
        try {
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate search results
          const results = [
            { type: "message", content: "Search result 1" },
            { type: "file", content: "Search result 2" },
          ];
          
          set({ searchResults: results, isSearching: false });
        } catch (error) {
          set({ isSearching: false });
        }
      },

      clearSearch: () => {
        set({ searchQuery: "", searchResults: [], isSearching: false });
      },

      // User actions
      setCurrentUser: (user) => {
        set({ currentUser: user });
      },

      setPresenceStatus: (status) => {
        set({ presenceStatus: status });
      },

      setStatusMessage: (message) => {
        set({ statusMessage: message });
      },

      // Notifications
      addNotification: (notification) => {
        const id = generateId();
        const newNotification: Notification = { ...notification, id };
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0,
        }));
      },

      // Import/Export
      exportTeamData: async (teamId) => {
        const team = get().teams[teamId];
        if (!team) throw new Error("Team not found");
        
        const data = JSON.stringify(team, null, 2);
        return new Blob([data], { type: "application/json" });
      },

      importTeamData: async (data) => {
        console.log("Importing team data...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (data.teams) {
          set((state) => ({
            teams: { ...state.teams, ...data.teams },
          }));
        }
      },
    }),
    {
      name: "team-store",
      version: 1,
    }
  )
);