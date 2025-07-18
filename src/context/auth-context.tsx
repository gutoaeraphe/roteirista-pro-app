
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['gutoaeraphe@yahoo.com.br', 'atendimento@cmkfilmes.com'];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserProfile(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const newProfile = docSnap.data() as UserProfile;
        setUserProfile(newProfile);

      } else {
        const newUserProfile: UserProfile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photoURL: user.photoURL || '',
          isAdmin: ADMIN_EMAILS.includes(user.email || ''),
        };
        setDoc(userDocRef, newUserProfile).then(() => {
          setUserProfile(newUserProfile);
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) {
      toast({ title: "Erro", description: "Você precisa estar logado para atualizar o perfil.", variant: "destructive" });
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    try {
      await setDoc(userDocRef, data, { merge: true });
    } catch (error) {
      console.error("Error updating user profile:", error);
      toast({ title: "Erro", description: "Não foi possível atualizar seu perfil.", variant: "destructive" });
    }
  }, [user, toast]);


  return (
    <AuthContext.Provider value={{ user, userProfile, loading, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
