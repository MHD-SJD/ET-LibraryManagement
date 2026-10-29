import React, { createContext, useContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { apiRequest } from '../lib/api';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const syncProfile = async (firebaseUser, details) => {
    const token = await firebaseUser.getIdToken();
    const profile = await apiRequest('/users/me', { method: 'POST', token });
    return details ? apiRequest('/users/me', { method: 'PATCH', token, body: details }) : profile;
  };

  useEffect(() => onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) { setUser(null); setLoading(false); return; }
    try { setUser(await syncProfile(firebaseUser)); }
    catch (error) { console.error('Unable to load library profile:', error); setUser(null); }
    finally { setLoading(false); }
  }), []);

  const login = async ({ email, password }) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const profile = await syncProfile(credential.user);
    setUser(profile);
    return profile;
  };
  const register = async ({ name, email, password, phone, address }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(credential.user, { displayName: name });
    const profile = await syncProfile(credential.user, { name, phone, address });
    setUser(profile);
    return profile;
  };
  const updateLibraryProfile = async (details) => {
    const profile = await apiRequest('/users/me', { method: 'PATCH', token: await auth.currentUser.getIdToken(), body: details });
    setUser(profile);
    return profile;
  };

  return <AuthContext.Provider value={{ user, loading, isAuthenticated: Boolean(user), isAdmin: user?.role === 'admin', role: user?.role || 'guest', login, register, updateLibraryProfile, logout: () => signOut(auth), getToken: () => auth.currentUser?.getIdToken() }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
