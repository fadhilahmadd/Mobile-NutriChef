import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text, Alert, Image, CheckBox } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AwesomeAlert from 'react-native-awesome-alerts';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import URL from '../hooks/cfg';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showLoginAlert, setShowLoginAlert] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Semua form harus diisi');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Email tidak valid');
            return;
        }

        try {
            const response = await axios.post(`${URL}/login`, { email, password });
            const token = response.data.token;
            await AsyncStorage.setItem('token', token);

            const usernameResponse = await axios.get(`${URL}/username/${email}`);
            const username = usernameResponse.data.username;

            await AsyncStorage.setItem('username', username);

            setShowLoginAlert(true);
        } catch (error) {
            Alert.alert('Error', error.response.data.error);
        }
    };

    const goToRegister = () => {
        navigation.navigate('RegisterScreen');
    };

    return (
        <View style={styles.container}>
            <Image source={require('../../assets/images/NutriChef.png')} style={styles.logo} />
            <Text style={styles.welcomeText}>LOGIN</Text>
            <Text style={styles.subTitle}>Masuk menggunakan akun anda!</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
                keyboardType="email-address"
            />
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Kata Sandi"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    placeholderTextColor="#ccc"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
                    {showPassword ? <EyeSlashIcon size={24} color="grey" /> : <EyeIcon size={24} color="grey" />}
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>MASUK</Text>
            </TouchableOpacity>
            <View style={styles.footer}>
                <Text style={styles.footerText}>Tidak memiliki akun? </Text>
                <TouchableOpacity onPress={goToRegister}>
                    <Text style={styles.footerLink}>Buat Akun</Text>
                </TouchableOpacity>
            </View>
            <AwesomeAlert
                show={showLoginAlert}
                showProgress={false}
                title="Berhasil"
                message="Anda berhasil masuk"
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="#0891b2"
                onConfirmPressed={() => {
                    setShowLoginAlert(false);
                    navigation.navigate('HomeScreenUser');
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'start',
        paddingHorizontal: 20,
        backgroundColor: '#f0f4f8',
    },
    logo: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 10,
    },
    subTitle: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 40,
    },
    input: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderColor: '#ccc',
        borderWidth: 1,
        fontSize: 16,
        color: '#000',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#000',
    },
    eyeIconContainer: {
        paddingRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    checkbox: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    forgotPasswordContainer: {
        marginLeft: 'auto',
    },
    button: {
        backgroundColor: '#0891b2',
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
        elevation: 2,
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#333',
    },
    footerLink: {
        fontSize: 14,
        color: '#0891b2',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
