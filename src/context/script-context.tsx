"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Script } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

type ScriptContextType = {
  scripts: Script[];
  activeScript: Script | null;
  setActiveScript: (script: Script | null) => void;
  addScript: (script: Omit<Script, 'id' | 'analysis'>) => void;
  updateScript: (script: Script) => void;
  deleteScript: (scriptId: string) => void;
  loading: boolean;
};

const ScriptContext = createContext<ScriptContextType | undefined>(undefined);

export const ScriptProvider = ({ children }: { children: ReactNode }) => {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [activeScript, setActiveScriptState] = useState<Script | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedScripts = localStorage.getItem('scripts');
      const storedActiveScriptId = localStorage.getItem('activeScriptId');
      
      if (storedScripts) {
        const parsedScripts: Script[] = JSON.parse(storedScripts);
        setScripts(parsedScripts);

        if (storedActiveScriptId) {
          const foundActiveScript = parsedScripts.find(s => s.id === storedActiveScriptId) || null;
          setActiveScriptState(foundActiveScript);
        }
      }
    } catch (error) {
      console.error("Failed to load scripts from localStorage", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os roteiros salvos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveScripts = (newScripts: Script[], activeScriptId: string | null) => {
    try {
      localStorage.setItem('scripts', JSON.stringify(newScripts));
      if (activeScriptId) {
        localStorage.setItem('activeScriptId', activeScriptId);
      } else {
        localStorage.removeItem('activeScriptId');
      }
    } catch (error) {
      console.error("Failed to save scripts to localStorage", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o estado atual.",
        variant: "destructive",
      });
    }
  };
  
  const addScript = (scriptData: Omit<Script, 'id' | 'analysis'>) => {
    const newScript: Script = {
      ...scriptData,
      id: new Date().toISOString(),
      analysis: {},
    };
    const newScripts = [...scripts, newScript];
    setScripts(newScripts);
    setActiveScriptState(newScript);
    saveScripts(newScripts, newScript.id);
  };

  const updateScript = (updatedScript: Script) => {
    const newScripts = scripts.map(s => (s.id === updatedScript.id ? updatedScript : s));
    setScripts(newScripts);
    if(activeScript?.id === updatedScript.id) {
        setActiveScriptState(updatedScript);
    }
    saveScripts(newScripts, activeScript?.id || null);
  };

  const deleteScript = (scriptId: string) => {
    const newScripts = scripts.filter(s => s.id !== scriptId);
    setScripts(newScripts);
    if (activeScript?.id === scriptId) {
      const newActive = newScripts.length > 0 ? newScripts[0] : null;
      setActiveScriptState(newActive);
      saveScripts(newScripts, newActive?.id || null);
    } else {
      saveScripts(newScripts, activeScript?.id || null);
    }
  };

  const setActiveScript = (script: Script | null) => {
    setActiveScriptState(script);
    localStorage.setItem('activeScriptId', script?.id || '');
  };

  return (
    <ScriptContext.Provider value={{ scripts, activeScript, setActiveScript, addScript, updateScript, deleteScript, loading }}>
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
