import { View, Text, ScrollView, Image, TextInput, BackHandler, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ArrowRightCircleIcon, BellIcon, CalendarDaysIcon, HomeIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { ViewfinderCircleIcon } from 'react-native-heroicons/solid';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DeteksiScreen from '../screens/UploadScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import baseURL from '../hooks/config';
import URL from '../hooks/cfg';
import KesehatanScreen from '../screens/KesehatanScreen';

function Dashboard() {
    const [activeCategory, setActiveCategory] = useState('Daging');
    const [categories, setCategories] = useState([]);
    const [meals, setMeals] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [showExitAlert, setShowExitAlert] = useState(false);
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);

    const navigation = useNavigation();
    const route = useRoute();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            setLoggedIn(!!token);
        };

        checkLoginStatus();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('token');
            setLoggedIn(!!token); // Set loggedIn state based on token existence

            if (token) {
                const savedUsername = await AsyncStorage.getItem('username');
                setUsername(savedUsername);
            }
        };

        checkLoginStatus();
        getCategories(); // Fetch categories
        getRecipes(); // Fetch recipes

        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (navigation.isFocused() && route.name === 'Halaman Utama' || route.name === 'LoginScreen') {
                // Show the confirmation alert
                setShowExitAlert(true);
                return true; // Indicate that the back action is handled
            }
            return false; // Let the default back action occur
        });

        return () => backHandler.remove();
    }, [navigation, route]);

    const handleChangeCategory = category => {
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);
    }

    const getCategories = async () => {
        try {
            const response = await axios.get(`${baseURL}/categories`);
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
            const response = await axios.get(`${baseURL}/meals/${category}`);
            // const response = await axios.get(`https://themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            // console.log('mendapatkan resep: ', response.data);
            if (response && response.data) {
                setMeals(response.data.meals);
            }
        } catch (err) {
            console.log('error: ', err.message);
        }
    }

    const handleLogout = async () => {
        try {
            // Send logout request to the backend
            await axios.post(`${URL}/logout`);

            // Clear token from AsyncStorage
            await AsyncStorage.removeItem('token');
            setShowLogoutAlert(true);

            // navigation.navigate('Home');
        } catch (error) {
            console.log('Error logging out:', error);
        }
    };

    const isLoggedIn = async () => {
        const token = await AsyncStorage.getItem('token');
        return !!token; // Return true if token exists, false otherwise
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style='dark' />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }} className="space-y-6 pt-14">

                {/* avatar dan bell icon */}
                <View className="mx-4 flex-row justify-between items-center">
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={require('../../assets/images/avatar.png')} style={{ height: hp(4), width: hp(4) }} />
                        <Text style={{ marginLeft: hp(1), color: 'black', fontWeight: 'semi-bold' }}>Hai, </Text>
                        <Text style={{ color: 'black', fontWeight: 'bold' }}>{username}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleLogout()}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ borderRadius: hp(5) / 2, width: hp(12.5), height: hp(5), backgroundColor: '#353434', alignItems: 'left', justifyContent: 'center', marginLeft: 10 }}>
                                <Text style={{ color: 'white', fontWeight: 'bold' }}>    Keluar</Text>
                            </View>
                            <View style={{ borderRadius: hp(5) / 2, width: hp(5), height: hp(5), backgroundColor: '#353434', alignItems: 'center', justifyContent: 'center', marginLeft: -40 }}>
                                <ArrowRightCircleIcon size={hp(4)} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* <Text>{isLoggedIn() ? 'You are logged in' : 'You are not logged in'}</Text> */}
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
                {/* Exit App */}
                <AwesomeAlert
                    show={showExitAlert}
                    showProgress={false}
                    title="Keluar dari Aplikasi"
                    message="Apakah Anda yakin ingin keluar aplikasi?"
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
                {/* Logout success message */}
                <AwesomeAlert
                    show={showLogoutAlert}
                    showProgress={false}
                    title="Berhasil"
                    message="Anda berhasil keluar"
                    closeOnTouchOutside={false}
                    closeOnHardwareBackPress={true}
                    showCancelButton={false}
                    showConfirmButton={true}
                    confirmText="OK"
                    confirmButtonColor="#0891b2"
                    onConfirmPressed={async () => {
                        setShowLogoutAlert(false);
                        navigation.navigate('Home');
                    }}
                />
            </View>
        </View>
    )
}

const Tab = createBottomTabNavigator();

export default function HomeScreenUser() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                style: {
                    elevation: 0,
                },
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
                name="Deteksi Bahan Makanan"
                component={DeteksiScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <ViewfinderCircleIcon color={color} size={size} />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu Makan Harian"
                component={KesehatanScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <CalendarDaysIcon color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>

    );
}