import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { AppState } from 'react-native';
import { CatalogueEvent, City, deviceCity } from '../../data/catalogue';
import { oxfordFixrEvents } from '../../data/oxfordFixrEvents';
import { feedUrl, validCatalogueResponse } from './catalogueFeed';
import { useMarketplace } from './MarketplaceContext';

type Catalogue = { city: City; events: CatalogueEvent[]; suppliedAt: string | null; live: boolean; refresh: () => Promise<void> };
const Context = createContext<Catalogue | null>(null);
const BASE = process.env.EXPO_PUBLIC_CATALOGUE_URL;
/** Bundled snapshots used until the licensed feed responds. Cape Town waits on that feed. */
const SNAPSHOTS: Record<City, CatalogueEvent[]> = { oxford: oxfordFixrEvents, cape_town: [] };

/** Serves the member's city: the licensed feed when reachable, else the bundled snapshot. */
export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const { state } = useMarketplace();
  const city = state.member?.city ?? deviceCity();
  const [feeds, setFeeds] = useState<Partial<Record<City, { events: CatalogueEvent[]; suppliedAt: string }>>>({});
  const refresh = useCallback(async () => {
    const url = feedUrl(BASE, city);
    if (!url) return;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      if (!response.ok) return;
      const payload: unknown = await response.json();
      if (!validCatalogueResponse(payload, city)) return;
      setFeeds(previous => ({ ...previous, [city]: { events: payload.events, suppliedAt: payload.suppliedAt } }));
    } catch { /* Keep the last verified catalogue when offline. */ }
    finally { clearTimeout(timer); }
  }, [city]);
  useEffect(() => {
    void refresh();
    const subscription = AppState.addEventListener('change', next => { if (next === 'active') void refresh(); });
    const timer = setInterval(() => { if (AppState.currentState === 'active') void refresh(); }, 15 * 60_000);
    return () => { subscription.remove(); clearInterval(timer); };
  }, [refresh]);
  const feed = feeds[city];
  return <Context.Provider value={{ city, events: feed?.events ?? SNAPSHOTS[city], suppliedAt: feed?.suppliedAt ?? null, live: !!feed, refresh }}>{children}</Context.Provider>;
}

export function useCatalogue() {
  const value = useContext(Context);
  if (!value) throw new Error('CatalogueProvider is required');
  return value;
}
