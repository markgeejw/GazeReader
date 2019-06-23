// Import relevant RN components
import React , {Component} from 'react';
import { View, Text, ScrollView } from 'react-native';

// The Credits component is used in the app to inform the user
// of the appropriate credits to be given for the creation of the app
export default class Credits extends Component{
  // Render a simple component with Text components containing the Credits
  render() {
    return (
      <View style={styles.appContainer}>
        {/* ScrollView allows the text to be scrolled */}
        <ScrollView style={styles.container}>
          <Text style={styles.title}>Credits</Text>
          <Text style={styles.description}>Project and Application Author: Mark Gee</Text>
          <Text style={styles.description}>Supervisor: Professor Yiannis Demiris, Professor of Human-Centred Robotics, Head of ISN, Imperial College London</Text>
          <Text style={styles.description}>Reading comprehension passages should be credited to the appropriate authors, which were stated when the passages were displayed.</Text>
          <Text style={styles.description}>Several icons were sourced from Flaticon, by authors Wichal.wi, Freepik, wanicon. Loading icon from Google and upload icons by Andrey Khorolets at Dribble.</Text>
        </ScrollView>
      </View>
    )
  }
}

// Stylesheet used to style our components
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
    marginBottom: 30
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