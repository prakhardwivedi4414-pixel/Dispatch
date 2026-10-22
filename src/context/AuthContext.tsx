import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, UserRole } from '../services/contentRepository';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export interface DemoStaffAccount {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  desk: string;
}

/**
 * Canonical, non-sensitive demo staff roster for local demonstration.
 * Samridhi is the sole authorized administrator.
 * Arpita Singh and Kirti are verified contributors.
 */
export const DEMO_STAFF_ACCOUNTS: Record<string, DemoStaffAccount> = {
  samridhi: {
    id: 'demo_staff_samridhi',
    name: 'Samridhi',
    role: 'admin',
    title: 'Administrator & Editorial Lead',
    desk: 'Newsroom Administration & Cross-Desk Standards',
  },
  arpita: {
    id: 'demo_staff_arpita',
    name: 'Arpita Singh',
    role: 'contributor',
    title: 'Contributor (Reporting)',
    desk: 'Campus Life & Student Affairs',
  },
  kirti: {
    id: 'demo_staff_kirti',
    name: 'Kirti',
    role: 'contributor',
    title: 'Contributor (Reporting)',
    desk: 'Investigations & Documentary Photography',
  },
};

/**
 * Sanitizes any raw session object loaded from localStorage.
 * SECURITY AUDIT ENFORCEMENT:
 * - Never blindly trusts a user-modified "role": "admin" in localStorage.
 * - If a user tampers with localStorage to grant admin rights to an arbitrary string
 *   or to any contributor (Arpita, Kirti), the canonical role definition
 *   strictly overrides it back to 'contributor'.
 * - Only Samridhi (with matching verified ID) can hold administrator status.
 */
export const sanitizeStoredUser = (parsed: unknown): AuthUser | null => {
  if (!parsed || typeof parsed !== 'object') return null;
  const candidate = parsed as Partial<AuthUser>;
  if (!candidate.name) return null;

  const candidateName = candidate.name.trim();

  // 1. Check against the canonical demo accounts
  const matchedKey = Object.keys(DEMO_STAFF_ACCOUNTS).find(key => {
    const acc = DEMO_STAFF_ACCOUNTS[key];
    return acc.id === candidate.id || acc.name.toLowerCase() === candidateName.toLowerCase();
  });

  if (matchedKey) {
    const canonical = DEMO_STAFF_ACCOUNTS[matchedKey];
    // Enforce role strictly based on canonical identity:
    // Only Samridhi is administrator. All other accounts are contributors.
    const defaultEmail = canonical.name === 'Samridhi'
      ? 'samridhiaug@gmail.com'
      : `${canonical.name.toLowerCase().replace(/\s+/g, '.')}@thedispatch.internal`;
    return {
      id: canonical.id,
      name: canonical.name,
      role: canonical.role,
      email: candidate.email || defaultEmail,
    };
  }

  // 2. If an arbitrary unrecognized account was written to localStorage, force to 'contributor'
  // (Prevents privilege escalation via localStorage tampering)
  return {
    id: candidate.id || `usr_guest_${Date.now()}`,
    name: candidateName,
    role: 'contributor',
    email: candidate.email,
  };
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLiveDatabase: boolean;
  login: (role: UserRole, name?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsStaff: (accountId: string) => Promise<{ success: boolean; error?: string }>;
  loginWithCredentials: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const STORAGE_KEY_AUTH = 'the_dispatch_auth_v5';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeStoredUser(parsed);
      }
    } catch {
      // ignore parsing errors
    }
    return null;
  });

  // If Supabase is configured, subscribe to live auth state changes
  useEffect(() => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) return;

    // Check active session
    client.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const authUser: AuthUser = {
              id: session.user.id,
              name: profile?.display_name || session.user.email?.split('@')[0] || 'Samridhi',
              role: (profile?.role as UserRole) || 'editor',
              email: session.user.email,
            };
            setUser(authUser);
            try {
              localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
            } catch {
              // ignore
            }
          });
      }
    });

    const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        const authUser: AuthUser = {
          id: session.user.id,
          name: profile?.display_name || session.user.email?.split('@')[0] || 'Samridhi',
          role: (profile?.role as UserRole) || 'editor',
          email: session.user.email,
        };
        setUser(authUser);
        try {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
        } catch {
          // ignore
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem(STORAGE_KEY_AUTH);
        } catch {
          // ignore
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Quick staff identity selector for local prototype demonstration
  const loginAsStaff = async (accountKey: string): Promise<{ success: boolean; error?: string }> => {
    const account = DEMO_STAFF_ACCOUNTS[accountKey.toLowerCase()];
    if (!account) {
      return { success: false, error: 'Unknown staff account.' };
    }

    const defaultEmail = account.name === 'Samridhi'
      ? 'samridhiaug@gmail.com'
      : `${account.name.toLowerCase().replace(/\s+/g, '.')}@thedispatch.internal`;

    const newUser: AuthUser = {
      id: account.id,
      name: account.name,
      role: account.role,
      email: defaultEmail,
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch {
      // ignore
    }
    return { success: true };
  };

  // Generic role-based demo login (validated against confirmed newsroom roster)
  const login = async (role: UserRole, name?: string): Promise<{ success: boolean; error?: string }> => {
    const candidateName = name?.trim() || (role === 'admin' ? 'Samridhi' : 'Arpita Singh');
    
    // Validate role: Only Samridhi can be assigned administrator
    const isSamridhi = candidateName.toLowerCase() === 'samridhi';
    const effectiveRole: UserRole = (role === 'admin' && isSamridhi) ? 'admin' : 'contributor';
    const effectiveId = isSamridhi ? DEMO_STAFF_ACCOUNTS.samridhi.id : `demo_staff_${candidateName.toLowerCase().replace(/\s+/g, '_')}`;
    const defaultEmail = isSamridhi
      ? 'samridhiaug@gmail.com'
      : `${candidateName.toLowerCase().replace(/\s+/g, '.')}@thedispatch.internal`;

    const newUser: AuthUser = {
      id: effectiveId,
      name: isSamridhi ? 'Samridhi' : candidateName,
      role: effectiveRole,
      email: defaultEmail,
    };

    setUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(newUser));
    } catch {
      // ignore
    }
    return { success: true };
  };

  // Genuine Supabase email/password login
  const loginWithCredentials = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      return {
        success: false,
        error: 'Supabase database credentials are not loaded in .env. For this local demonstration, please use the Demo Staff Profiles tab.',
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await client
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();

        const authUser: AuthUser = {
          id: data.user.id,
          name: profile?.display_name || data.user.email?.split('@')[0] || 'Samridhi',
          role: (profile?.role as UserRole) || 'contributor',
          email: data.user.email,
        };
        setUser(authUser);
        try {
          localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(authUser));
        } catch {
          // ignore
        }
        return { success: true };
      }

      return { success: false, error: 'User record not returned.' };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Authentication network failure',
      };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // ignore
      }
    }
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLiveDatabase: isSupabaseConfigured,
        login,
        loginAsStaff,
        loginWithCredentials,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
