import React , {Component} from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

export default class Perms extends Component{
  state = {
    camera: false,
    audio: false,
    gallery: false
  }

  async askCameraPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ camera: status === 'granted' });
  }
  
  async askAudioPermission() {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({ audio: status === 'granted' });
  }

  async askGalleryPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({ gallery: status === 'granted' });
  }

  async componentDidMount() {
    const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING, Permissions.CAMERA_ROLL)
    if (status == 'granted') {
      this.setState({camera: true, audio: true, gallery: true});
    }
  }

  render() {
    const {camera, audio, gallery} = this.state;
    return (
      <View style={styles.appContainer}>
      
        <View style={styles.container}>
          <Image source={require('../assets/permission.png')} style={styles.icon}></Image>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.description}>As described before, Gaze Reader will take recordings from the front-facing camera and will thus require your permission for both camera and audio. Audio is required for video recordings. Gallery access is needed to save the video recording.</Text>
          <Text style={(camera && audio && gallery) ? styles.thanks : styles.hidden}>Thank you for granting access!</Text>
          { !(camera) && 
          <Button title='Grant Camera Access'
            onPress={() => this.askCameraPermission()}/> }
          { !(audio) && 
          <Button title='Grant Audio Access'
            onPress={() => this.askAudioPermission()}/> }
          { !(gallery) && 
          <Button title='Grant Gallery Access'
            onPress={() => this.askGalleryPermission()}/> }
          { (camera && audio && gallery) && 
          <TouchableOpacity style={styles.ctnbtn} onPress={() => this.props.navigation.navigate('Instructions')}>
            <Text style={styles.ctnbtntext}>Continue</Text>
          </TouchableOpacity> }
        </View>
      </View>
    )
  }
}

const styles = {
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    // alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    margin: 30,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  icon: {
    width: 192,
    height: 192
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },
  description: {
    marginTop: 50,
    fontSize: 20
  },
  thanks: {
    marginTop: 10,
    fontSize: 10,
  },
  hidden: {
    marginTop: 10,
    fontSize: 10,
    color: '#fff'
  },
  ctnbtn: {
    marginTop: 20,
    backgroundColor: "#007aff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  disabledCtnBtn: {
    marginTop: 20,
    backgroundColor: "#999",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  ctnbtntext: {
    fontSize: 20,
    color: "#fff",
  }
}