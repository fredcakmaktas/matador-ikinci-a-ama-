import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { Story } from '@/types';

interface StoryCircleProps {
  story: Story;
  isOwn?: boolean;
  onPress: (storyId: string) => void;
}

export default React.memo(function StoryCircle({ story, isOwn, onPress }: StoryCircleProps) {
  const handlePress = useCallback(() => {
    onPress(story.id);
  }, [story.id, onPress]);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
      testID={`story-${story.id}`}
    >
      {story.isSeen ? (
        <View style={styles.seenRing}>
          <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
        </View>
      ) : (
        <LinearGradient
          colors={['#F58529', '#DD2A7B', '#8134AF', '#515BD4']}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientRing}
        >
          <View style={styles.innerRing}>
            <Image source={{ uri: story.user.avatar }} style={styles.avatar} />
          </View>
        </LinearGradient>
      )}
      {isOwn && (
        <View style={styles.addBadge}>
          <Plus size={12} color={Colors.white} strokeWidth={3} />
        </View>
      )}
      <Text style={styles.username} numberOfLines={1}>
        {isOwn ? 'Your story' : story.user.username.split('.')[0]}
      </Text>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 14,
    width: 72,
  },
  gradientRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2.5,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seenRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  username: {
    fontSize: 11,
    color: Colors.text,
    marginTop: 4,
    textAlign: 'center',
    width: 68,
  },
  addBadge: {
    position: 'absolute',
    bottom: 20,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#3897F0',
    borderWidth: 2,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
