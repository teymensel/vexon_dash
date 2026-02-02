export interface Command {
  name: string;
  description: string;
  category: 'Moderation' | 'Fun' | 'Utility' | 'Economy';
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
  buttonText: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: any;
}

export interface Server {
  id: string;
  name: string;
  icon?: string;
  permission: 'Owner' | 'Admin';
  hasBot: boolean;
}

export interface User {
  username: string;
  discriminator: string;
  avatar?: string;
}

export interface DashboardModule {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: 'Management' | 'Tools' | 'Social' | 'Fun' | 'Monetization' | 'Web3' | 'Security';
  isPremium?: boolean;
  isNew?: boolean;
  isLocked?: boolean;
  isEnabled?: boolean;
}

export interface GuildSettings {
  guild_id: string;
  name: string;
  modules: Record<string, boolean>;
  config: Record<string, any>;
}