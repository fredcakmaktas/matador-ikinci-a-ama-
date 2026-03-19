import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ViewToken,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Heart,
  MessageCircle,
  Send,
  Music,
  MoreVertical,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { reels } from '@/mocks/data';
import { Reel } from '@/types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function ReelCard({ reel, isActive }: { reel: Reel; isActive: boolean }) {
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likesCount);
  const heartScale = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();

  const handleLike = useCallback(() => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.sequence([
      Animated.spring(heartScale, {
        toValue: 1.4,
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
    <View style={[styles.reelContainer, { height: SCREEN_HEIGHT }]}>
      <Image
        source={{ uri: reel.thumbnailUrl }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={isActive ? 300 : 0}
      />
      <View style={styles.reelOverlay} />

      <View style={[styles.reelActions, { bottom: 100 + insets.bottom }]}>
        <TouchableOpacity
          style={styles.reelActionBtn}
          onPress={handleLike}
          activeOpacity={0.7}
        >
          <Animated.View style={{ transform: [{ scale: heartScale }] }}>
            <Heart
              size={28}
              color={Colors.white}
              fill={isLiked ? Colors.heart : 'transparent'}
            />
          </Animated.View>
          <Text style={styles.reelActionText}>{formatCount(likesCount)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reelActionBtn} activeOpacity={0.7}>
          <MessageCircle size={28} color={Colors.white} />
          <Text style={styles.reelActionText}>
            {formatCount(reel.commentsCount)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.reelActionBtn} activeOpacity={0.7}>
          <Send size={26} color={Colors.white} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.reelActionBtn} activeOpacity={0.7}>
          <MoreVertical size={26} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={[styles.reelInfo, { bottom: 60 + insets.bottom }]}>
        <View style={styles.reelUser}>
          <Image
            source={{ uri: reel.user.avatar }}
            style={styles.reelAvatar}
          />
          <Text style={styles.reelUsername}>{reel.user.username}</Text>
          <TouchableOpacity style={styles.followBtn} activeOpacity={0.7}>
            <Text style={styles.followBtnText}>Follow</Text>
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

export default function ReelsScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const renderReel = useCallback(
    ({ item, index }: { item: Reel; index: number }) => (
      <ReelCard reel={item} isActive={index === activeIndex} />
    ),
    [activeIndex]
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlatList
        data={reels}
        renderItem={renderReel}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        testID="reels-list"
      />
      <View style={styles.reelsHeader}>
        <Text style={styles.reelsTitle}>Reels</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.reelsBackground,
  },
  reelsHeader: {
    position: 'absolute',
    top: 50,
    left: 16,
    zIndex: 10,
  },
  reelsTitle: {
    fontSize: 22,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  reelContainer: {
    width: SCREEN_WIDTH,
    position: 'relative',
  },
  reelOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  reelActions: {
    position: 'absolute',
    right: 12,
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
    fontWeight: '600' as const,
  },
  reelInfo: {
    position: 'absolute',
    left: 14,
    right: 60,
  },
  reelUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  reelAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.white,
  },
  reelUsername: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  followBtn: {
    borderWidth: 1,
    borderColor: Colors.white,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  followBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600' as const,
  },
  reelCaption: {
    color: Colors.white,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
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
