// Import relevant RN components
import React , {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';

// The Details page gives in-depth information about the app
export default class Details extends Component{

  render() {
    return (
      <View style={styles.appContainer}>
      
        <ScrollView style={styles.container}>
          <Text style={styles.title}>The finer points</Text>
          <Text style={styles.description}>Gaze Reader is an application designed to collect data as part of a BEng Final Year Project at Imperial College London's Electrical Engineering Department. The project is undertaken by Gee Jun Wen Mark and he is the author of this application. Professor Yiannis Demiris is the project supervisor.</Text>
          <Text style={styles.description}>The project is titled 'Use of Gaze Estimation to Infer Text Comprehension' and it seeks to employ deep learning methods to infer how well a reader comprehends a piece of text from his eye gaze alone. Gaze Reader serves to collect data from participants by having them read passages and subsequently having them answer questions about the passage to gauge the level of comprehension. The device's front camera will be activated to record the participants during this exercise to extract the gaze information. Being able to understand a reader's comprehension ability allows us to then try to improve it by introducing automated glossary or sentence simplification. This project thus aims to improve mobile learning environments and help us digest textual information easily. </Text>
          <Text style={styles.description}>Your participation in this project is kindly appreciated and of course your consent will be required to store your data although you may remain anonymous as detailed in the subsequent agreement. Thank you for your time!</Text>
        </ScrollView>
      </View>
    )
  }
}

const styles = {
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    marginHorizontal: 50,
    contentContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    marginBottom: 30,
    paddingRight: 10
  },
  title: {
    alignSelf: 'center',
    marginTop: 30,
    fontSize: 30,
    fontWeight: 'bold'
  },
  description: {
    marginTop: 30,
    fontSize: 20
  },
  ctnbtn: {
    marginTop: 20,
    backgroundColor: "#007aff",
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30
  },
  ctnbtntext: {
    fontSize: 20,
    color: "#fff",
  }
}