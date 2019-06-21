import React , {Component} from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

const { width , height } = Dimensions.get('window');

export default class Upload extends Component{
  constructor(props){
    super(props);
    this.state = {
      uploadingProgress: 0,       // 0 - not started, 1 - in progress, 2 - done
    }
  }
  
  async uploadData(){
    this.setState({ uploadingProgress: 1 });
    const { videoUri } = this.props.navigation.state.params;
    json_result = await this.uploadJsonAsync();
    result = await this.uploadVideoAsync(videoUri);
    this.setState({ uploadingProgress: 2 });
  }

  async getPresignedUrl(meta) {
    let apiUrl = "https://backend.jwziggee.now.sh/generatepresignedurl"
    let options = {
      method: 'POST',
      body: JSON.stringify(meta),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetch(apiUrl, options);
  }

  async getPresignedPost(meta) {
    let apiUrl = "https://backend.jwziggee.now.sh/createpresignedpost"
    let options = {
      method: 'POST',
      body: JSON.stringify(meta),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetch(apiUrl, options);
  }

  async uploadVideoAsync(uri) {
    const { id } = this.props.navigation.state.params;
    let rawResponse = await this.getPresignedPost({"key": id + ".mp4", "type": "video/mp4"});
    let response = await rawResponse.json();
    console.log(response);
    let url = "";
    let fields = null;
    if (response['success']){
      url = response['response'][0].url;
      fields = response['response'][0].fields;
    } else {
      return "Upload video failed";
    }
  
    let formData = new FormData();
    for (var key in fields){
      formData.append(key, fields[key]);
    }
    formData.append('file', {
      uri,
      name: 'video.mp4',
      type: 'video/mp4'
    });
  
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/formdata',
      },
    };
    return fetch(url, options);
  }

  async uploadJsonAsync() {
    const { id, score, passagesGiven, questionTimes, passageTimes } = this.props.navigation.state.params;
    let rawResponse = await this.getPresignedUrl({"key": id + ".json", "type": "application/json"});
    let response = await rawResponse.json();
    console.log(response);
    let presignedUrl = "";
    if (response['success']){
      presignedUrl = response['urls'][0];
    } else {
      return "Upload JSON failed";
    }
    var metadata = { id: id, score: score, passagesGiven: passagesGiven, questionTimes: questionTimes, passageTimes: passageTimes, width: width, height: height };

    let options = {
      method: 'PUT',
      body: JSON.stringify(metadata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    return fetch(presignedUrl, options);
  }

  returnToWelcome() {
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      actions: [
        NavigationActions.navigate({"routeName": "Welcome"}),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    return (
      <View style={styles.appContainer}>
      
        <View style={styles.container}>
          {(this.state.uploadingProgress == 0) && <Image source={require('../assets/upload.png')} style={styles.icon}></Image>}
          {(this.state.uploadingProgress == 1) && <Image source={require('../assets/blue_loading.gif')} style={styles.gif}></Image>}
          {(this.state.uploadingProgress == 2) && <Image source={require('../assets/done.png')} style={styles.icon}></Image>}

          {(this.state.uploadingProgress == 0) && <Text style={styles.title}>Upload data</Text>}
          {(this.state.uploadingProgress == 1) && <Text style={styles.title}>Uploading</Text>}
          {(this.state.uploadingProgress == 2) && <Text style={styles.title}>All done!</Text>}

          {(this.state.uploadingProgress == 0) && <Text style={styles.description}>Gaze Reader will now upload the data acquired. This may take up to 5 minutes. Please leave the device connected, unlocked, charging and staying on this screen to ensure upload succeeds. Hit Upload once ready.</Text>}
          {(this.state.uploadingProgress == 1) && <Text style={styles.description}>Uploading now... Please make sure the device does not go to sleep!</Text>}
          {(this.state.uploadingProgress == 2) && <Text style={styles.description}>You have completed the exercise. Thank you for participating. You may now close the app or return to the Welcome screen!</Text>}

          {(this.state.uploadingProgress == 0) && <TouchableOpacity style={styles.btn} onPress={() => this.uploadData()}>
            <Text style={styles.btntext}>Upload</Text>
          </TouchableOpacity>}
          {(this.state.uploadingProgress == 2) && <TouchableOpacity style={styles.btn} onPress={() => this.returnToWelcome()}>
            <Text style={styles.btntext}>Return</Text>
          </TouchableOpacity>}
          {(this.state.uploadingProgress == 2) &&<Text style={styles.credits} onPress={() => this.props.navigation.navigate('Credits')}>Credits</Text>}
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
    width: 256,
    height: 192
  },
  gif: {
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
  btn: {
    marginTop: 20,
    backgroundColor: "#007aff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  btntext: {
    fontSize: 20,
    color: "#fff",
  },
  credits: {
    fontSize: 20,
    color: '#007aff',
    marginTop: 10
  }
}