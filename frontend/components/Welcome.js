import React , {Component} from 'react';
import { View, Text, Image, Button, TouchableOpacity } from 'react-native';

export default class Welcome extends Component{
  state = {

  }

  render() {
    return (
      <View style={styles.appContainer}>
      
        <View style={styles.container}>
          <Image source={require('../assets/gazereader.png')} style={styles.icon}></Image>
          <Text style={styles.title}>Gaze Reader</Text>
          <Text style={styles.description}>Welcome to Gaze Reader! This is a research application, intended to collect a dataset as part of an undergraduate project. Thank you for agreeing to be a part of this!</Text>
          <TouchableOpacity style={styles.ctnbtn} onPress={() => this.props.navigation.navigate('Data')}>
            <Text style={styles.ctnbtntext}>Continue</Text>
          </TouchableOpacity>
          <Text style={styles.details} onPress={() => this.props.navigation.navigate('Details')}>Tell me more</Text>
          {/* <Button title='Tell me more'
            onPress={() => this.props.navigation.navigate('Details')}/> */}
        </View>
      </View>
    )
  }
}

const styles = {
  appContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    // width: 700,
    // marginTop: 50,
    // flex: 1,
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },
  icon: {
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
  },
  details: {
    fontSize: 20,
    color: '#007aff',
    marginTop: 10
  }
}