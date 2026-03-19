import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { Post } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeedPostProps {
  post: Post;
}

function formatCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default React.memo(function FeedPost({ post }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const heartScale = useRef(new Animated.Value(1)).current;
  const doubleTapHeart = useRef(new Animated.Value(0)).current;

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

  const handleDoubleTap = useCallback(() => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.sequence([
      Animated.timing(doubleTapHeart, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(600),
      Animated.timing(doubleTapHeart, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLiked, doubleTapHeart]);

  const handleBookmark = useCallback(() => {
    setIsBookmarked((prev) => !prev);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const lastTap = useRef<number>(0);
  const handleImagePress = useCallback(() => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleDoubleTap();
    }
    lastTap.current = now;
  }, [handleDoubleTap]);

  return (
    <View style={styles.container} testID={`post-${post.id}`}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.userInfo} activeOpacity={0.7}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{post.user.username}</Text>
              {post.user.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            {post.location && (
              <Text style={styles.location}>{post.location}</Text>
            )}
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7}>
          <MoreHorizontal size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={1} onPress={handleImagePress}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.imageUrl }}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
          />
          <Animated.View
            style={[
              styles.doubleTapHeart,
              {
                opacity: doubleTapHeart,
                transform: [
                  {
                    scale: doubleTapHeart.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1.2],
                    }),
                  },
                ],
              },
            ]}
          >
            <Heart size={80} color={Colors.white} fill={Colors.white} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} activeOpacity={0.7}>
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Heart
                size={24}
                color={isLiked ? Colors.heart : Colors.text}
                fill={isLiked ? Colors.heart : 'transparent'}
              />
            </Animated.View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <MessageCircle size={24} color={Colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} activeOpacity={0.7}>
            <Send size={22} color={Colors.text} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={handleBookmark} activeOpacity={0.7}>
          <Bookmark
            size={24}
            color={Colors.text}
            fill={isBookmarked ? Colors.text : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.likesCount}>{formatCount(likesCount)} likes</Text>
        <Text style={styles.caption}>
          <Text style={styles.captionUsername}>{post.user.username} </Text>
          {post.caption}
        </Text>
        {post.commentsCount > 0 && (
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewComments}>
              View all {post.commentsCount} comments
            </Text>
          </TouchableOpacity>
        )}
        {post.comments.length > 0 && (
          <View style={styles.commentPreview}>
            <Text style={styles.commentText}>
              <Text style={styles.captionUsername}>
                {post.comments[0].user.username}{' '}
              </Text>
              {post.comments[0].text}
            </Text>
          </View>
        )}
        <Text style={styles.timestamp}>{timeAgo(post.timestamp)}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  verifiedBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#3897F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 8,
    fontWeight: '700' as const,
  },
  location: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: Colors.surfaceLight,
  },
  doubleTapHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  footer: {
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  likesCount: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  caption: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 4,
  },
  captionUsername: {
    fontWeight: '600' as const,
  },
  viewComments: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 4,
  },
  commentPreview: {
    marginTop: 2,
  },
  commentText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 6,
    textTransform: 'uppercase' as const,
  },
});
