import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

import Colors from '@/constants/colors';
import { chats } from '@/mocks/data';
import { Chat } from '@/types';

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

export default function MessagesScreen() {
  const router = useRouter();

  const handleChatPress = useCallback(
    (chat: Chat) => {
      router.push({
        pathname: '/messages/[chatId]',
        params: { chatId: chat.id, userName: chat.user.username, userAvatar: chat.user.avatar },
      });
    },
    [router]
  );

  const renderChat = useCallback(
    ({ item }: { item: Chat }) => (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleChatPress(item)}
        activeOpacity={0.6}
        testID={`chat-${item.id}`}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.chatUsername,
                item.unreadCount > 0 && styles.unreadUsername,
              ]}
              numberOfLines={1}
            >
              {item.user.username}
            </Text>
            <Text style={styles.chatTime}>{timeAgo(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.chatMessageRow}>
            <Text
              style={[
                styles.chatLastMessage,
                item.unreadCount > 0 && styles.unreadMessage,
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleChatPress]
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        testID="chats-list"
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
    paddingTop: 4,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.online,
    borderWidth: 2.5,
    borderColor: Colors.white,
  },
  chatContent: {
    flex: 1,
    marginLeft: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  chatUsername: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  unreadUsername: {
    fontWeight: '600' as const,
  },
  chatTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chatMessageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatLastMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    color: Colors.text,
    fontWeight: '500' as const,
  },
  unreadBadge: {
    backgroundColor: '#3897F0',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700' as const,
  },
});
