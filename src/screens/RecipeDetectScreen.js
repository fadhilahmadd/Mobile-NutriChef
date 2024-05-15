import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Categories from '../components/categories';
import axios from 'axios';
import Recipes from '../components/recipes';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function RecipeDetectScreen({ route }) {
    const { categories } = route.params;
    const { activeCategories } = route.params;
    const [activeCategory, setActiveCategory] = useState(activeCategories[0]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [meals, setMeals] = useState([]);
    const [categoryImage, setCategoryImage] = useState(null);
    const [refreshPage, setRefreshPage] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        getCategories();
        getCategoryImage(activeCategories[0]); // Move getCategoryImage call here
    }, [refreshPage]);
    
    // Use useEffect to trigger getRecipes when categoryImage changes
    useEffect(() => {
        if (categoryImage) {
            getRecipes(activeCategories[0]);
        }
    }, [categoryImage]);

    const getCategories = async (kategori = categories) => {
        const formattedCategories = kategori.replace(/,\s+/g, ',').replace(/\s+/g, '%20');
        try {
            const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/categories_detect/${formattedCategories}`);
            if (response && response.data) {
                const uniqueCategories = response.data.categories.filter((category, index, self) =>
                    index === self.findIndex((c) => (
                        c.strCategory === category.strCategory && c.strCategoryThumb === category.strCategoryThumb
                    ))
                );
                setCategoriesData(uniqueCategories);
            }
        } catch (err) {
            console.log('error: ', err.message);
        }
    }

    const getRecipes = async (kategori = categories) => {
        try {
            const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/meals_detect/${kategori}`);
            // console.log('mendapatkan resep: ', response.data);
            if (response && response.data) {
                setMeals(response.data.meals);
            }
        } catch (err) {
            console.log('error: ', err.message);
        }
    }

    const handleChangeCategory = async (kategori) => {
        getRecipes(kategori);
        setActiveCategory(kategori);
        setMeals([]);
        await getCategoryImage(kategori);
    }

    const getCategoryImage = async (kategori) => {
        try {
            const response = await axios.get(`http://192.168.0.114:5000/api/json/v1/categories_detect/${kategori}`);
            if (response && response.data && response.data.categories && response.data.categories.length > 0) {
                const imageUrl = response.data.categories[0].strCategoryThumb;
                setCategoryImage(imageUrl);
            }
        } catch (err) {
            console.log('Error fetching category image: ', err.message);
        }
    };    

    const handleNavigationBack = () => {
        setRefreshPage(true);
        navigation.goBack();
    }

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
            
            {/* kategori */}
            <View className="pt-4">
                {categoriesData.length > 0 && <Categories categories={categoriesData} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
            </View>

            <View className="pt-4">
                <Recipes meals={meals} categories={activeCategories} />
            </View>
        </ScrollView>
    );
}
