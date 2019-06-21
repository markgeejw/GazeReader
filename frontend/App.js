// Gaze Reader 
// App for data collection
// Author: Mark Gee, Imperial College London
// Supervisor: Professor Yiannis Demiris
// Credits to Wichal.wi, Freepik, wanicon

import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import DataAndPrivacy from './components/Data'
import Passage from './components/Passage'
import Welcome from './components/Welcome'
import Details from './components/Details'
import Perms from './components/Permissions';
import Instructions from './components/Instructions';
import Upload from './components/Upload'
import Credits from './components/Credits'

const AppNavigator = createStackNavigator(
  {
    Welcome: Welcome,
    Data: DataAndPrivacy,
    Details: Details,
    Permissions: Perms,
    Instructions: Instructions,
    Passage: Passage,
    Upload: Upload,
    Credits: Credits
  },
  {
    initialRouteName: "Welcome"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

