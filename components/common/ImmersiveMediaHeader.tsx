import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import Animated, { 
  useAnimatedStyle, 
  interpolate, 
  Extrapolation 
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const HEADER_HEIGHT = height * 0.5;

interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
}

interface ImmersiveMediaHeaderProps {
  media: MediaItem[];
  scrollY: Animated.SharedValue<number>;
}

export const ImmersiveMediaHeader: React.FC<ImmersiveMediaHeaderProps> = ({ media, scrollY }) => {
  // Parallax and Fade-out styles
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
      [HEADER_HEIGHT / 2, 0, 0],
      Extrapolation.CLAMP
    );
    
    const scale = interpolate(
      scrollY.value,
      [-HEADER_HEIGHT, 0],
      [2, 1],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      scrollY.value,
      [0, HEADER_HEIGHT * 0.8],
      [1, 0],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animatedContainer, animatedHeaderStyle]}>
        <ScrollView 
          horizontal 
          pagingEnabled 
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {media.map((item, index) => (
            <View key={item.id} style={styles.mediaWrapper}>
              {item.type === 'video' ? (
                <Video
                  source={{ uri: item.url }}
                  style={styles.media}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay
                  isLooping
                  isMuted
                  rate={1.0}
                  volume={0}
                />
              ) : (
                <Image 
                  source={{ uri: item.url }} 
                  style={styles.media}
                  contentFit="cover"
                  transition={500}
                />
              )}
              {/* Bottom Gradient for text readability */}
              <LinearGradient 
                colors={['transparent', 'rgba(0, 26, 51, 0.8)']} 
                style={styles.gradient} 
              />
            </View>
          ))}
        </ScrollView>
        
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {media.map((_, i) => (
            <View key={i} style={styles.dot} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    backgroundColor: '#000',
  },
  animatedContainer: {
    flex: 1,
  },
  mediaWrapper: {
    width,
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  pagination: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  }
});
