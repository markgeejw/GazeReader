import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Camera, MediaLibrary } from 'expo';
import delay from 'delay';
import shortid from 'shortid';
import { StackActions, NavigationActions } from 'react-navigation';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};
export default class Passage extends React.Component {
  constructor(props){
    super(props);
    const randomPassage = 2;
    this.state = {
      id: shortid.generate(),     // id to attach data with agreement
      showing: 'passage',
      score: [],      // score in an array, split into each passage
      passageDiff: 0,     // initialize to first passage      
      randomPassage: randomPassage,                               
      question: 0,    // initialize to first question
      option: null,   // option selected
      passages: require('../assets/questions.json'),
      passageRead: false,
      recording: false,
      duration: 0,
      passagesGiven: [randomPassage], 
      questionTimes: [],
      passageTimes: [0],
      loading: false
    };
  }

  componentDidMount() {
    this.intervalID = setInterval( () => {
      var { duration } = this.state;
      this.setState({
        duration : duration + 1
      })
    }, 1000)
  }
  
  componentWillUnmount(){
    clearInterval(this.intervalID);
  }

  async startRecord() {
    if (!this.cam) {
      return;
    }
    await this.setState({recording: true });
    const record = await this.cam.recordAsync({ quality: Camera.Constants.VideoQuality[(Platform.OS === 'ios') ? '720p': '480p'], mute: true });
    await MediaLibrary.createAssetAsync(record.uri); // Create just local copy in case of upload error
    // result = await this.uploadImageAsync(record.uri);
    // console.log(result);
    // json_result = await this.uploadJson();
    // console.log(json_result);
    // Retrieve state to be saved in Upload route
    const { id, score, passagesGiven, questionTimes, passageTimes } = this.state;
    passagesGiven.pop();
    const resetAction = StackActions.reset({
      index: 0, // <-- currect active route from actions array
      actions: [
        NavigationActions.navigate({"routeName": "Upload", "params": {id: id, score: score, passagesGiven: passagesGiven, questionTimes: questionTimes, passageTimes: passageTimes, videoUri: record.uri}}),
      ],
    });
    await this.setState({loading: true});
    await delay(1000);
    this.props.navigation.dispatch(resetAction);
    // this.props.navigation.navigate('Upload', {id: id, score: score, questionTimes: questionTimes, passageTimes: passageTimes, videoUri: record.uri});
  }

  async stopRecord() {
    if (!this.cam) {
      return;
    }
    await this.cam.stopRecording();
    this.setState({ recording: false});
  }

  checkAnswer(currentPassage, currentQuestion) {
    // Check if answer is correct and update state
    // Update score
    var { score, passageDiff, randomPassage, question, duration, passagesGiven, questionTimes, passageTimes, showing } = this.state;
    
    if (this.state.option == currentQuestion['answer']) score[passageDiff] == null ? score[passageDiff] = 1 : score[passageDiff]++;          
    if (++question == currentPassage['questions'].length) {   // Update question
      if (score[passageDiff] == null) score[passageDiff] = 0;
      question = 0;   // Back to question 1 if new passage
      passageDiff++;      // Update passage
      randomPassage = 2;
      showing = 'passage';
      passageTimes.push(duration);
      passagesGiven.push(passageDiff * 3 + randomPassage);
    }
    else questionTimes.push(duration);
    // Update state only if exercise not over
    // Otherwise re-render leads to error since index will be out of bounds
    // if (passage != this.state.passages['passages'].length) this.setState({score: score, passage: passage, question: question, option: null, questionTimes: questionTimes, passageTimes: passageTimes})
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
    const { passageDiff, randomPassage, passageRead, question, questionTimes, duration, option, passages, loading } = this.state;
    const currentPassage = passages['passages'][passageDiff * 3 + randomPassage];
    const currentQuestion = currentPassage['questions'][question];
    let passageToRender = [];
    for (i=0; i<passages['passages'][passageDiff * 3 + randomPassage]['passage'].length; i++){
      passageToRender.push(<Text key={i} style={styles.passage}>{currentPassage['passage'][i]}</Text>)
    }
    let optionsToRender = [];
    for (i=0; i<5; i++){
      optionsToRender.push({key: currentQuestion['options'][i]})
    }
    return (
      <View style={styles.appContainer}>
        <Camera 
          ref={ref => {this.cam = ref; /* create reference in component class to allow for recording functions to be called */}}
          style={{ marginTop: -1, height: 1, width: 1 } /* to hide the camera component */}
          ratio={'16:9'}
          onCameraReady={() => {this.startRecord()} /* initialize recording once camera is loaded */}
          type={Camera.Constants.Type.front /* use the front camera */}>
        </Camera>
        { !loading && (this.state.showing == 'passage') && <View style={styles.passageContainer}>    
          <Text style={styles.reference}>Adapted from {(currentPassage['reference'])}</Text>
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
          <TouchableOpacity disabled={!passageRead} 
                            style={!passageRead ? styles.disabledSubmit : styles.submit} 
                            onPress={() => {
                              questionTimes.push(duration);
                              this.setState({showing: 'question', questionTimes: questionTimes});
                            }}>
            <Text style={styles.submittext}>To questions</Text>
          </TouchableOpacity>
        </View> }
        { ! loading && (this.state.showing == 'question') && <View style={styles.questionContainer}>
          <Text style={styles.item}>{currentQuestion['question']}</Text>
          <FlatList style={{marginTop: 5, paddingRight: 10}}
            data={optionsToRender}
            renderItem={({item, index}) => <Text onPress={() => this.setState({option: index})} style={(option == index) ? styles.itemSelected : styles.item}>{String.fromCharCode(index+65)}. {item.key}</Text>}></FlatList>
          <TouchableOpacity disabled={(option == null)} style={(option == null) ? styles.disabledSubmit : styles.submit} onPress={() => this.checkAnswer(currentPassage, currentQuestion)}>
            <Text style={styles.submittext}>Submit</Text>
          </TouchableOpacity>
        </View> }

      </View>
    );
  }
}

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