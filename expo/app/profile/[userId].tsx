import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  MoreHorizontal,
  Grid3X3,
  Bookmark,
  UserRound,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { users, currentUser, currentUserPosts } from '@/mocks/data';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 4) / 3;

export default function UserProfileScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const user = users.find((u) => u.id === userId) || currentUser;
  const isCurrentUser = userId === 'current';

  const handleFollow = useCallback(() => {
    setIsFollowing(!isFollowing);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isFollowing]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const renderGridItem = useCallback(
    (image: string, index: number) => (
      <TouchableOpacity key={index} style={styles.gridItem} activeOpacity={0.8}>
        <Image
          source={{ uri: image }}
          style={styles.gridImage}
          contentFit="cover"
        />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <ChevronLeft size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.username}</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <MoreHorizontal size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {user.postsCount.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Gönderi</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {user.followersCount.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Takipçi</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {user.followingCount.toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Takip</Text>
            </View>
          </View>
        </View>

        <View style={styles.bioSection}>
          <View style={styles.nameRow}>
            <Text style={styles.displayName}>{user.displayName}</Text>
            {user.isVerified && (
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedText}>✓</Text>
              </View>
            )}
          </View>
          {user.bio && (
            <Text style={styles.bio}>{user.bio}</Text>
          )}
        </View>

        <View style={styles.actionButtons}>
          {isCurrentUser ? (
            <>
              <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                <Text style={styles.editButtonText}>Profili Düzenle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
                <Text style={styles.shareButtonText}>Profili Paylaş</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.followButton, isFollowing && styles.followingButton]}
                onPress={handleFollow}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.followButtonText,
                    isFollowing && styles.followingButtonText,
                  ]}
                >
                  {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.messageButton} activeOpacity={0.7}>
                <Text style={styles.messageButtonText}>Mesaj</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
            onPress={() => setActiveTab('posts')}
            activeOpacity={0.7}
          >
            <Grid3X3
              size={24}
              color={activeTab === 'posts' ? Colors.black : Colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
            onPress={() => setActiveTab('saved')}
            activeOpacity={0.7}
          >
            <Bookmark
              size={24}
              color={activeTab === 'saved' ? Colors.black : Colors.gray}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tagged' && styles.activeTab]}
            onPress={() => setActiveTab('tagged')}
            activeOpacity={0.7}
          >
            <UserRound
              size={24}
              color={activeTab === 'tagged' ? Colors.black : Colors.gray}
            />
          </TouchableOpacity>
        </View>

        {activeTab === 'posts' && (
          <View style={styles.grid}>
            {currentUserPosts.map((image, index) =>
              renderGridItem(image, index)
            )}
          </View>
        )}

        {activeTab === 'saved' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Kaydedilenler</Text>
            <Text style={styles.emptyText}>
              Gönderileri daha sonra görüntülemek için kaydedin
            </Text>
          </View>
        )}

        {activeTab === 'tagged' && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Fotoğraflar</Text>
            <Text style={styles.emptyText}>
              Fotoğraflarınızda etiketlendiğinizde burada görünecek
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 24,
  },
  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 19,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bioSection: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  displayName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
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
  bio: {
    fontSize: 14,
    color: Colors.text,
    marginTop: 4,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  followButton: {
    flex: 1,
    backgroundColor: Colors.verified,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  followingButton: {
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  followButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  followingButtonText: {
    color: Colors.text,
  },
  messageButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  messageButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  editButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  shareButton: {
    flex: 1,
    backgroundColor: Colors.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  tabs: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.black,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
