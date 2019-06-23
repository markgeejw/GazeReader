// Import relevant RN components
import React , {Component} from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';
import { Camera, Permissions } from 'expo';

// Permissions component is the page that requests for access to hardware
// permissions such as camera and audio. This allows the front camera to
// be used by the app for recording
export default class Perms extends Component{
  // State of each permission needed
  state = {
    camera: false,
    audio: false,
    gallery: false
  }

  // Function to request each permission and set the state
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

  // First check if permission is already obtained, in case app is reused
  // This prevents the request buttons from showing up and the user can move on
  // automatically
  async componentDidMount() {
    const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING, Permissions.CAMERA_ROLL)
    if (status == 'granted') {
      this.setState({camera: true, audio: true, gallery: true});
    }
  }

  render() {
    // Retrieve state of each permission
    const {camera, audio, gallery} = this.state;
    return (
      <View style={styles.appContainer}>
      
        <View style={styles.container}>
          {/* Explain permissions needed */}
          <Image source={require('../assets/permission.png')} style={styles.icon}></Image>
          <Text style={styles.title}>Permissions</Text>
          <Text style={styles.description}>As described before, Gaze Reader will take recordings from the front-facing camera and will thus require your permission for both camera and audio. Audio is required for video recordings. Gallery access is needed to save the video recording.</Text>
          <Text style={(camera && audio && gallery) ? styles.thanks : styles.hidden}>Thank you for granting access!</Text>
          {/* Buttons to request each permission */}
          { !(camera) && 
          <Button title='Grant Camera Access'
            onPress={() => this.askCameraPermission()}/> }
          { !(audio) && 
          <Button title='Grant Audio Access'
            onPress={() => this.askAudioPermission()}/> }
          { !(gallery) && 
          <Button title='Grant Gallery Access'
            onPress={() => this.askGalleryPermission()}/> }
          {/* Only show the continue button when all permissions are obtained */}
          { (camera && audio && gallery) && 
          <TouchableOpacity style={styles.ctnbtn} onPress={() => this.props.navigation.navigate('Instructions')}>
            <Text style={styles.ctnbtntext}>Continue</Text>
          </TouchableOpacity> }
        </View>
      </View>
    )
  }
}

// Stylesheet to style our components
const styles = {
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  container: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
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