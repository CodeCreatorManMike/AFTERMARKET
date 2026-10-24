import React from 'react';
import { Screen } from '../components/common/Screen';
import { HomeTopBar } from '../components/discovery/HomeTopBar';
import { Hero } from '../components/discovery/Hero';
import { EventFeed } from '../components/discovery/EventFeed';
import { useCatalogue } from '../features/marketplace/CatalogueContext';
import { CITIES } from '../data/catalogue';

export function HomeScreen() {
  const { city } = useCatalogue();
  return <Screen><EventFeed title={`Popular in ${CITIES[city].label}`} header={<><HomeTopBar /><Hero /></>} /></Screen>;
}
