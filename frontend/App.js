// Gaze Reader 
// React Native App for data collection
// Author     : Mark Gee
// Supervisor : Prof Yiannis Demiris
// Credits for icon designs go to to Wichal.wi, Freepik, wanicon

// Import React and Navigation
import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

// Import components that make up the app
import DataAndPrivacy from './components/Data'
import Passage from './components/Passage'
import Welcome from './components/Welcome'
import Details from './components/Details'
import Perms from './components/Permissions';
import Instructions from './components/Instructions';
import Upload from './components/Upload'
import Credits from './components/Credits'

// Navigator is used to apply native navigation on RN
// We used a stack navigator for simplicity
const AppNavigator = createStackNavigator(
  // Here, we list all the different pages and the respective components
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
  // Initial route is the Welcome page
  {
    initialRouteName: "Welcome"
  }
);

// Create the app container to be rendered as our main app
const AppContainer = createAppContainer(AppNavigator);

// Define the main app exported
// Render our app created from the navigator
export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

