import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { users, currentUser } from '@/mocks/data';
import { User } from '@/types';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  content?: string;
  timestamp: number;
  isRead: boolean;
}

const notifications: Notification[] = [
  {
    id: 'n1',
    type: 'like',
    user: users[0],
    content: 'fotoğrafını beğendi',
    timestamp: Date.now() - 300000,
    isRead: false,
  },
  {
    id: 'n2',
    type: 'follow',
    user: users[1],
    content: 'seni takip etmeye başladı',
    timestamp: Date.now() - 1800000,
    isRead: false,
  },
  {
    id: 'n3',
    type: 'comment',
    user: users[2],
    content: 'yorum yaptı: "Harika görünüyor! 🔥"',
    timestamp: Date.now() - 3600000,
    isRead: true,
  },
  {
    id: 'n4',
    type: 'mention',
    user: users[3],
    content: 'bir gönderide seni etiketledi',
    timestamp: Date.now() - 7200000,
    isRead: true,
  },
  {
    id: 'n5',
    type: 'like',
    user: users[4],
    content: 'yorumunu beğendi',
    timestamp: Date.now() - 10800000,
    isRead: true,
  },
  {
    id: 'n6',
    type: 'follow',
    user: users[5],
    content: 'seni takip etmeye başladı',
    timestamp: Date.now() - 14400000,
    isRead: true,
  },
];

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'şimdi';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}d`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}s`;
  const days = Math.floor(hours / 24);
  return `${days}g`;
}

function getNotificationIcon(type: Notification['type']) {
  switch (type) {
    case 'like':
      return <Heart size={20} color={Colors.heart} fill={Colors.heart} />;
    case 'comment':
      return <MessageCircle size={20} color={Colors.verified} fill={Colors.verified} />;
    case 'follow':
      return <UserPlus size={20} color={Colors.online} />;
    case 'mention':
      return <AtSign size={20} color={Colors.verified} />;
  }
}

export default function NotificationsScreen() {
  const [followingStates, setFollowingStates] = React.useState<Record<string, boolean>>({});

  const toggleFollow = useCallback((userId: string) => {
    setFollowingStates((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const renderNotification = useCallback(
    ({ item }: { item: Notification }) => (
      <View style={[styles.notificationItem, !item.isRead && styles.unreadItem]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <View style={styles.iconBadge}>
            {getNotificationIcon(item.type)}
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.notificationText}>
            <Text style={styles.username}>{item.user.username}</Text>{' '}
            <Text style={styles.text}>{item.content}</Text>{' '}
            <Text style={styles.time}>{timeAgo(item.timestamp)}</Text>
          </Text>
        </View>
        {item.type === 'follow' && (
          <TouchableOpacity
            style={[styles.followBtn, followingStates[item.user.id] && styles.followingBtn]}
            onPress={() => toggleFollow(item.user.id)}
            activeOpacity={0.7}
          >
            <Text style={[styles.followBtnText, followingStates[item.user.id] && styles.followingBtnText]}>
              {followingStates[item.user.id] ? 'Takip Ediliyor' : 'Takip Et'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [followingStates, toggleFollow]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        testID="notifications-list"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContent: {
    paddingTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  unreadItem: {
    backgroundColor: '#F8F9FA',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  iconBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  content: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  notificationText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text,
  },
  username: {
    fontWeight: '700',
  },
  text: {
    color: Colors.text,
  },
  time: {
    color: Colors.textSecondary,
  },
  followBtn: {
    backgroundColor: Colors.verified,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  followBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  followingBtnText: {
    color: Colors.text,
  },
});
