import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AwesomeAlert from 'react-native-awesome-alerts';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';
import URL from '../hooks/cfg';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterAlert, setShowRegisterAlert] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Error', 'Semua form harus diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Email tidak valid');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Kata sandi harus lebih dari 6 karakter');
      return;
    }

    try {
      const response = await axios.post(`${URL}/register`, {
        username,
        email,
        password,
      });
      setShowRegisterAlert(true);
    } catch (error) {
      Alert.alert('Error', error.response.data.error);
    }
  };

  const goToLogin = () => {
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DAFTAR</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nama"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#ccc"
      />
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Buat Akun</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Sudah memiliki akun? </Text>
        <TouchableOpacity onPress={goToLogin}>
          <Text style={styles.footerLink}>Masuk</Text>
        </TouchableOpacity>
      </View>
      <AwesomeAlert
        show={showRegisterAlert}
        showProgress={false}
        title="Berhasil"
        message="Anda berhasil mendaftar"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        confirmText="OK"
        confirmButtonColor="#0891b2"
        onConfirmPressed={() => {
          setShowRegisterAlert(false);
          navigation.navigate('LoginScreen');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f0f4f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
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
    marginBottom: 30,
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
  loginText: {
    textAlign: 'center',
    color: '#0891b2',
    marginTop: 20,
    fontSize: 16,
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

export default RegisterScreen;
