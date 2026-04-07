import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Heart,
  MessageCircle,
  Send,
  Music,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { stories, posts, reels } from '@/mocks/data';
import StoryCircle from '@/components/StoryCircle';
import FeedPost from '@/components/FeedPost';
import { Story, Post, Reel } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type FeedData = Post | Reel;

function isPost(item: FeedData): item is Post {
  return 'imageUrl' in item && !('thumbnailUrl' in item);
}

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function ReelCardInFeed({ reel }: { reel: Reel }) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const heartScale = React.useRef(new Animated.Value(1)).current;

  const handleLike = useCallback(() => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.3,
        useNativeDriver: true,
        friction: 3,
      }),
      Animated.spring(heartScale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 3,
      }),
    ]).start();
  }, [isLiked, heartScale]);

  return (
    <View style={styles.reelContainer}>
      <Image
        source={{ uri: reel.thumbnailUrl }}
        style={styles.reelImage}
        contentFit="cover"
        transition={300}
      />
      <View style={styles.reelOverlay} />

      <View style={styles.reelHeader}>
        <View style={styles.reelBadge}>
          <Text style={styles.reelBadgeText}>Reel</Text>
        </View>
      </View>

      <View style={styles.reelActions}>
        <TouchableOpacity style={styles.reelActionBtn} onPress={handleLike} activeOpacity={0.7}>
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Heart
              size={26}
              color={Colors.white}
              fill={isLiked ? Colors.heart : 'transparent'}
            />
          </Animated.View>
          <Text style={styles.reelActionText}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reelActionBtn} activeOpacity={0.7}>
          <MessageCircle size={26} color={Colors.white} />
          <Text style={styles.reelActionText}>{formatCount(reel.commentsCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reelActionBtn} activeOpacity={0.7}>
          <Send size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.reelInfo}>
        <View style={styles.reelUser}>
          <Image source={{ uri: reel.user.avatar }} style={styles.reelAvatar} />
          <Text style={styles.reelUsername}>{reel.user.username}</Text>
          <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
            <Text style={styles.followBtnText}>Takip Et</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.reelCaption} numberOfLines={2}>
          {reel.caption}
        </Text>
        {reel.musicName && (
          <View style={styles.musicRow}>
            <Music size={12} color={Colors.white} />
            <Text style={styles.musicText} numberOfLines={1}>
              {reel.musicName}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const [followingStates, setFollowingStates] = useState<Record<string, boolean>>({});

  const toggleFollow = useCallback((userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const feedData = useMemo(() => {
    const mixed: FeedData[] = [];
    let postIndex = 0;
    let reelIndex = 0;

    while (postIndex < posts.length || reelIndex < reels.length) {
      if (postIndex < posts.length) {
        mixed.push(posts[postIndex]);
        postIndex++;
      }
      if (reelIndex < reels.length && mixed.length % 3 === 0) {
        mixed.push(reels[reelIndex]);
        reelIndex++;
      }
    }
    return mixed;
  }, []);

  const handleStoryPress = useCallback(
    (storyId: string) => {
      router.push({ pathname: '/story-viewer', params: { storyId } });
    },
    [router]
  );

  const renderStory = useCallback(
    ({ item, index }: { item: Story; index: number }) => (
      <StoryCircle
        story={item}
        isOwn={index === 0}
        onPress={handleStoryPress}
      />
    ),
    [handleStoryPress]
  );

  const renderHeader = useCallback(
    () => (
      <View style={styles.storiesContainer}>
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesList}
        />
        <View style={styles.separator} />
      </View>
    ),
    [renderStory]
  );

  const renderItem = useCallback(
    ({ item }: { item: FeedData }) => {
      if (isPost(item)) {
        return (
          <FeedPost
            post={item}
            showFollowButton={true}
            isFollowing={!!followingStates[item.user.id]}
            onFollowPress={() => toggleFollow(item.user.id)}
          />
        );
      }
      return <ReelCardInFeed reel={item} />;
    },
    [followingStates, toggleFollow]
  );

  const keyExtractor = useCallback((item: FeedData) => {
    return isPost(item) ? `post-${item.id}` : `reel-${item.id}`;
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={feedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        testID="feed-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  storiesContainer: {
    backgroundColor: Colors.white,
  },
  storiesList: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.border,
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.4,
    position: 'relative',
    backgroundColor: Colors.black,
  },
  reelImage: {
    width: '100%',
    height: '100%',
  },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  reelHeader: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
  },
  reelBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  reelBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  reelActions: {
    position: 'absolute',
    right: 16,
    bottom: 100,
    alignItems: 'center',
    gap: 20,
  },
  reelActionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  reelActionText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  reelInfo: {
    position: 'absolute',
    left: 16,
    right: 80,
    bottom: 60,
  },
  reelUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  reelAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  reelUsername: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
  followBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  followBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  reelCaption: {
    color: Colors.white,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  musicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  musicText: {
    color: Colors.white,
    fontSize: 12,
  },
});
