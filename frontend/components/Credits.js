import React , {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';

export default class Credits extends Component{

  render() {
    return (
      <View style={styles.appContainer}>
      
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Credits</Text>
          <Text style={styles.description}>Project and Application Author: Mark Gee</Text>
          <Text style={styles.description}>Supervisor: Professor Yiannis Demiris, Professor of Human-Centred Robotics, Head of ISN, Imperial College London</Text>
          <Text style={styles.description}>Reading comprehension passages and some questions were sourced from exercises and examples freely available available. These include but are not limited to websites by CollegeReadiness, Super Teacher Worksheets, Yayasan Mendaki, Major Tests. </Text>
          <Text style={styles.description}>Several icons were sourced from Flaticon, by authors Wichal.wi, Freepik, wanicon. Loading icon from Google and upload icons by Andrey Khorolets at Dribble.</Text>
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
    // width: 700,
    marginHorizontal: 50,
    // flex: 1,
    contentContainerStyle: {
      justifyContent: 'center',
      alignItems: 'center'
    },
    marginBottom: 30
    // backgroundColor: 'yellow'
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
  }
}