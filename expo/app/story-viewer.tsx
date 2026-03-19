import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { stories } from '@/mocks/data';

const STORY_DURATION = 5000;

export default function StoryViewerScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const initialIndex = stories.findIndex((s) => s.id === storyId);
  const [currentIndex, setCurrentIndex] = useState(
    initialIndex >= 0 ? initialIndex : 0
  );
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  const currentStory = stories[currentIndex];

  const startProgress = useCallback(() => {
    progressAnim.setValue(0);
    animRef.current = Animated.timing(progressAnim, {
      toValue: 1,
      duration: STORY_DURATION,
      useNativeDriver: false,
    });
    animRef.current.start(({ finished }) => {
      if (finished) {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          router.back();
        }
      }
    });
  }, [currentIndex, progressAnim, router]);

  useEffect(() => {
    startProgress();
    return () => {
      animRef.current?.stop();
    };
  }, [startProgress]);

  const handleNext = useCallback(() => {
    animRef.current?.stop();
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.back();
    }
  }, [currentIndex, router]);

  const handlePrev = useCallback(() => {
    animRef.current?.stop();
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      progressAnim.setValue(0);
      startProgress();
    }
  }, [currentIndex, progressAnim, startProgress]);

  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  if (!currentStory) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Image
        source={{ uri: currentStory.imageUrl }}
        style={StyleSheet.absoluteFillObject}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.overlay} />

      <View style={[styles.topSection, { paddingTop: insets.top + 8 }]}>
        <View style={styles.progressBars}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBarBg}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width:
                      index < currentIndex
                        ? '100%'
                        : index === currentIndex
                        ? progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                          })
                        : '0%',
                  },
                ]}
              />
            </View>
          ))}
        </View>

        <View style={styles.storyHeader}>
          <View style={styles.storyUser}>
            <Image
              source={{ uri: currentStory.user.avatar }}
              style={styles.storyAvatar}
            />
            <Text style={styles.storyUsername}>
              {currentStory.user.username}
            </Text>
            <Text style={styles.storyTime}>
              {Math.floor(
                (Date.now() - currentStory.timestamp) / 3600000
              )}
              h
            </Text>
          </View>
          <TouchableOpacity onPress={handleClose} activeOpacity={0.7}>
            <X size={26} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.touchAreas}>
        <TouchableOpacity
          style={styles.touchLeft}
          onPress={handlePrev}
          activeOpacity={1}
        />
        <TouchableOpacity
          style={styles.touchRight}
          onPress={handleNext}
          activeOpacity={1}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  topSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 10,
  },
  progressBars: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 10,
  },
  progressBarBg: {
    flex: 1,
    height: 2.5,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  storyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  storyUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storyAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  storyUsername: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '600' as const,
  },
  storyTime: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  touchAreas: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 5,
  },
  touchLeft: {
    flex: 1,
  },
  touchRight: {
    flex: 2,
  },
});
