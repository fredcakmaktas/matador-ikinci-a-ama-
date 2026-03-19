import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, Stack } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Send, Camera, Mic } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { chatMessages } from '@/mocks/data';
import { Message } from '@/types';

export default function ChatDetailScreen() {
  const { chatId, userName, userAvatar } = useLocalSearchParams<{
    chatId: string;
    userName: string;
    userAvatar: string;
  }>();

  const [messages, setMessages] = useState<Message[]>(
    chatMessages[chatId ?? ''] ?? []
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: false });
      }, 100);
    }
  }, [messages.length]);

  const handleSend = useCallback(() => {
    if (!inputText.trim()) return;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newMessage: Message = {
      id: `m_${Date.now()}`,
      senderId: 'current',
      text: inputText.trim(),
      timestamp: Date.now(),
      isRead: false,
      type: 'text',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, [inputText]);

  const renderMessage = useCallback(
    ({ item }: { item: Message }) => {
      const isOwn = item.senderId === 'current';
      return (
        <View
          style={[
            styles.messageRow,
            isOwn ? styles.messageRowOwn : styles.messageRowOther,
          ]}
        >
          {!isOwn && (
            <Image
              source={{ uri: userAvatar }}
              style={styles.messageAvatar}
            />
          )}
          <View
            style={[
              styles.messageBubble,
              isOwn ? styles.bubbleOwn : styles.bubbleOther,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                isOwn ? styles.messageTextOwn : styles.messageTextOther,
              ]}
            >
              {item.text}
            </Text>
          </View>
        </View>
      );
    },
    [userAvatar]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: userName ?? '',
          headerTitleStyle: { fontWeight: '600' as const, fontSize: 16 },
        }}
      />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          testID="messages-list"
        />
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputIcon} activeOpacity={0.7}>
            <Camera size={22} color={Colors.textSecondary} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Message..."
            placeholderTextColor={Colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
            testID="message-input"
          />
          {inputText.trim() ? (
            <TouchableOpacity
              style={styles.sendBtn}
              onPress={handleSend}
              activeOpacity={0.7}
              testID="send-button"
            >
              <Send size={20} color="#3897F0" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inputIcon} activeOpacity={0.7}>
              <Mic size={22} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  messagesList: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-end',
  },
  messageRowOwn: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bubbleOwn: {
    backgroundColor: '#3897F0',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: Colors.messageBubble,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageTextOwn: {
    color: Colors.white,
  },
  messageTextOther: {
    color: Colors.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  inputIcon: {
    padding: 8,
  },
  input: {
    flex: 1,
    minHeight: 36,
    maxHeight: 100,
    backgroundColor: Colors.surfaceLight,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    color: Colors.text,
    marginHorizontal: 6,
  },
  sendBtn: {
    padding: 8,
  },
});
