import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { CatalogueEvent, City, deviceCity } from '../../data/catalogue';
import { feedIsFresh, feedUrl, validCatalogueResponse } from './catalogueFeed';
import { useMarketplace } from './MarketplaceContext';

type Catalogue = { city: City; events: CatalogueEvent[]; suppliedAt: string | null; live: boolean; prototype: boolean; loading: boolean; refresh: () => Promise<void> };
const Context = createContext<Catalogue | null>(null);
const BASE = process.env.EXPO_PUBLIC_CATALOGUE_URL;
/** Serves the selected city's authorised feed; expired bundled samples are never shown. */
export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const { state } = useMarketplace();
  const city = state.member?.city ?? deviceCity();
  const [feeds, setFeeds] = useState<Partial<Record<City, { events: CatalogueEvent[]; suppliedAt: string; prototype: boolean }>>>({});
  const [loading, setLoading] = useState(false);
  const refresh = useCallback(async () => {
    const url = feedUrl(BASE, city);
    if (!url) return;
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (!validCatalogueResponse(payload, city) || !feedIsFresh(payload.suppliedAt)) return;
      setFeeds(previous => ({ ...previous, [city]: { events: payload.events, suppliedAt: payload.suppliedAt, prototype: !!payload.prototype } }));
    } catch { /* Keep the last verified catalogue when offline. */ }
    finally { clearTimeout(timer); setLoading(false); }
  }, [city]);
  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener('change', next => { if (next === 'active') void refresh(); });
    const timer = setInterval(() => { if (AppState.currentState === 'active') void refresh(); }, 15 * 60_000);
    return () => { subscription.remove(); clearInterval(timer); };
  }, [refresh]);
  const cached = feeds[city];
  const feed = cached && feedIsFresh(cached.suppliedAt) ? cached : undefined;
  return <Context.Provider value={{ city, events: feed?.events ?? [], suppliedAt: feed?.suppliedAt ?? null, live: !!feed, prototype: !!feed?.prototype, loading, refresh }}>{children}</Context.Provider>;
}

export function useCatalogue() {
  const value = useContext(Context);
  if (!value) throw new Error('CatalogueProvider is required');
  return value;
}
