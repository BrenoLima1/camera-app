import React, {useState, useEffect, useRef} from 'react';
import {TouchableOpacity, SafeAreaView, StyleSheet, Text, View, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import { FontAwesome, FontAwesome6, Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

export default function App() {

  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
  const [capturesPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted' ? true : false);
    })();

    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Perdão, precisamos de acesso à galeria para salvar esta imagem!');
  }})();

  }, []);

  if(hasPermission === null){
    return <View/>
  }


  if(hasPermission === false){
    return <Text>Acesso negado!</Text>
  }

  async function takePicture() {
    if(camRef){
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto(data.uri);
      setOpen(true);
      console.log(data);
    }
  }

  async function savePicture() {
      // save to gallery
      Alert.alert(
          "Salvar foto",
          "Deseja salvar a foto?",
          [
              {
                  text: "Cancelar",
                  style: "cancel"
              },
              {
                  text: "OK",
                  onPress: async () => {
                      try{
                          await MediaLibrary.saveToLibraryAsync(capturesPhoto)
                          alert('Foto salva com sucesso!');
                      }catch(err){
                          alert('Erro ao salvar a foto: ' + err.message)
                          console.log('Erro ao salvar a foto: ' + err.message)
                      }finally{
                          setOpen(false);
                          setCapturedPhoto(null);
                      }
                  }
              }
          ]
      );
  }


  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{flex:1}}
      type={type}
      flashMode={flashMode}
      ref={camRef}
      >
        <View style = {{flex: 1, backgroundColor: 'transparent', flexDirection: 'row'}}>
          <TouchableOpacity
          style = {{
            position: 'absolute',
            bottom: 20,
            left: 20,
          }}
          onPress={ () => {
            setType(
              type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
            );

          } }
          >
            <FontAwesome6 name="camera-rotate" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
  style = {{
    position: 'absolute',
    bottom: 20,
    right: 20,
  }}
  onPress={ () => {
    setFlashMode(
      flashMode === Camera.Constants.FlashMode.off
      ? Camera.Constants.FlashMode.on
      : Camera.Constants.FlashMode.off
    );
  } }
>
  <Ionicons name={flashMode === Camera.Constants.FlashMode.on ? "flash" : "flash-off"} size={24} color="#fff" />
</TouchableOpacity>

        </View>
      </Camera>
      <TouchableOpacity style = {styles.button} onPress={takePicture}>
          <FontAwesome name='camera' size={23} color = '#fff'></FontAwesome>
      </TouchableOpacity>

      {capturesPhoto &&
        <Modal
        animationType='slide'
        transparent= {false}
        visible= {open}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems:'center', margin: 20}}>

            <View style = {{margin: 10, flexDirection: 'row'}}>
            <TouchableOpacity style={{margin: 10}} onPress={ ()=> setOpen(false)}>
              <FontAwesome name='window-close' size={50} color='#FF0000'/>
            </TouchableOpacity>

            <TouchableOpacity style={{margin: 10}} onPress={ savePicture}>
              <FontAwesome name='upload' size={50} color='#121212'/>
            </TouchableOpacity>
            </View>

            <Image source={{uri: capturesPhoto}} style={{width: '100%', height: 450, borderRadius: 20}} />
          </View>
        </Modal>

      }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    alignSelf: "center",
    alignItems: 'center',
    backgroundColor: "#121212",
    justifyContent: 'center',
    borderRadius: 10,
    margin: 20,
    borderRadius: 10,
    height: 50,
    width: '80%'
  }
});
