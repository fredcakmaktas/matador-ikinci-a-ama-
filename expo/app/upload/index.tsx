import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import { Image } from 'expo-image';
import {
  X,
  Image as ImageIcon,
  Video,
  MapPin,
  AtSign,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const mockGalleryImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=400&fit=crop',
];

type UploadType = 'photo' | 'reel';

export default function UploadScreen() {
  const router = useRouter();
  const [uploadType, setUploadType] = useState<UploadType>('photo');
  const [selectedImage, setSelectedImage] = useState<string>(mockGalleryImages[0]);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'select' | 'edit'>('select');

  const handleImageSelect = useCallback((image: string) => {
    setSelectedImage(image);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleNext = useCallback(() => {
    setCurrentStep('edit');
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep === 'edit') {
      setCurrentStep('select');
    } else {
      router.back();
    }
  }, [currentStep, router]);

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [tagInput, tags]);

  const handleRemoveTag = useCallback((tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  }, [tags]);

  const handleShare = useCallback(() => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/');
  }, [router]);

  if (currentStep === 'select') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <X size={28} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Yeni Gönderi</Text>
          <TouchableOpacity onPress={handleNext} activeOpacity={0.7}>
            <Text style={styles.nextButton}>İleri</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[styles.typeButton, uploadType === 'photo' && styles.activeType]}
            onPress={() => setUploadType('photo')}
            activeOpacity={0.7}
          >
            <ImageIcon
              size={22}
              color={uploadType === 'photo' ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.typeText,
                uploadType === 'photo' && styles.activeTypeText,
              ]}
            >
              Fotoğraf
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, uploadType === 'reel' && styles.activeType]}
            onPress={() => setUploadType('reel')}
            activeOpacity={0.7}
          >
            <Video
              size={22}
              color={uploadType === 'reel' ? Colors.white : Colors.text}
            />
            <Text
              style={[
                styles.typeText,
                uploadType === 'reel' && styles.activeTypeText,
              ]}
            >
              Reel
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.preview}
            contentFit="cover"
          />
        </View>

        <ScrollView
          style={styles.gallery}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.galleryGrid}>
            {mockGalleryImages.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.galleryItem,
                  selectedImage === image && styles.selectedItem,
                ]}
                onPress={() => handleImageSelect(image)}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.galleryImage}
                  contentFit="cover"
                />
                {selectedImage === image && (
                  <View style={styles.selectedOverlay} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
          <ChevronRight
            size={28}
            color={Colors.text}
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paylaş</Text>
        <TouchableOpacity onPress={handleShare} activeOpacity={0.7}>
          <Text style={styles.shareButton}>Paylaş</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.editContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.selectedPreview}>
          <Image
            source={{ uri: selectedImage }}
            style={styles.selectedPreviewImage}
            contentFit="cover"
          />
        </View>

        <View style={styles.inputSection}>
          <TextInput
            style={styles.captionInput}
            placeholder="Açıklama yaz..."
            placeholderTextColor={Colors.gray}
            value={caption}
            onChangeText={setCaption}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <MapPin size={20} color={Colors.gray} />
            <TextInput
              style={styles.locationInput}
              placeholder="Konum ekle"
              placeholderTextColor={Colors.gray}
              value={location}
              onChangeText={setLocation}
            />
          </View>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.tagInputRow}>
            <AtSign size={20} color={Colors.gray} />
            <TextInput
              style={styles.tagInput}
              placeholder="Kişi etiketle (@kullaniciadi)"
              placeholderTextColor={Colors.gray}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={handleAddTag} activeOpacity={0.7}>
              <Text style={styles.addTagButton}>Ekle</Text>
            </TouchableOpacity>
          </View>

          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>@{tag}</Text>
                  <TouchableOpacity
                    onPress={() => handleRemoveTag(tag)}
                    activeOpacity={0.7}
                  >
                    <X size={14} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.optionsSection}>
          <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
            <Text style={styles.optionText}>Gelişmiş Ayarlar</Text>
            <ChevronRight size={20} color={Colors.gray} />
          </TouchableOpacity>
        </View>
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
  nextButton: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.verified,
  },
  shareButton: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.verified,
  },
  typeSelector: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.surfaceLight,
  },
  activeType: {
    backgroundColor: Colors.black,
  },
  typeText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  activeTypeText: {
    color: Colors.white,
  },
  previewContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: Colors.black,
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  gallery: {
    flex: 1,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryItem: {
    width: SCREEN_WIDTH / 3 - 2,
    height: SCREEN_WIDTH / 3 - 2,
    margin: 1,
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  selectedItem: {
    borderWidth: 3,
    borderColor: Colors.verified,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(56, 151, 240, 0.3)',
  },
  editContainer: {
    flex: 1,
  },
  selectedPreview: {
    padding: 16,
  },
  selectedPreviewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  inputSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  captionInput: {
    fontSize: 16,
    color: Colors.text,
    minHeight: 80,
    padding: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  tagInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tagInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  addTagButton: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.verified,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.verified,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: Colors.white,
  },
  optionsSection: {
    marginTop: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.text,
  },
});
