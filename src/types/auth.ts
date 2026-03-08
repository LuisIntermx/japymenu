export interface User {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  lastLogin?: Date;
}

export interface SavedAccount {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  lastLogin: Date;
  isActive: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  savedAccounts: SavedAccount[];
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  selectAccount: (accountId: string) => Promise<boolean>;
  saveAccount: (user: User) => void;
  removeAccount: (accountId: string) => void;
  checkAuth: () => void;
}
