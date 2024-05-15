import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function WelcomeScreen() {
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);

  const navigation = useNavigation();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setTimeout(() => ring1padding.value = withSpring(ring1padding.value + hp(2)), 100);
          setTimeout(() => ring2padding.value = withSpring(ring2padding.value + hp(3.5)), 300);
          setTimeout(() => navigation.navigate('HomeScreenUser'), 2500);
        } else {
          setTimeout(() => ring1padding.value = withSpring(ring1padding.value + hp(2)), 100);
          setTimeout(() => ring2padding.value = withSpring(ring2padding.value + hp(3.5)), 300);
          setTimeout(() => navigation.navigate('Home'), 2500);
        }
      } catch (error) {
        console.log('Error checking login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View className="flex-1 justify-center items-center space-y-10 bg-cyan-500">
      <StatusBar style="light" />

      {/* Logo */}
      <Animated.View className="bg-white/20 rounded-full" style={{ padding: ring2padding }}>
        <Animated.View className="bg-white/20 rounded-full" style={{ padding: ring1padding }}>
          <Image source={require('../../assets/images/NutriChef.png')} style={{ width: hp(35), height: hp(35) }} />
        </Animated.View>
      </Animated.View>

      {/* Title */}
      <View className="flex items-center space-y-">
        <Text style={{ fontSize: hp(3) }} className="font-bold text-white tracking-widest">
          Nutri Chef
        </Text>
        <Text style={{ fontSize: hp(1.5) }} className="font-medium text-white tracking-widest">
          Rekomendasi Resep Masakan Dengan Deteksi Bahan
        </Text>
      </View>
    </View>
  );
}
