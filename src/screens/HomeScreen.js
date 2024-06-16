import { View, Text, ScrollView, Image, TextInput, BackHandler, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ArrowRightCircleIcon, BellIcon, CalendarDaysIcon, HomeIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { ViewfinderCircleIcon } from 'react-native-heroicons/solid';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeteksiScreen from './UploadScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import baseURL from '../hooks/config';

function Dashboard() {
  const [activeCategory, setActiveCategory] = useState('Daging');
  const [categories, setCategories] = useState([]);
  const [meals, setMeals] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    checkLoginStatus();
    getCategories();
    getRecipes();

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (navigation.isFocused() && route.name === 'Halaman Utama') {
        setShowExitAlert(true);
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [navigation, route]);

  const handleChangeCategory = (category) => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  };

  const getCategories = async () => {
    try {
      const response = await axios.get(`${baseURL}/categories`);
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const getRecipes = async (category = 'Daging') => {
    try {
      const response = await axios.get(`${baseURL}/meals/${category}`);
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  };

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoggedIn(!!token);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        {/* avatar dan bell icon */}
        <View className="mx-4 flex-row justify-between items-center">
          <Image source={require('../../assets/images/NutriChef.png')} style={{ height: hp(7), width: hp(7.5) }} />
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  borderRadius: hp(5) / 2,
                  width: hp(12.5),
                  height: hp(5),
                  backgroundColor: '#0891b2',
                  alignItems: 'left',
                  justifyContent: 'center',
                  marginLeft: 10,
                }}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>    Masuk</Text>
              </View>
              <View
                style={{
                  borderRadius: hp(5) / 2,
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#0891b2',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: -40,
                }}
              >
                <ArrowRightCircleIcon size={hp(4)} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="mx-4 space-y-2 mb-2">
          <Text style={{ fontSize: hp(1.7) }} className="text-neutral-600">
            Selamat Datang,
          </Text>
          <View>
            <Text style={{ fontSize: hp(2.8) }} className="font-semibold text-neutral-600">
              Buat makanan sehat anda,
            </Text>
          </View>
          <Text style={{ fontSize: hp(2.8) }} className="font-semibold text-neutral-600">
            jagalah <Text className="text-cyan-500">kesehatan</Text>
          </Text>
        </View>

        {/* kategori */}
        <View>
          {categories.length > 0 && (
            <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
          )}
        </View>

        {/* resep */}
        <View>
          <Recipes meals={meals} categories={categories} />
        </View>
      </ScrollView>
      <View className="flex-1 bg-white">
        {/* exit app */}
        <AwesomeAlert
          show={showExitAlert}
          showProgress={false}
          title="Keluar dari Aplikasi"
          message="Apakah Anda yakin ingin keluar?"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={true}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="Batal"
          confirmText="Keluar"
          confirmButtonColor="#0891b2"
          onCancelPressed={() => setShowExitAlert(false)}
          onConfirmPressed={() => {
            setShowExitAlert(false);
            BackHandler.exitApp();
          }}
        />
      </View>
    </View>
  );
}

function KesehatanScreen() {
  return (
    <View className="flex-1 bg-white">
      <Text>Kesehatan Screen Content</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleKesehatanPress = async () => {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      setShowLoginAlert(true);
      return false;
    }
    return true;
  };

  return (
    <>
      <AwesomeAlert
        show={showLoginAlert}
        showProgress={false}
        title="Peringatan"
        message="Anda Perlu Login"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={true}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#0891b2"
        onConfirmPressed={() => setShowLoginAlert(false)}
      />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          style: {
            elevation: 0,
          },
        }}
      >
        <Tab.Screen
          name="Halaman Utama"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Deteksi Bahan Makanan"
          component={DeteksiScreen}
          options={{
            tabBarIcon: ({ color, size }) => <ViewfinderCircleIcon color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Menu Makan Harian"
          component={KesehatanScreen}
          options={{
            tabBarIcon: ({ color, size }) => <CalendarDaysIcon color={color} size={size} />,
            tabBarButton: (props) => (
              <TouchableOpacity
                {...props}
                onPress={async () => {
                  const allowed = await handleKesehatanPress();
                  if (allowed) {
                    props.onPress();
                  }
                }}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
