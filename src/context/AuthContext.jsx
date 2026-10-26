import React, { createContext, useContext, useState, useEffect } from 'react';
import { DEMO_ADMIN, DEMO_MEMBER } from '../data/mockUsers';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('auralib_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Julian Thorne' || parsed.name === 'Dr. Eleanor Vance') {
          return DEMO_MEMBER;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse saved user', e);
    }
    // Default to null so new sessions start logged out and see Sign In / Login
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('auralib_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('auralib_auth_user');
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  const loginDemo = (role = 'member') => {
    if (role === 'admin') {
      setUser(DEMO_ADMIN);
      return DEMO_ADMIN;
    } else {
      setUser(DEMO_MEMBER);
      return DEMO_MEMBER;
    }
  };

  const login = ({ email, password, role = 'member' }) => {
    if (role === 'admin') {
      const adminUser = {
        ...DEMO_ADMIN,
        email: email || DEMO_ADMIN.email
      };
      setUser(adminUser);
      return { success: true, user: adminUser };
    } else {
      const memberUser = {
        ...DEMO_MEMBER,
        name: email.split('@')[0].replace('.', ' ').replace(/^./, str => str.toUpperCase()),
        email: email || DEMO_MEMBER.email,
        role: 'member'
      };
      setUser(memberUser);
      return { success: true, user: memberUser };
    }
  };

  const register = (registrationData) => {
    const newUser = {
      id: `user-member-${Date.now()}`,
      name: registrationData.name,
      email: registrationData.email,
      role: 'member',
      membershipId: `AL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?auto=format&fit=crop&q=80&w=200`,
      phone: registrationData.phone || '+1 (555) 000-0000',
      address: registrationData.address || 'Member Residence',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      maxBorrowLimit: 5
    };
    setUser(newUser);
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole) => {
    if (newRole === 'admin') {
      setUser(DEMO_ADMIN);
    } else {
      setUser(DEMO_MEMBER);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        role: user?.role || 'guest',
        loginDemo,
        login,
        register,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
