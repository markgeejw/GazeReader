import React , {Component} from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom;
};

export default class DataAndPrivacy extends Component{
  state = {
    enabled: false,
    name: null
  }

  render(){
    return (
      <View style={styles.appContainer}>
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
          <Text style={styles.title}>First things first</Text>
          <Text style={styles.description}>Please read the following information and agreement. By tapping 'Agree and Continue', you are giving consent to the following agreement.</Text>
          <ScrollView 
            style={styles.tcContainer}            
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.setState({
                    enabled: true
                })
              }
            }}
            scrollEventThrottle={500}>
            <Text style={styles.tcTitle}>Gaze Reader Usage Agreement</Text>
            <Text style={styles.tcP}>Welcome to Gaze Reader, an application used to collect data for a student research project.</Text>
            <Text style={styles.tcP}>The data collected is listed below. Since this is done as part of a project, your collected data will be completely erased within one month (July 2019) Meanwhile, the data is stored securely on a server.</Text>
            <Text style={styles.tcL}>{'\u2022'} Gaze Reader utilizes your device's front-facing camera to record your face during the use of the application. Specifically, this refers to when you are attempting the reading comprehension exercises.</Text>
            <Text style={styles.tcL}>{'\u2022'} These video recordings of your face, as well as your answers and scores for the reading comprehension will be saved although your identity will remain anonymous.</Text>
            <Text style={styles.tcL}>{'\u2022'} The data collected is intended to be used for researching a means to infer text comprehension (your comprehension score) from eye gaze data (face recordings). Your data is thus used only to train a model designed for this purpose.</Text>
            <Text style={styles.tcL}>{'\u2022'} Other supplementary data that could be useful to preprocess the data, including duration of exercises and size of used device will be recorded as well.</Text>
            <Text style={[styles.tcP, {marginBottom: 50}]}>The use of this application is described by the above details. Once again, rest assure that your data will be completely erased with no means of retrieving it within a month (July 2019).</Text>
          </ScrollView>
          {/* <TextInput
            style={styles.input}
            placeholder="Enter name"
            onChangeText={(text) => {
              if (text.length > 0) {
                this.setState({enabled: true, name: text})
              } else {
                this.setState({enabled: false, name: null})
              }
            }}
          /> */}
          <TouchableOpacity disabled={ !this.state.enabled } onPress={ ()=> this.props.navigation.navigate('Permissions') } style={ this.state.enabled ? styles.button : styles.buttonDisabled }><Text style={styles.buttonLabel}>Agree and Continue</Text></TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    );
  }

}

const { width , height } = Dimensions.get('window');

const styles = {
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    margin: 30,
    alignItems: 'center',
    justifyContent: 'center'
    // marginTop: 20,
    // backgroundColor: 'yellow'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  description: {
    marginTop: 20,
    fontSize: 20
  },
  tcTitle: {
    textDecorationLine: 'underline',
    fontSize: 30,
    marginVertical: 30,
    alignSelf: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'sans-serif-condensed'
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'sans-serif-condensed'
  },
  tcL:{
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'sans-serif-condensed'
  },
  tcContainer: {
    marginTop: 20,
    marginBottom: 15,
    padding: 10,
    paddingBottom: 50,
    height: height * 0.5,
    borderColor: '#999',
    borderWidth: 1
    // backgroundColor: 'green'
  },
  input: {
    marginTop: 10,
    marginBottom: 20,
    height: 40,
    width: 250,
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 30,
    fontSize: 20
  },
  button:{
    backgroundColor: "#007aff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  
  buttonDisabled:{
    backgroundColor: '#999',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  buttonLabel:{
    fontSize: 20,
    color: '#FFF',
    alignSelf: 'center'
  }
}