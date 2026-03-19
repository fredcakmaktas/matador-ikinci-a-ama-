import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';

import Colors from '@/constants/colors';
import { stories, posts } from '@/mocks/data';
import StoryCircle from '@/components/StoryCircle';
import FeedPost from '@/components/FeedPost';
import { Story, Post } from '@/types';

export default function FeedScreen() {
  const router = useRouter();

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

  const renderPost = useCallback(({ item }: { item: Post }) => (
    <FeedPost post={item} />
  ), []);

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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
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
});
