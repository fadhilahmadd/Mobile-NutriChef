import { View, Text, ScrollView, Image, TextInput, BackHandler, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ArrowRightCircleIcon, BellIcon, HeartIcon, HomeIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { ViewfinderCircleIcon } from 'react-native-heroicons/solid';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeteksiScreen from './UploadScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';

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
  }, [navigation, route])

  const handleChangeCategory = category => {
    getRecipes(category);
    setActiveCategory(category);
    setMeals([]);
  }

  const getCategories = async () => {
    try {
      const response = await axios.get('http://192.168.0.114:5000/api/json/v1/categories');
      // const response = await axios.get('https://themealdb.com/api/json/v1/1/categories.php');
      // console.log('mendapatkan kategori: ', response.data);
      if (response && response.data) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  }

  const getRecipes = async (category = "Daging") => {
    try {
      const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/meals/${category}`);
      // const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
      // console.log('mendapatkan resep: ', response.data);
      if (response && response.data) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.log('error: ', err.message);
    }
  }

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('token');
    setLoggedIn(!!token);
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style='dark' />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} className="space-y-6 pt-14">
        {/* avatar dan bell icon */}
        <View className="mx-4 flex-row justify-between items-center">
          <Image source={require('../../assets/images/NutriChef.png')} style={{ height: hp(7), width: hp(7.5) }} />
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ borderRadius: hp(5) / 2, width: hp(12.5), height: hp(5), backgroundColor: '#0891b2', alignItems: 'left', justifyContent: 'center', marginLeft: 10 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>  Masuk</Text>
              </View>
              <View style={{ borderRadius: hp(5) / 2, width: hp(5), height: hp(5), backgroundColor: '#0891b2', alignItems: 'center', justifyContent: 'center', marginLeft: -40 }}>
                <ArrowRightCircleIcon size={hp(4)} color="white" />
              </View>
            </View>
            {/* <Text>{loggedIn && <Text>You are logged in</Text>}
              {!loggedIn && <Text>You are not logged in</Text>}
            </Text> */}
          </TouchableOpacity>
        </View>

        <View className="mx-4 space-y-2 mb-2">
          <Text style={{ fontSize: hp(1.7) }} className="text-neutral-600">Selamat Datang,</Text>
          <View>
            <Text style={{ fontSize: hp(2.8) }} className="font-semibold text-neutral-600">Buat makanan sehat anda,</Text>
          </View>
          <Text style={{ fontSize: hp(2.8) }} className="font-semibold text-neutral-600">
            jagalah <Text className="text-cyan-500">kesehatan</Text>
          </Text>
        </View>

        {/* kategori */}
        <View>
          {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
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
          closeOnTouchOutside={true}
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
  )
}

function AnotherScreen2() {
  return (
    <View className="flex-1 bg-white">
      <Text>Another Screen 2</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Halaman Utama"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HomeIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Deteksi"
        component={DeteksiScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <ViewfinderCircleIcon color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Kesehatan"
        component={AnotherScreen2}
        options={{
          tabBarIcon: ({ color, size }) => (
            <HeartIcon color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>

  );
}