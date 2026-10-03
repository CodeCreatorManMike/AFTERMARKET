import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeState, MarketplaceState } from './model';

type State = MarketplaceState;
const KEY = 'aftermarket.prototype.v1';
const Context = createContext<{ state: State; ready: boolean; error: string; save: (next: State) => Promise<void> } | null>(null);
export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ member: null, listings: [] });
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const saving = useRef(false);
  useEffect(() => {
    AsyncStorage.getItem(KEY).then(raw => {
      if (raw) {
        setState(decodeState(raw));
      }
    }).catch(() => setError('Saved preview could not be loaded. You can start again.')).finally(() => setReady(true));
  }, []);
  async function save(next: State) {
    if (saving.current) throw new Error('Please wait for the current save.');
    saving.current = true;
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); setState(next); setError(''); }
    finally { saving.current = false; }
  }
  return <Context.Provider value={{ state, ready, error, save }}>{children}</Context.Provider>;
}
export function useMarketplace() {
  const context = useContext(Context);
  if (!context) throw new Error('MarketplaceProvider is required');
  return context;
}
