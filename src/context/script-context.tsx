
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Script } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, where, getDocs } from "firebase/firestore";

type ScriptContextType = {
  scripts: Script[];
  activeScript: Script | null;
  setActiveScript: (script: Script | null) => void;
  addScript: (script: Omit<Script, 'id' | 'analysis'>) => void;
  updateScript: (script: Script) => void;
  deleteScript: (scriptId: string) => void;
  getScriptById: (scriptId: string) => Script | undefined;
  loading: boolean;
};

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const ScriptProvider = ({ children }: { children: ReactNode }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScript, setActiveScriptState] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const getActiveScriptIdFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('activeScriptId');
    }
    return null;
  }
  
  const setActiveScriptIdInLocalStorage = (scriptId: string | null) => {
    if (typeof window !== 'undefined') {
        if (scriptId) {
            localStorage.setItem('activeScriptId', scriptId);
        } else {
            localStorage.removeItem('activeScriptId');
        }
    }
  }


  useEffect(() => {
    if (authLoading || !user) {
        setLoading(authLoading);
        if (!authLoading) {
            setScripts([]);
            setActiveScriptState(null);
        }
        return;
    }

    setLoading(true);
    const q = query(collection(db, "users", user.uid, "scripts"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scriptsData: Script[] = [];
      querySnapshot.forEach((doc) => {
        scriptsData.push({ id: doc.id, ...doc.data() } as Script);
      });
      setScripts(scriptsData);
      
      const activeScriptId = getActiveScriptIdFromLocalStorage();
      if (activeScriptId) {
          const foundActive = scriptsData.find(s => s.id === activeScriptId) || null;
          setActiveScriptState(foundActive);
      } else if (scriptsData.length > 0) {
          setActiveScriptState(scriptsData[0]);
          setActiveScriptIdInLocalStorage(scriptsData[0].id)
      } else {
          setActiveScriptState(null);
          setActiveScriptIdInLocalStorage(null)
      }

      setLoading(false);
    }, (error) => {
        console.error("Failed to fetch scripts from Firestore", error);
        toast({ title: "Erro", description: "Não foi possível carregar os roteiros.", variant: "destructive" });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [user, authLoading, toast]);
  
  const addScript = useCallback(async (scriptData: Omit<Script, 'id' | 'analysis'>) => {
    if (!user) {
        toast({ title: "Erro", description: "Você precisa estar logado para adicionar um roteiro.", variant: "destructive"});
        return;
    }
    try {
        const newDocRef = await addDoc(collection(db, "users", user.uid, "scripts"), {
            ...scriptData,
            analysis: {},
        });
        const newScript = { ...scriptData, id: newDocRef.id, analysis: {} };
        setActiveScriptState(newScript);
        setActiveScriptIdInLocalStorage(newScript.id);

    } catch(error) {
        console.error("Error adding script to Firestore", error);
        toast({ title: "Erro", description: "Não foi possível adicionar o roteiro.", variant: "destructive" });
    }
  }, [user, toast]);

  const updateScript = useCallback(async (updatedScript: Script) => {
    if (!user) return;
    const { id, ...dataToUpdate } = updatedScript;
    try {
        const scriptRef = doc(db, "users", user.uid, "scripts", id);
        await updateDoc(scriptRef, dataToUpdate);
        if (activeScript?.id === id) {
            setActiveScriptState(updatedScript);
        }
    } catch(error) {
        console.error("Error updating script in Firestore", error);
        toast({ title: "Erro", description: "Não foi possível salvar as alterações.", variant: "destructive" });
    }
  }, [user, activeScript?.id, toast]);

  const deleteScript = useCallback(async (scriptId: string) => {
    if (!user) return;
    try {
        await deleteDoc(doc(db, "users", user.uid, "scripts", scriptId));
        if (activeScript?.id === scriptId) {
            const remainingScripts = scripts.filter(s => s.id !== scriptId);
            const newActive = remainingScripts.length > 0 ? remainingScripts[0] : null;
            setActiveScriptState(newActive);
            setActiveScriptIdInLocalStorage(newActive?.id || null);
        }
        toast({ title: "Sucesso!", description: "Roteiro excluído." });
    } catch(error) {
        console.error("Error deleting script from Firestore", error);
        toast({ title: "Erro", description: "Não foi possível excluir o roteiro.", variant: "destructive" });
    }
  }, [user, activeScript?.id, scripts, toast]);

  const setActiveScript = (script: Script | null) => {
    setActiveScriptState(script);
    setActiveScriptIdInLocalStorage(script?.id || null);
  };
  
  const getScriptById = useCallback((scriptId: string) => {
      return scripts.find(s => s.id === scriptId);
  }, [scripts]);

  return (
    <ScriptContext.Provider value={{ scripts, activeScript, setActiveScript, addScript, updateScript, deleteScript, getScriptById, loading }}>
      {children}
    </ScriptContext.Provider>
  );
};

export const useScript = (): ScriptContextType => {
  const context = useContext(ScriptContext);
  if (context === undefined) {
    throw new Error('useScript must be used within a ScriptProvider');
  }
  return context;
};
