import React , {Component} from 'react';
import { View, Text, Image} from 'react-native';

export default class Done extends Component{

  render() {
    return (
      <View style={styles.appContainer}>
      
        <View style={styles.container}>
          <Image source={require('../assets/icon.png')}></Image>
          <Text style={styles.title}>All done!</Text>
          <Text style={styles.description}>You have completed the exercise. Thank you for participating. You may now close the app!</Text>
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
    width: 700,
    marginTop: 50,
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  title: {
    marginTop: 20,
    fontSize: 30,
    fontWeight: 'bold'
  },
  description: {
    marginTop: 50,
    fontSize: 20
  }
}