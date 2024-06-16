import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RecipeDetailScreen from '../screens/RecipeDetailScreen';
import LoadingDetectScreen from '../screens/LoadingDetectScreen';
import UploadScreen from '../screens/UploadScreen';
import RecipeDetectScreen from '../screens/RecipeDetectScreen';
import AllRecipesDetect from '../screens/AllRecipesDetect';
import RegisterScreen from '../auth/register';
import LoginScreen from '../auth/login';
import HomeScreenUser from '../auth/homeuser';
import RecipeDetailUser from '../screens/RecipeDetailUser';

const Stack = createNativeStackNavigator();

function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
                <Stack.Screen name="LoadingDetect" component={LoadingDetectScreen} />
                <Stack.Screen name="Upload" component={UploadScreen} />
                <Stack.Screen name="RecipeDetectScreen" component={RecipeDetectScreen} />
                <Stack.Screen name="AllRecipesDetect" component={AllRecipesDetect} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="LoginScreen" component={LoginScreen} />
                <Stack.Screen name="HomeScreenUser" component={HomeScreenUser} />
                <Stack.Screen name="RecipeDetailUser" component={RecipeDetailUser} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default AppNavigation;