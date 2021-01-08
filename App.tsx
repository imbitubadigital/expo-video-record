import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import { StyleSheet, Alert, Text, View, SafeAreaView, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
//import { Camera } from 'expo-camera';
//import {FontAwesome} from '@expo/vector-icons';
//import * as Permissions from 'expo-permissions';
//import * as MediaLibrary from 'expo-media-library';
//import { Video, Audio } from 'expo-av';

export default function App() {
  const canRef = useRef<any>(null);
  const scrollRef = useRef<any>(null);


 /*  useEffect(() => {
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
  }, []) */



  return (
    <>
     <StatusBar style="auto" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={{ padding: 20 }}
          ref={scrollRef}
        >

            <Text>Texto 01</Text>

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
