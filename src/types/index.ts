export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male';
  country: string;
  countryCode: string;
  flag: string;
  avatar: string;
  videoUrl?: string;
  bio: string;
  followers: number;
  following: number;
  friends: number;
  level: number;
  isLive: boolean;
  viewersCount: number;
  tags: string[];
  sampleResponses: string[];
  photos?: string[];
  statusLang?: string;
  statusTitle?: string;
  coinScore?: string;
  ethnicity?: 'South Asian' | 'East Asian' | 'White' | 'Black' | 'Middle Eastern' | 'Latino';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'partner' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  animationType: 'hearts' | 'rose' | 'crown' | 'car' | 'rocket' | 'fireworks';
}

export interface DirectMessageThread {
  id: string;
  userId: string;
  user: UserProfile;
  unreadCount: number;
  lastMessage: string;
  lastTime: string;
  messages: {
    id: string;
    sender: 'user' | 'them';
    text: string;
    time: string;
  }[];
}

export interface CountryItem {
  code: string;
  name: string;
  flag: string;
  activeCount: number;
}
