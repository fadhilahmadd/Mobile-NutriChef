import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Recipes from '../components/recipes';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';

export default function AllRecipesDetect({ route }) {
    const { activeCategories } = route.params;
    const [meals, setMeals] = useState([]);
    const [categoryImage, setCategoryImage] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        // getRecipes(activeCategories);
        getCategoryImage(activeCategories);
    }, []);

    useEffect(() => {
        getRecipes(activeCategories);
        // getCategoryImage();
    }, []);

    const getRecipes = async (kategori) => {
        try {
            const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/all_meals_detect/${kategori}`);
            if (response && response.data) {
                setMeals(response.data.meals);
            }
        } catch (err) {
            console.log('error: ', err.message);
        }
    };

    const getCategoryImage = async (kategori) => {
        try {
            const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/all_categories_detect/${kategori}`);
            if (response && response.data && response.data.categories && response.data.categories.length > 0) {
                const imageUrl = response.data.categories[0].strCategoryThumb;
                setCategoryImage(imageUrl);
            }
        } catch (err) {
            console.log('Error fetching category image: ', err.message);
        }
    };

    const handleNavigationBack = () => {
        navigation.goBack();
    };

    return (
        <ScrollView
            className="bg-white flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <StatusBar style='dark' />

            {/* Gambar resep */}
            <View className="justify-center">
                {categoryImage && <Image source={{ uri: categoryImage }} style={{ width: wp(100), height: hp(30), borderRadius: 1, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, marginTop: 0, }} />}
            </View>

            {/* Tombol kembali */}
            <View className="w-full absolute flex-row justify-between items-center pt-14">
                <TouchableOpacity onPress={handleNavigationBack} className="p-2 rounded-full ml-5 bg-white">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#0891b2" />
                </TouchableOpacity>
            </View>

            <View className="pt-4">
                <Recipes meals={meals} categories={activeCategories} />
            </View>
        </ScrollView>
    );
}
