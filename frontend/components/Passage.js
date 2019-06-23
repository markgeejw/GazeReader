// Import relevant componets from RN
import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { StackActions, NavigationActions } from 'react-navigation';
// Camera and MediaLibrary to access camera and save file respectively
import { Camera, MediaLibrary } from 'expo';
// Other helper libraries
import delay from 'delay';
import shortid from 'shortid';

// Function to check if ScrollView has been scrolled to the bottom
// Also used in Agreements page
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

// Passage component is the main exercise component
// Provides 3 passages and 5 questions, stored in assets/questions.json
// Also stores the metadata about the participant's exercise
export default class Passage extends React.Component {
  // Constructor function to initialize the component state
  constructor(props){
    super(props);
    // Find a random passage amongst the three possibilities for a difficulty level
    const randomPassage = Math.floor(Math.random() * 3);
    this.state = {
      id: shortid.generate(),       // id to attach data with agreement
      showing: 'passage',           // showing 'passage' or 'question'
      score: [],                    // score in an array for each level of difficulty
      passageDiff: 0,               // initialize to easy passage difficulty      
      randomPassage: randomPassage, // random passage amongst the three possibilities (passageIndex = passageDiff + randomPassage)                              
      question: 0,                  // initialize to first question
      option: null,                 // which option is selected when answering question
      passages: require('../assets/questions.json'),  // load questions from json asset
      passageRead: false,           // whether or not passage has been read (scrolled to the end)
      recording: false,             // whether or not recording has begun
      duration: 0,                  // duration count to keep track of time (in seconds)
      passagesGiven: [randomPassage], // keep track of which passages was assigned to the participant
      questionTimes: [],              // store the durations at which the participant was answering questions (should be length of 15 since 15 questions)
      passageTimes: [0],              // store the durations at which the participant was reading passages (should be 0 for first passage)
      loading: false                  // whether or not loading is happening (when recording is ended and video files are being saved locally)
    };
  }

  // When component mounts, start counting using a Timer
  // Timer is improvised using setInterval function
  // Time is used to log when the user starts a passage or a question
  componentDidMount() {
    this.intervalID = setInterval( () => {
      var { duration } = this.state;
      this.setState({
        duration : duration + 1
      })
    }, 1000)
  }
  
  // When unmount the interval function has to be cleared
  // This prevents memory leaks
  componentWillUnmount(){
    clearInterval(this.intervalID);
  }

  // async function to start recording the video from the front camera
  // this function also handles navigation to the next Upload page
  async startRecord() {
    // Ensure that camera component has been created
    if (!this.cam) {
      return;
    }
    // Set recording state
    await this.setState({recording: true });
    // Start recording using await
    // Resolution is set to the lowest possible at 16:9 aspect ratio and mute the video
    // The await function only returns when video recording ends
    const record = await this.cam.recordAsync({ quality: Camera.Constants.VideoQuality[(Platform.OS === 'ios') ? '720p': '480p'], mute: true });
    // Save the video file locally as a backup in case automatic upload fails
    await MediaLibrary.createAssetAsync(record.uri);
    // Retrieve metadata from the state to be saved in Upload route
    const { id, score, passagesGiven, questionTimes, passageTimes } = this.state;
    // Pop the last passage to make passagesGiven a length of 3
    passagesGiven.pop();
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      actions: [
        // Upload parameters are passed to the next page
        NavigationActions.navigate({"routeName": "Upload", "params": {id: id, score: score, passagesGiven: passagesGiven, questionTimes: questionTimes, passageTimes: passageTimes, videoUri: record.uri}}),
      ],
    });
    // Use a loading state to render a white screen for 1 second to ensure recording has ended
    await this.setState({loading: true});
    await delay(1000);
    this.props.navigation.dispatch(resetAction);
  }

  // Function to stop recording
  async stopRecord() {
    // Ensure that camera component has been created
    if (!this.cam) {
      return;
    }
    // Stop recording and set state
    await this.cam.stopRecording();
    this.setState({ recording: false});
  }

  // Function to check if answer is correct and also update
  // the state to the new question/passage and also update score
  checkAnswer(currentPassage, currentQuestion) {
    // Retrieve current state
    var { score, passageDiff, randomPassage, question, duration, passagesGiven, questionTimes, passageTimes, showing } = this.state;
    // Check if selected option is the correct answer
    // Either set score to 1 if current score is null (empty array) or add score
    if (this.state.option == currentQuestion['answer']) score[passageDiff] == null ? score[passageDiff] = 1 : score[passageDiff]++; 
    // Update question (++question)
    // But if no more questions, update to next passage        
    if (++question == currentPassage['questions'].length) {   
      // Update score for new passage to start from 0
      if (score[passageDiff] == null) score[passageDiff] = 0;
      // Back to question 1 if new passage
      question = 0;   
      // Update passage
      passageDiff++;      
      // Find a new random passage
      randomPassage = Math.floor(Math.random() * 3);
      // Start showing passage instead
      showing = 'passage';
      // Save the passage started time
      passageTimes.push(duration);
      // Save the passage given to the participant
      passagesGiven.push(passageDiff * 3 + randomPassage);
    }
    // If not end of passage questions, save the new question time
    else questionTimes.push(duration);
    // Update state only if exercise not over (only three passage difficulties)
    // Otherwise re-render leads to error since index will be out of bounds
    if (passageDiff != 3) this.setState({showing: showing, 
                                  score: score, 
                                  passageDiff: passageDiff, 
                                  randomPassage: randomPassage, 
                                  question: question, 
                                  option: null, 
                                  passageRead: false,
                                  passagesGiven: passagesGiven, 
                                  questionTimes: questionTimes, 
                                  passageTimes: passageTimes})
    else {
      // Completed the exercise
      // Stop recording and save it
      this.stopRecord();
      alert("Questions completed! You will now be redirected to the upload page. It may take a second or two.");
    }
  }

  render() {
    // Retrieve current state
    const { passageDiff, randomPassage, passageRead, question, questionTimes, duration, option, passages, loading } = this.state;
    // Obtain the current passage from the questions json
    const currentPassage = passages['passages'][passageDiff * 3 + randomPassage];
    // Obtain current question
    const currentQuestion = currentPassage['questions'][question];
    // Combine array of passage paragraphs into an array of Text components
    let passageToRender = [];
    for (i=0; i<passages['passages'][passageDiff * 3 + randomPassage]['passage'].length; i++){
      passageToRender.push(<Text key={i} style={styles.passage}>{currentPassage['passage'][i]}</Text>)
    }
    // Combine array of options into array of key value pairs to be rendered as a numbered list
    let optionsToRender = [];
    for (i=0; i<5; i++){
      optionsToRender.push({key: currentQuestion['options'][i]})
    }
    return (
      <View style={styles.appContainer}>
        {/* Camera component */}
        <Camera 
          ref={ref => {this.cam = ref; /* create reference in component class to allow for recording functions to be called */}}
          style={{ marginTop: -1, height: 1, width: 1 } /* to hide the camera component */}
          ratio={'16:9'} 
          onCameraReady={() => {this.startRecord()} /* initialize recording once camera is loaded */}
          type={Camera.Constants.Type.front /* use the front camera */}>
        </Camera>
        {/* Render passage */}
        { !loading && (this.state.showing == 'passage') && <View style={styles.passageContainer}>    
          {/* Reference to author */}
          <Text style={styles.reference}>Adapted from {(currentPassage['reference'])}</Text>
          {/* ScrollView to display the passage */}
          <ScrollView
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.setState({
                    passageRead: true
                })
              }
            }}
            scrollEventThrottle={500}>
            <View>
              {passageToRender}
            </View>
          </ScrollView>
          {/* Button to show questions - only enabled when finished reading */}
          <TouchableOpacity disabled={!passageRead} 
                            style={!passageRead ? styles.disabledSubmit : styles.submit} 
                            onPress={() => {
                              questionTimes.push(duration);
                              this.setState({showing: 'question', questionTimes: questionTimes});
                            }}>
            <Text style={styles.submittext}>To questions</Text>
          </TouchableOpacity>
        </View> }
        {/* Render question and options */}
        { ! loading && (this.state.showing == 'question') && <View style={styles.questionContainer}>
          {/* Render question */}
          <Text style={styles.item}>{currentQuestion['question']}</Text>
          {/* Render options */}
          <FlatList style={{marginTop: 5, paddingRight: 10}}
            data={optionsToRender}
            renderItem={({item, index}) => <Text onPress={() => this.setState({option: index})} style={(option == index) ? styles.itemSelected : styles.item}>{String.fromCharCode(index+65)}. {item.key}</Text>}></FlatList>
          {/* Button to submit the answer */}
          <TouchableOpacity disabled={(option == null)} style={(option == null) ? styles.disabledSubmit : styles.submit} onPress={() => this.checkAnswer(currentPassage, currentQuestion)}>
            <Text style={styles.submittext}>Submit</Text>
          </TouchableOpacity>
        </View> }

      </View>
    );
  }
}

// Stylesheet for styling components
const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  passageContainer: {
    flex: 1,
    padding: 30
  },
  questionContainer: {
    flex: 1,
    padding: 30
  },
  passage: {
    fontSize: 21,
    paddingRight: 10,
    paddingBottom: 10
  },
  reference: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 5,
  },
  item: {
    fontSize: 21,
    marginVertical: 10,
    borderColor: 'transparent',
    borderWidth: 2,
    borderRadius: 5,
    padding: 2
  },
  itemSelected: {
    fontSize: 21,
    marginVertical: 10,
    borderColor: '#007aff',
    borderWidth: 2,
    borderRadius: 5,
    padding: 2
  },
  recording: {
    alignSelf: 'flex-end',
    color: 'red',
    fontSize: 20
  },
  submit: {
    alignSelf: 'flex-end',
    marginTop: 20,
    backgroundColor: "#007aff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  disabledSubmit: {
    alignSelf: 'flex-end',
    marginTop: 20,
    backgroundColor: "#999",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  submittext: {
    fontSize: 20,
    color: "#fff",
  },
  blinkContainer: {
    position: 'absolute',
    marginTop: 100
  },
  alert: {
    color: 'red',
    fontSize: 40,
    borderColor: 'red',
    padding: 10,
    borderWidth: 5
  }
});