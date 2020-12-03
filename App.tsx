import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { StyleSheet, Alert, Text, View, SafeAreaView, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { Camera } from 'expo-camera';
import {FontAwesome} from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { Video, Audio } from 'expo-av';

export default function App() {
  const canRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.front)
  const [hasPermission, setHasPermission] = useState(false)
  const [photo, setPhoto] = useState('');
  const [show, setShow] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingAudio, setRecordingAudio] = useState(false);
  const [myVideo, setMyVideo] = useState('');

  const [recordingMyAudio, setRecordingMyAudio] = useState<Audio.Recording>();
  const [isAllowRecord, setAllowRecord] = useState("No");
  const [recordingStatus, setRecordingStatus] = useState<Audio.RecordingStatus>();
  const [sound, setSound] = useState<any>('');

  const [playScroll, setPlayStroll] = useState(false);
  const [distance, setDistance] = useState(0);
  const [teste, setTeste] = useState<any>(null);
  const [velocity, setVelocity] = useState(1000);

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
      setAllowRecord(status);
    })();
  }, [])

  const takePicture = useCallback(async () => {
    const data = await canRef.current.takePictureAsync();

    setPhoto(data.uri);
    setShow(true)
    setSound('');
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
      setSound('');
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




    async function _startRecording() {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: true,
      }); // <= important for IOS

      const newRrecording = new Audio.Recording();
      setRecordingMyAudio(newRrecording);

      await newRrecording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
      );

      newRrecording.setOnRecordingStatusUpdate((status: Audio.RecordingStatus) =>
        setRecordingStatus(status)
      );

      await newRrecording.startAsync();
    }


    async function _stopRecording() {
      if (!recordingMyAudio) {
        console.log("You are not recording.")
        return;
      }

      try {
        await recordingMyAudio.stopAndUnloadAsync();
        console.log(`Recorded URI: ${recordingMyAudio.getURI()}`);
        setSound(recordingMyAudio.getURI());
      } catch (error) {

        console.log('deu muito ruim')
        // Do nothing -- we are already unloaded.
      }
    }

  const recordAudio = useCallback(async () => {
      if(!recordingAudio){
        setRecordingAudio(true)
        _startRecording()
        console.log('cima');

      } else {
        _stopRecording();
        setRecordingAudio(false)
        console.log('cima');
      }
  }, [_startRecording, _stopRecording]);

  const play = useCallback(async () => {
    const soundObject = new Audio.Sound();

     try {
      const {
        sound: soundObject,
        status,
      } = await Audio.Sound.createAsync({uri: sound}, { shouldPlay: true });
      // Your sound is playing!
    } catch (error) {
      console.log('ERRRROOOO ao tocar', error);
    }
  }, [sound]);

  const reset = useCallback(() => {
    scrollRef.current.scrollTo({x: 0, y: 0, animated: true});
    setDistance(0);
    setPlayStroll(false);
    clearInterval(teste);
  }, [teste]);

  const roller = useCallback((value) => {
    scrollRef.current.scrollTo({x: 0, y: value, animated: true});
  }, [scrollRef, distance,]);

  const handleInterval = useCallback(() => {
    console.log('distance', distance);
    let newDistance = distance;
    const interval = setInterval(() => {
      console.log('entrou', newDistance);
        roller(newDistance);
       newDistance = newDistance + 5;
       setDistance(newDistance);
      }, velocity);
      setTeste(interval);
  }, [distance, roller, velocity]);


  const top = useCallback(() => {
    if(!playScroll){
      handleInterval();
      setPlayStroll(true);
    } else {
      console.log('baixo');
      setPlayStroll(false);
      clearInterval(teste);
    }
  }, [ playScroll, teste]);


  const increment = useCallback(() => {
    if(velocity > 100){
      const newVelocity = velocity - 100;
      setVelocity(newVelocity);
      clearInterval(teste);
      handleInterval();
    }
  }, [velocity, handleInterval, teste]);

  const decrement = useCallback(() => {
    if(velocity < 5000){
      const newVelocity = velocity + 100;
      setVelocity(newVelocity);
      clearInterval(teste);
      handleInterval();
    }
  }, [velocity, handleInterval, teste]);




  if(!hasPermission){
    return (
      <View>
        <Text>Camera sem permissão</Text>
      </View>
    );
  }

  return (
    <>
     <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ padding: 20 }}
          ref={scrollRef}
        >

            <Text>Texto 01</Text>
            <Text>Texto 02</Text>
            <Text>Texto 03</Text>
            <Text>Texto 04</Text>
            <Text>Texto 05</Text>
            <Text>Texto 03</Text>
            <Text>Texto 06</Text>
            <Text>Texto 07</Text>
            <Text>Texto 08</Text>
            <Text>Texto 09</Text>
            <Text>Texto 10</Text>
            <Text>Texto 11</Text>
            <Text>Texto 12</Text>
            <Text>Texto 13</Text>
            <Text>Texto 14</Text>
            <Text>Texto 15</Text>
            <Text>Texto 16</Text>
            <Text>Texto 17</Text>
            <Text>Texto 18</Text>
            <Text>Texto 19</Text>
            <Text>Texto 20</Text>
            <Text>Texto 21</Text>
            <Text>Texto 22</Text>
            <Text>Texto 23</Text>
            <Text>Texto 24</Text>
            <Text>Texto 25</Text>

        </ScrollView>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 5,
            backgroundColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
          >
            <TouchableOpacity onPress={top}>
              <Text>Rolar</Text>
            </TouchableOpacity>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: 100,
              padding: 5,
            }}>

              <TouchableOpacity onPress={decrement}
                style={{
                  backgroundColor: '#121212',
                  width: 34,
                  height: 34,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                  <Text style={{ color: '#fff' }}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={increment}
               style={{
                backgroundColor: '#121212',
                width: 34,
                height: 34,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              >
                  <Text style={{ color: '#fff' }}>+</Text>
              </TouchableOpacity>

            </View>

            <TouchableOpacity onPress={reset}>
              <Text>Reset</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
      <SafeAreaView style={styles.container}>

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
          {sound !== '' && (
            <View style={{ padding: 15, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity onPress={play}>
                <Text>Ouvir gravação</Text>
              </TouchableOpacity>
            </View>
        )}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePicture}
          >
            <FontAwesome name="camera" size={26} color="green" />
          </TouchableOpacity>
          <View>
            <Text style={{ color: '#fff' }}>{recordingStatus?.durationMillis}</Text>
            <TouchableOpacity style={styles.button} onPress={recordAudio}>
              {recordingAudio ? (
                <FontAwesome name="stop-circle" size={26} color="orange" />
              ) : (
                <FontAwesome name="play-circle" size={30} color="purple" />
              )}
            </TouchableOpacity>
          </View>
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
