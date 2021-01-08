import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { StyleSheet, Button, Alert, Text, View, Platform, SafeAreaView, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
//import { Camera } from 'expo-camera';
//import {FontAwesome} from '@expo/vector-icons';
//import * as Permissions from 'expo-permissions';
//import * as MediaLibrary from 'expo-media-library';
//import { Video, Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function App() {
  const canRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const [image, setImage] = useState('');
  const [photo, setPhoto] = useState('');

   useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, voce precisa permitir camera!');
        }
      }
    })();
  }, []);

   const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

   const takeImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setPhoto(result.uri);
    }
  };



  return (
    <>
     <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ padding: 20 }}
          ref={scrollRef}
        >
<Text>Aquiiiiiii</Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pegar imagem da galeria" onPress={pickImage} />

            {image !== '' && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
            <Button title="Tirar foto" onPress={takeImage} />

            {photo !== '' && <Image source={{ uri: photo }} style={{ width: 200, height: 200 }} />}
          </View>

        </ScrollView>

      </SafeAreaView>
      </>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 60,
  },

  footer:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'blue',
  }
});
