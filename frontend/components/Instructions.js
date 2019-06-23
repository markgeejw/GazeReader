// Import relevant RN components
import React , {Component} from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
// We use the AppIntroSlider component for our instructions page
import AppIntroSlider from 'react-native-app-intro-slider';
import { StackActions, NavigationActions } from 'react-navigation';

// 'Slides' that display the instructions for the app
const slides = [
  {
    key: 'inst0',
    title: 'No distractions!',
    text: 'Please set your device to Do Not Disturb to prevent notifications from distracting your gaze during this exercise.',
    image: require('../assets/dnd.png'),
  },
  {
    key: 'inst1',
    title: 'The task',
    text: 'You are required to read three passages. After each passage, simple questions about the passage will be asked. You have to scroll to the end of each passage before proceeding to the questions. Disclaimer: The passages can be rather mundane, please pace yourself and give your best effort. Your actual results matter! Thanks again!',
  },
  {
    key: 'inst2',
    title: 'Questions',
    text: 'For each question, five options are provided and only one is accurate. Scroll the page as needed to see all options.',
    image: require('../assets/question.jpg'),
  },
  {
    key: 'inst3',
    title: 'Answering',
    text: 'Select the one most appropriate to you, then tap Submit. You will not be allowed to return to a passage or question.',
    image: require('../assets/option.jpg'),
  },
  {
    key: 'inst4',
    title: "That's it!",
    text: 'Once you finish all questions, you will be taken to the upload page. Follow the instructions and the data will be uploaded in no time. Afterwards, you are done!',
    image: require('../assets/done.jpg'),
  },
  {
    key: 'inst5',
    title: 'Thumbs off!',
    text: 'Most importantly, please do take note not to cover the camera with your thumb. Also, do not minimize the app or lock the screen. The exercise should not take longer than 15 minutes. Hit Done once ready.',
    image: require('../assets/thumb.jpg'),
  }
];

// Instructions component informs the participant on how to complete the exercise
// Further, we also ask the participant to take certain precautions in ensuring that
// the data is accurate.
export default class Instructions extends Component {
  // Define a render item function that is used to render each slide
  _renderItem = (item) => {
    return (
      <View style={styles.appContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>{item.title}</Text>
          {/* For the inst1 slide, we have no image to display, and so we set the dims to zero for this slide */}
          <Image style={[styles.image, (item.key=='inst1')?{height: 0, borderWidth: 0}:{}]} source={item.image} />
          <Text style={styles.description}>{item.text}</Text>
        </View>
      </View>
    );
  }
  _onDone = () => {
    // User finished the introduction. Show passages
    // Use the reset action to prevent the back button from
    // being used when the participant is doing the task
    const resetAction = StackActions.reset({
      index: 0, // currect active route from actions array
      actions: [
        NavigationActions.navigate({"routeName": "Passage"}),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }
  // Render the AppIntroSlider component using the above helper functions
  render() {
    return (
      <AppIntroSlider 
        renderItem={this._renderItem} 
        slides={slides}
        bottomButton 
        buttonStyle = { styles.btn }
        buttonTextStyle = { styles.btntext }
        activeDotStyle = {{backgroundColor: "transparent"}}
        dotStyle = {{backgroundColor: "transparent"}}
        paginationStyle = {{alignSelf: 'flex-end'}}
        // hidePagination = {true}
        onDone={this._onDone}/>
    );
  }
}

// Width and height are used for styling
const { width , height } = Dimensions.get('window');

// Stylesheet used to style our components 
const styles = {
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    margin: 30,
    alignItems: 'center',
  },
  image: {
    height: height * 0.3,
    width: width * 0.3,
    borderColor: 'black',
    borderWidth: 2
  },
  title: {
    marginTop: 20,
    marginBottom: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },
  description: {
    marginTop: 20,
    fontSize: 20
  },
  btn: {
    marginBottom: 40,
    alignSelf: 'center',
    backgroundColor: "#007aff",
    paddingHorizontal: 20,
    borderRadius: 30
  },
  btntext: {
    fontSize: 20,
    color: "#fff",
  }
}