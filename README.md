# GazeReader

Dataset collection mobile app created using React Native and Expo. Created as part of a final year project to estimate text comprehension from gaze data using deep learning.

## Frontend

The frontend is the React Native app itself. It provides reading comprehension exercises to participants and records video files which are uploaded to an S3 bucket. The S3 bucket has been destroyed following the end of the project but the app can still be tested. It simply will not upload the data recorded to any endpoint. The app is built using Expo SDK which allows for easy distribution. 

### Testing the pre-built app on Expo

To view the pre-built app using Expo on an Android device, download the Expo app from the Play Store and visit this [link](https://expo.io/@ziggee/GazeReader) from the device:. For iOS devices, download the Expo app from the App Store and follow the instructions provided in the report's User Guide to access the app on Expo as well.

### Compiling the app

Prerequisites:

* [Node.js](http://nodejs.org)
* [npm](https://www.npmjs.com/)

In order to compile the app from the source code, make sure you have the prerequisites. Clone the repository and change direction in the `frontend` folder.

```shell
cd frontend
```

Install the project dependencies with:

```shell
npm install
```

Then simply run the project with:

```shell
npm start
```

This will open up the Expo instance in your browser. You can then access the app on your local network or build the app into a native binary by following [Expo's documentation](https://expo.io)

### Changing the questions

The current questions are stored in the `frontend/assets/questions.json` file. Replace each part or add more passage and questions as necessary (add references too!). Once again the passages are credited to the respective authors. Questions were self-crafted.

## Backend

The backend serves to handle the automatic uploads and ensures security. It provides an endpoint to which the frontend can query for a pre-signed URL to upload to the S3 bucket. The `index.js` file can be hosted on a server or a lambda. The current implementation uses [Now](https://zeit.co/now) to serve the [backend](https://backend.jwziggee.now.sh). However, the S3 bucket has been disabled so no URL will be returned. You can access the [root](https://backend.jwziggee.now.sh) to see the 'Hi' message on a browser.

To deploy the backend using Now (you will need an account and to sign into the service), change directory into the `backend` folder and run:

```shell
npm install
now
```

You can also deploy using any other service since this is only an `index.js` file.

### Secrets

The `now-secrets.json` file should contain the necessary S3 bucket access keys in order to query for a pre-signed URL.

## Privacy

Note that because the app collects video files, appropriate measures should be taken to comply with privacy laws if saving the files to a server.
