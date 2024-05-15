import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, ScrollView, TouchableOpacity, Alert, StyleSheet, BackHandler } from 'react-native';
import { ChevronLeftIcon, TrashIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { CameraIcon, ExclamationCircleIcon, PhotoIcon } from 'react-native-heroicons/solid';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Loading from '../components/loading';
import Animated, { Easing } from 'react-native-reanimated';

const UploadScreen = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadResponse, setUploadResponse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const navigation = useNavigation();

    useEffect(() => {
        const backAction = () => {
            navigation.navigate('Home');
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);

    // useEffect(() => {
        //Clear selected images and upload response when navigating back to this screen
        // const unsubscribe = navigation.addListener('focus', () => {
        //     setSelectedImages([]);
        //     setUploadResponse(null);
        // });

        // return unsubscribe;
    // }, [navigation]);

    const pickImages = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Peringatan', 'Izin untuk akses media dibutuhkan!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (result.cancelled) {
            return;
        }

        handleImageSelection(result.assets);
    };

    const captureFromCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Peringatan', 'Izin untuk akses kamera dibutuhkan!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (result.cancelled) {
            return;
        }

        const uri = result.uri || (result.assets && result.assets.length > 0 && result.assets[0].uri);

        if (!uri) {
            // alert('Tidak dapat mendapatkan gambar dari camera.');
            return;
        }

        handleImageSelection([{ ...result, name: uri.split('/').pop(), uri: uri }]);
    };

    const handleImageSelection = (images) => {
        const newImages = images.map((item) => {
            const fileType = item.uri.substring(item.uri.lastIndexOf('.') + 1);
            const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                // gif: 'image/gif',
            };
            const mimeType = mimeTypes[fileType.toLowerCase()] || 'application/octet-stream';

            return {
                uri: item.uri,
                name: item.fileName || item.uri.split('/').pop(),
                type: mimeType,
            };
        });

        setSelectedImages([...selectedImages, ...newImages]);
    };

    const uploadImages = async () => {
        setIsLoading(true);
        if (!selectedImages || selectedImages.length <= 0) {
            Alert.alert('Peringatan', 'Tolong pilih gambar untuk diunggah.');
            setIsLoading(false);
            return;
        }

        const data = new FormData();
        selectedImages.forEach((image, index) => {
            data.append('files[]', {
                uri: image.uri,
                name: image.name,
                type: image.type,
            });
        });

        try {
            const response = await fetch('http://192.168.0.114:5000/upload', {
                method: 'POST',
                body: data,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const result = await response.json();
            console.log(result);
            setUploadResponse(result);
            setIsLoading(false);
        } catch (error) {
            console.error('Error uploading images:', error);
            setUploadResponse({ error: 'An error occurred while uploading images.' });
            setIsLoading(false);
        }
    };

    const removeImage = (index) => {
        const updatedImages = [...selectedImages];
        updatedImages.splice(index, 1);
        setSelectedImages(updatedImages);
    };

    const viewRecipeByCategories = () => {
        const allClasses = uploadResponse.results.map((result) => result.class);
        const filteredAllClasses = allClasses.filter((cls) => cls !== "Tidak Diketahui");
        // Filter out "Tidak Diketahui" class
        const filteredClasses = allClasses.filter((cls) => cls !== "Tidak Diketahui");

        const joinedClasses = filteredClasses.join(', ');

        navigation.navigate('RecipeDetectScreen', { categories: joinedClasses, activeCategories: filteredAllClasses });
    };

    const viewRecipeAllByCategories = () => {
        const allClasses = uploadResponse.results.map((result) => result.class);
        const filteredAllClasses = allClasses.filter((cls) => cls !== "Tidak Diketahui");
        // Filter out "Tidak Diketahui" class
        const filteredClasses = allClasses.filter((cls) => cls !== "Tidak Diketahui");

        const joinedClasses = filteredClasses.join(', ');

        navigation.navigate('AllRecipesDetect', { categories: joinedClasses, activeCategories: filteredAllClasses });
    }

    return (
        <ScrollView style={styles.container}>
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.backButton}>
                    <ChevronLeftIcon size={hp(3)} strokeWidth={4.5} color="#0891b2" />
                </TouchableOpacity>
            </View> */}

            <View style={styles.content}>
                {selectedImages.length > 0 && (
                    <View style={styles.imageContainer}>
                        <Text style={styles.heading}>Gambar</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
                            {selectedImages.map((image, index) => (
                                <View key={index} style={styles.imageItem}>
                                    <Image source={{ uri: image.uri }} style={styles.image} />
                                    <TouchableOpacity
                                        onPress={() => removeImage(index)}
                                        style={styles.deleteButton}
                                    >
                                        <TrashIcon size={20} color="red" style={styles.deleteIcon} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={pickImages} style={styles.uploadButton}>
                        <PhotoIcon size={hp(7)} strokeWidth={4.5} color="#0891b2" />
                        <Text style={styles.buttonText}>Unggah Gambar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={captureFromCamera} style={styles.cameraButton}>
                        <CameraIcon size={hp(7)} strokeWidth={4.5} color="#0891b2" />
                        <Text style={styles.buttonText}>Ambil Gambar</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row align-items-center mt-2 mb-2">
                    <ExclamationCircleIcon size={hp(2.2)} color="#eed202" />
                    <Text style={[styles.warningText, { fontSize: hp(1.6) }]}>Unggah atau ambil gambar sayur satu per satu!</Text>
                </View>
                <Button title="Deteksi Gambar" onPress={uploadImages} />

                {/* Display the upload response */}
                {isLoading && <Loading />}
                {uploadResponse && (
                    <View style={styles.uploadResponse}>
                        {uploadResponse.error ? (
                            <Text style={styles.errorText}>{uploadResponse.error}</Text>
                        ) : (
                            <View>
                                <Text style={styles.successText}>Deteksi berhasil:</Text>
                                {uploadResponse.results && uploadResponse.results.length > 0 ? (
                                    <View>
                                        {uploadResponse.results.map((result, index) => (
                                            <View key={index}>
                                                <Text style={[styles.successText, result.class === "Tidak Diketahui" ? styles.redText : null]}>{index + 1}. {result.class}</Text>
                                            </View>
                                        ))}
                                        {/* Conditionally render "View Recipes" button */}
                                        {uploadResponse.results.some(result => result.class !== "Tidak Diketahui") && (
                                            <>
                                                <Text></Text>
                                                <Button title="Lihat Resep Bahan" onPress={viewRecipeByCategories} />
                                            </>
                                        )}
                                        {uploadResponse.results.filter(result => result.class !== "Tidak Diketahui").length > 1 && (
                                            <>
                                                <Text></Text>
                                                <Button title="Lihat Resep Semua Bahan" onPress={viewRecipeAllByCategories} />
                                            </>
                                        )}
                                    </View>
                                ) : (
                                    <Text style={styles.successText}>No results found.</Text>
                                )}
                            </View>
                        )}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: hp(5),
        paddingHorizontal: wp(5),
    },
    backButton: {
        padding: wp(2),
        borderRadius: 100,
        backgroundColor: 'white',
    },
    logo: {
        height: hp(7),
        width: hp(7.5),
    },
    content: {
        paddingHorizontal: wp(4),
        marginTop: hp(8),
        justifyContent: 'space-between',
        flex: 1,
    },
    imageContainer: {
        marginBottom: hp(3),
    },
    heading: {
        fontSize: hp(2.5),
        fontWeight: 'bold',
        color: '#444444',
    },
    imageScrollView: {
        marginTop: hp(1),
    },
    imageItem: {
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    deleteButton: {
        position: 'absolute',
        top: 5,
        right: 5,
    },
    deleteIcon: {
        backgroundColor: 'white',
    },
    buttonContainer: {
        marginBottom: hp(1),
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    uploadButton: {
        borderRadius: hp(2),
        alignItems: 'center',
    },
    cameraButton: {
        borderRadius: hp(2),
        alignItems: 'center',
    },
    buttonText: {
        fontSize: hp(1.6),
        color: '#0891b2',
    },
    uploadResponse: {
        marginTop: hp(2),
    },
    errorText: {
        color: 'red',
    },
    successText: {
        color: 'green',
    },
    redText: {
        color: 'red',
    },
    warningText: {
        color: '#eed202',
    },
});

export default UploadScreen;
