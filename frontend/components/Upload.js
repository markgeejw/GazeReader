// Import relevant RN components
import React , {Component} from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';

// Obtain width and height of screen which is added to metadata to normalize gaze
const { width , height } = Dimensions.get('window');

// Upload page handles the automatic uploading and gives user instructions
// on what to take note of to prevent upload from dying (locking phone/minimizing)
export default class Upload extends Component{
  // Progress of upload in state
  constructor(props){
    super(props);
    this.state = {
      uploadingProgress: 0,       // 0 - not started, 1 - in progress, 2 - done
    }
  }
  // Wrapper to handle all uploads
  // Set the state accordingly depending on state of upload
  async uploadData(){
    this.setState({ uploadingProgress: 1 });
    const { videoUri } = this.props.navigation.state.params;
    // We upload JSON first in case video upload fails the JSON is still saved to the server
    json_result = await this.uploadJsonAsync();
    result = await this.uploadVideoAsync(videoUri);
    this.setState({ uploadingProgress: 2 });
  }

  // Obtain presigned URL from the backend to upload jSON
  // The function expects metadata about the file itself (json type)
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

  // Obtain presigned POST request from backend to upload video
  // The function expects metadata about the file itself (video/mp4)
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

  // Function to upload the video using a form to S3
  async uploadVideoAsync(uri) {
    const { id } = this.props.navigation.state.params;
    // Obtain presigned post request
    let rawResponse = await this.getPresignedPost({"key": id + ".mp4", "type": "video/mp4"});
    // Parse the returned presigned POST to fill up the form
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
    // Fill up the form using details from the obtained presigned POST
    let formData = new FormData();
    for (var key in fields){
      formData.append(key, fields[key]);
    }
    // Add the video file
    formData.append('file', {
      uri,
      name: 'video.mp4',
      type: 'video/mp4'
    });
    // Details of POST request
    // The body is the form we created
    // Multipart content-type is needed for uploading files
    let options = {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/formdata',
      },
    };
    // Execute upload using fetch API
    return fetch(url, options);
  }

  // Function to upload JSON to S3
  async uploadJsonAsync() {
    const { id, score, passagesGiven, questionTimes, passageTimes } = this.props.navigation.state.params;
    // Obtain the presigned url
    let rawResponse = await this.getPresignedUrl({"key": id + ".json", "type": "application/json"});
    // Parse the returned response for the url
    let response = await rawResponse.json();
    console.log(response);
    let presignedUrl = "";
    if (response['success']){
      presignedUrl = response['urls'][0];
    } else {
      return "Upload JSON failed";
    }
    // Create metadata object about the exercise attempt to be saved as a JSON
    var metadata = { id: id, score: score, passagesGiven: passagesGiven, questionTimes: questionTimes, passageTimes: passageTimes, width: width, height: height };
    // Details of POST request
    // Simple JSON post
    let options = {
      method: 'PUT',
      body: JSON.stringify(metadata),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    };
    // Execute upload using fetch API
    return fetch(presignedUrl, options);
  }

  // Helper function to return to the start of the app
  // Allows the app to be reused on the same device for another participant
  returnToWelcome() {
    // Reset the stack so new participant cannot access past participant's attempt
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      actions: [
        NavigationActions.navigate({"routeName": "Welcome"}),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  render() {
    // Render each part depending on where the user is on the uploading process
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