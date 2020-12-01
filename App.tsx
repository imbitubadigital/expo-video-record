import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { StyleSheet, Alert, Text, View, SafeAreaView, TouchableOpacity, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Video } from 'expo-av';

export default function App() {
  const canRef = useRef<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [hasPermission, setHasPermission] = useState(false)
  const [photo, setPhoto] = useState('');
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [recording, setRecording] = useState(false);
  const [myVideo, setMyVideo] = useState('');
  useEffect(() => {
    (async () => {
      const{status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    (async () => {
      const{status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      setHasPermission(status === 'granted');
    })();
    (async () => {
      const{status} = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      setHasPermission(status === 'granted');
    })();
  }, [])

  const takePicture = useCallback(async () => {
    const data = await canRef.current.takePictureAsync();
    setPhoto(data.uri);
    setShow(true)
  }, []);

  const savePhoto = useCallback(async () => {
    const asset = await MediaLibrary.createAssetAsync(photo)
    .then(() => {
      console.log('Salvo com sucesso');
       Alert.alert(
        "Tudo certo!",
        "Imagem salva na galeria com sucesso!",
        [
          { text: "OK" }
        ],
        { cancelable: false }
      );
    })
    .catch(err => {
      console.log('erro', err);
    });
  }, [photo]);

  const recordVideo = useCallback(async () => {
    if(!recording){
      setRecording(true)
      let video = await canRef.current.recordAsync();
      setMyVideo(video.uri);
      console.log('video', video);
  } else {
      setRecording(false)

      canRef.current.stopRecording()
      setShowVideo(true)
  }
  }, [recording]);



  if(!hasPermission){
    return (
      <View>
        <Text>Camera sem permissão</Text>
      </View>
    );
  }

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <Camera
          style={{ flex:1 }}
          type={type}
          ref={canRef}
        >
          <View style={{ flex:1, backgroundColor: 'transparent', flexDirection: 'row'}}>
            <TouchableOpacity
              style={{ position: 'absolute', bottom:25, left:25 }}
              onPress={() => {
                setType(type === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front)
              }}
            >
              <Text style={{ color: '#fff' }}>Trocar</Text>
            </TouchableOpacity>
          </View>
        </Camera>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
          >
            <FontAwesome name="camera" size={26} color="green" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={recordVideo}>
            {recording ? (
              <FontAwesome name="stop-circle" size={26} color="red" />

            ) : (
              <FontAwesome name="play-circle" size={30} color="green" />

            )}
          </TouchableOpacity>
        </View>
        {photo !== '' && (
          <Modal
            animationType='slide'
            transparent={false}
            visible={show}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
              <View style={{ margin: 10, flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{  margin: 10 }}
                  onPress={() => setShow(false)}
                >
                  <FontAwesome name="window-close" size={50} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={{  margin: 10 }}
                  onPress={savePhoto}
                >
                  <FontAwesome name="upload" size={50} color="#121212" />
                </TouchableOpacity>
              </View>
              <Image
                style={{ width: '100%', height: 450, borderRadius: 20 }}
                source={{ uri: photo }}
              />

            </View>

          </Modal>
        )}
        {myVideo !== '' && (
          <Modal
            animationType='slide'
            transparent={false}
            visible={showVideo}
          >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', margin: 20 }}>
              <View style={{ margin: 10, flexDirection: 'row' }}>
                <TouchableOpacity
                  style={{  margin: 10 }}
                  onPress={() => setShowVideo(false)}
                >
                  <FontAwesome name="window-close" size={50} color="red" />
                </TouchableOpacity>
              </View>

              <Video
                source={{ uri: myVideo }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay
                isLooping={false}
                style={{ width: 300, height: 300 }}
              />

            </View>

          </Modal>
        )}
      </SafeAreaView>
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
