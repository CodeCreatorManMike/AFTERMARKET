import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/RootStack';
import type { City } from '../../data/catalogue';
import { useMarketplace } from './MarketplaceContext';
import type { Guide } from './model';

/** Buying and selling each show their guide the first time; after that they go straight in. */
export function useStartFlow() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { state } = useMarketplace();
  const seen = (guide: Guide) => !!state.member?.guides?.includes(guide);
  return {
    startSell(eventId?: string) {
      if (seen('sell')) navigation.navigate('Sell', { eventId });
      else navigation.navigate('Guide', { mode: 'sell', eventId });
    },
    startBuy(eventId: string) {
      if (seen('buy')) navigation.navigate('Event', { eventId, buying: true });
      else navigation.navigate('Guide', { mode: 'buy', eventId });
    },
  };
}

export function useSetCity() {
  const { state, save } = useMarketplace();
  return async (city: City, source: 'location' | 'manual' = 'manual') => {
    if (!state.member || (state.member.city === city && state.member.citySource === source)) return;
    await save({ ...state, member: { ...state.member, city, citySource: source } });
  };
}
