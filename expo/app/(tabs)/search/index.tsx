import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Image } from 'expo-image';
import { Search, MapPin, User as UserIcon, X, TrendingUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { users as mockUsers } from '@/mocks/data';
import { User, Location } from '@/types';

const trendingSearches = [
  'fotoğrafçılık',
  'seyahat',
  'yemek',
  'moda',
  'sanat',
  'spor',
  'müzik',
  'doğa',
];

const mockLocations: Location[] = [
  { id: 'l1', name: 'İstanbul, Türkiye', address: 'Türkiye', imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=200&h=200&fit=crop' },
  { id: 'l2', name: 'Kapadokya', address: 'Nevşehir, Türkiye', imageUrl: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=200&h=200&fit=crop' },
  { id: 'l3', name: 'Alaçatı', address: 'İzmir, Türkiye', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=200&h=200&fit=crop' },
  { id: 'l4', name: 'Bodrum', address: 'Muğla, Türkiye', imageUrl: 'https://images.unsplash.com/photo-1599158150601-1417ebbaafdd?w=200&h=200&fit=crop' },
  { id: 'l5', name: 'Antalya', address: 'Antalya, Türkiye', imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=200&h=200&fit=crop' },
];

type SearchTab = 'users' | 'locations';

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('users');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return mockLocations.filter((loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.trim() && !recentSearches.includes(query.trim())) {
      setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 10));
    }
  }, [recentSearches]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const removeRecentSearch = useCallback((search: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== search));
  }, []);

  const handleUserPress = useCallback((user: User) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({ pathname: '/profile/[userId]', params: { userId: user.id } });
  }, [router]);

  const renderUserItem = useCallback(({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => handleUserPress(item)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.displayName}>{item.displayName}</Text>
      </View>
      {item.isVerified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  ), [handleUserPress]);

  const renderLocationItem = useCallback(({ item }: { item: Location }) => (
    <TouchableOpacity style={styles.locationItem} activeOpacity={0.7}>
      <Image source={{ uri: item.imageUrl }} style={styles.locationImage} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
      <MapPin size={20} color={Colors.gray} />
    </TouchableOpacity>
  ), []);

  const renderTrendingItem = useCallback((item: string, index: number) => (
    <TouchableOpacity
      key={index}
      style={styles.trendingItem}
      onPress={() => handleSearch(item)}
      activeOpacity={0.7}
    >
      <TrendingUp size={16} color={Colors.verified} />
      <Text style={styles.trendingText}>{item}</Text>
    </TouchableOpacity>
  ), [handleSearch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.gray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ara..."
            placeholderTextColor={Colors.gray}
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            testID="search-input"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} activeOpacity={0.7}>
              <X size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
          activeOpacity={0.7}
        >
          <UserIcon
            size={20}
            color={activeTab === 'users' ? Colors.black : Colors.gray}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'users' && styles.activeTabText,
            ]}
          >
            Kullanıcılar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'locations' && styles.activeTab]}
          onPress={() => setActiveTab('locations')}
          activeOpacity={0.7}
        >
          <MapPin
            size={20}
            color={activeTab === 'locations' ? Colors.black : Colors.gray}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'locations' && styles.activeTabText,
            ]}
          >
            Yerler
          </Text>
        </TouchableOpacity>
      </View>

      {!searchQuery.trim() ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {recentSearches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Son Aramalar</Text>
                <TouchableOpacity
                  onPress={() => setRecentSearches([])}
                  activeOpacity={0.7}
                >
                  <Text style={styles.clearAll}>Temizle</Text>
                </TouchableOpacity>
              </View>
              {recentSearches.map((search, index) => (
                <View key={index} style={styles.recentItem}>
                  <TouchableOpacity
                    style={styles.recentContent}
                    onPress={() => handleSearch(search)}
                    activeOpacity={0.7}
                  >
                    <Search size={18} color={Colors.gray} />
                    <Text style={styles.recentText}>{search}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => removeRecentSearch(search)}
                    activeOpacity={0.7}
                  >
                    <X size={18} color={Colors.gray} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trend Konular</Text>
            <View style={styles.trendingGrid}>
              {trendingSearches.map(renderTrendingItem)}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popüler Yerler</Text>
            {mockLocations.slice(0, 3).map((location) => (
              <View key={location.id}>
                {renderLocationItem({ item: location })}
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={activeTab === 'users' ? filteredUsers : filteredLocations}
          renderItem={
            activeTab === 'users'
              ? (renderUserItem as React.FC<{ item: unknown }>)
              : (renderLocationItem as React.FC<{ item: unknown }>)
          }
          keyExtractor={(item) =>
            activeTab === 'users'
              ? (item as User).id
              : (item as Location).id
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Sonuç bulunamadı</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.black,
  },
  tabText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500' as const,
  },
  activeTabText: {
    color: Colors.black,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  clearAll: {
    fontSize: 14,
    color: Colors.verified,
    fontWeight: '500' as const,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  recentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recentText: {
    fontSize: 15,
    color: Colors.text,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  trendingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  trendingText: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '500' as const,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  username: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  displayName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.verified,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700' as const,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  locationImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  locationAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    paddingVertical: 8,
  },
  emptyState: {
    paddingTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});
