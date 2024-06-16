import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, FlatList, Image, Modal } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CalendarPicker from 'react-native-calendar-picker';
import URL from '../hooks/cfg';
import { useNavigation } from '@react-navigation/native';

const KesehatanScreen = () => {
    const [penyakit, setPenyakit] = useState([]);
    const [selectedPenyakit, setSelectedPenyakit] = useState('');
    const [penyakitUser, setPenyakitUser] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [token, setToken] = useState('');
    const [currentPenyakitIndex, setCurrentPenyakitIndex] = useState(0);
    const [month, setMonth] = useState(new Date().getMonth());
    const [year, setYear] = useState(new Date().getFullYear());
    const [isModalVisible, setIsModalVisible] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        fetchToken();
    }, []);

    useEffect(() => {
        if (token) {
            fetchPenyakit();
            fetchPenyakitUser();
        }
    }, [token]);

    const fetchToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                setToken(token);
                console.log('Token diperoleh:', token);
            } else {
                console.error('Token tidak ditemukan');
                Alert.alert('Error', 'Token tidak ditemukan');
            }
        } catch (error) {
            console.error('Error mengambil token:', error.message);
            Alert.alert('Error', 'Gagal mengambil token');
        }
    };

    const fetchPenyakit = async () => {
        try {
            const response = await axios.get(`${URL}/nama-penyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPenyakit(response.data);
        } catch (error) {
            console.error('Error mengambil data menu:', error.message);
            Alert.alert('Error', 'Gagal mengambil data menu');
        }
    };

    const fetchPenyakitUser = async () => {
        try {
            const response = await axios.get(`${URL}/user/penyakit`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setPenyakitUser(response.data);
        } catch (error) {
            console.error('Error mengambil data menu user:', error.message);
            Alert.alert('Error', 'Gagal mengambil data menu user');
        }
    };

    const handleSubmit = async () => {
        if (!selectedPenyakit) {
            Alert.alert('Error', 'Silakan pilih menu');
            return;
        }

        try {
            const response = await axios.post(
                `${URL}/penyakit_user`,
                { penyakit_id: selectedPenyakit },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                Alert.alert('Sukses', 'Menu berhasil dihubungkan dengan user');
                fetchPenyakitUser(); // Refresh daftar penyakit user
                setIsModalVisible(false); // Close the modal
            } else {
                Alert.alert('Error', 'Gagal menghubungkan menu dengan user');
            }
        } catch (error) {
            console.error('Error menghubungkan menu dengan user:', error.message);
            Alert.alert('Error', 'Gagal menghubungkan menu dengan user');
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleMonthChange = (date) => {
        setMonth(date.getMonth());
        setYear(date.getFullYear());
    };

    const getRecipesForSelectedDate = () => {
        if (!selectedDate || penyakitUser.length === 0) {
            return [];
        }

        const dataPenyakit = penyakitUser[currentPenyakitIndex].data;
        const day = selectedDate.getDate();
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();

        const startingIndex = (day + month + year) % dataPenyakit.length;

        const mealTimes = ['Pagi   ', 'Siang ', 'Malam'];
        return mealTimes.map((time, index) => {
            const recipeIndex = (startingIndex + index * 3) % dataPenyakit.length;
            return { ...dataPenyakit[recipeIndex], time };
        });
    };

    const recipes = getRecipesForSelectedDate();

    const monthsIndonesian = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const weekdaysIndonesian = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

    const customDayHeaderStylesCallback = ({ dayOfWeek }) => {
        return {
            style: {
                backgroundColor: '#fff',
            },
            textStyle: {
                color: '#000',
                fontWeight: 'bold',
            }
        };
    };

    const handleNextPenyakit = () => {
        setCurrentPenyakitIndex((currentPenyakitIndex + 1) % penyakitUser.length);
    };

    const handlePreviousPenyakit = () => {
        setCurrentPenyakitIndex((currentPenyakitIndex - 1 + penyakitUser.length) % penyakitUser.length);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>Tambah Menu Makanan</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => {
                    setIsModalVisible(!isModalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Picker
                        selectedValue={selectedPenyakit}
                        onValueChange={(itemValue) => setSelectedPenyakit(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Pilih menu" value="" />
                        {penyakit.map((disease) => (
                            <Picker.Item key={disease.id} label={disease.nama} value={disease.id} />
                        ))}
                    </Picker>
                    <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Submit Penyakit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonClose} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.buttonText}>Tutup</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {penyakitUser.length > 0 && (
                <>
                    <View style={styles.penyakitNavigator}>
                        <TouchableOpacity onPress={handlePreviousPenyakit}>
                            <Text style={styles.navigatorText}>{"<"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.currentPenyakitText}>
                            {penyakitUser[currentPenyakitIndex].nama}
                        </Text>
                        <TouchableOpacity onPress={handleNextPenyakit}>
                            <Text style={styles.navigatorText}>{">"}</Text>
                        </TouchableOpacity>
                    </View>
                    <CalendarPicker
                        onDateChange={handleDateChange}
                        onMonthChange={handleMonthChange}
                        months={monthsIndonesian}
                        weekdays={weekdaysIndonesian}
                        previousTitle="Sebelumnya"
                        nextTitle="Berikutnya"
                        selectedDayColor="#0891b2"
                        customDayHeaderStyles={customDayHeaderStylesCallback}
                    />
                    {selectedDate && (
                        <View style={styles.recipeContainer}>
                            <FlatList
                                data={recipes}
                                keyExtractor={(item) => item.idMeal.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.recipeItem}
                                        onPress={() => navigation.navigate('RecipeDetailUser', { idMeal: item.idMeal, strMealThumb: item.strMealThumb })}
                                    >
                                        <Text style={styles.timeText}>{item.time}</Text>
                                        <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                                        <Text style={styles.recipeText}>{item.strMeal}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 16,
    },
    addButton: {
        backgroundColor: '#0891b2',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 3,
        marginTop: 30,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    picker: {
        height: 50,
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#0891b2',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
        marginBottom: 10,
    },
    buttonClose: {
        backgroundColor: 'grey',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    penyakitNavigator: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    navigatorText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginHorizontal: 10,
    },
    currentPenyakitText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    recipeContainer: {
        flex: 1,
        marginTop: 20,
    },
    recipeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    timeText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
    },
    recipeImage: {
        width: 50,
        height: 50,
        marginRight: 10,
    },
    recipeText: {
        fontSize: 16,
    },
});

export default KesehatanScreen;
