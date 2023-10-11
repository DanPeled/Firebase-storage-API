# Firebase Storage and Authentication Example

This is a simple web application that demonstrates how to integrate Firebase Storage and Authentication for user file uploads and authentication.

## Prerequisites

Before getting started, make sure you have the following:

1. [Firebase Account](https://firebase.google.com/): You need to create a Firebase project to get the required configuration details.
2. Firebase Web SDK: You can include Firebase using script tags in your HTML or use a module bundler like Webpack or Rollup.
   - [Firebase Script Tags](https://firebase.google.com/docs/web/setup#script-tags)
   - [NPM Installation](https://www.npmjs.com/package/firebase)

## Project Setup

1. Clone this repository or create a new HTML file and copy the JavaScript code provided in your project.

2. Replace the `YOUR_API_KEY`, `YOUR_AUTH_DOMAIN`, `YOUR_PROJECT_ID`, `YOUR_STORAGE_BUCKET`, `YOUR_MESSAGING_SENDER_ID`, `YOUR_APP_ID`, and `YOUR_MEASUREMENT_ID` in the `firebaseConfig` object with your Firebase project's configuration values. You can find these values in your Firebase project settings.

3. Initialize Firebase and Firebase Storage:

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

const firebaseConfig = {
	apiKey: "YOUR_API_KEY",
	authDomain: "YOUR_AUTH_DOMAIN",
	projectId: "YOUR_PROJECT_ID",
	storageBucket: "YOUR_STORAGE_BUCKET",
	messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
	appId: "YOUR_APP_ID",
	measurementId: "YOUR_MEASUREMENT_ID"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);
```

Create folders in Firebase Storage for different file types. In the provided code, different file extensions are mapped to folders. Adjust the folders object to your requirements.

Configure your HTML structure with the necessary elements. You can refer to the provided code for element IDs and how they are used.

Implement event listeners for user registration, login, and file uploads.

Deploy your application to a web server or hosting service. Make sure to configure your Firebase project's authentication settings to allow your app's domain.

Access your web app and start using Firebase Storage and Authentication!

# Usage
Users can register or log in using the registration and login forms.

After successful authentication, users can upload files. Images are displayed as images, and other file types are shown as clickable links.

Clicking on an image or file link will open the file in a new tab or window.

Users can also log out using the "Logout" button.

# Ideas to add:
- Password restore (e.g by a mail sent to the user).
- A better visual representation of the user files.
- A QR generation for the files to be able to share with other users.
- Other sharing methods.
# Contributing
Feel free to contribute to this project by creating pull requests or opening issues. If you encounter any problems or have ideas for improvements, let me know!

# Documentation
## Firebase Configuration

Firebase is configured with the following settings:

- `apiKey`: Your Firebase project's API key.
- `authDomain`: The authentication domain for your Firebase project.
- `projectId`: Your Firebase project's ID.
- `storageBucket`: The storage bucket for Firebase Storage.
- `messagingSenderId`: The ID of your project's messaging sender.
- `appId`: Your Firebase project's application ID.
- `measurementId`: The measurement ID for analytics (optional).

## Authentication

- The code initializes Firebase with the provided configuration.
- It sets up authentication by creating an `auth` object.
- The `onAuthStateChanged` listener tracks the user's authentication state.
- When a user is authenticated, it hides the login and registration forms and displays the upload section and logout button.

## File Upload and Display

- The code defines a function `fetchAndDisplayUserFiles()` to fetch and display user-uploaded files.
- It lists all files in the user's storage and displays images as images and other files as clickable links.
- It also provides the ability to view or download these files.
- The file list is displayed in an HTML element with the id `fileList`.

## File Upload Function

- The `uploadFile()` function handles file uploads to Firebase Storage.
- It determines the appropriate folder for the file based on its extension.
- The file is read as an ArrayBuffer and then uploaded to the specified folder in Firebase Storage.
- The status and progress of the upload are displayed to the user.
  Example of resulted file stracture:
  ```
  L User ID
  	L Images
  		L Dog.png
  	L Text
  		L goober.txt
  ```
## Event Listeners

- The code sets up event listeners for file uploads, logout, and form submissions.
- The `uploadBtn` listener uploads a selected file to Firebase Storage.
- The `logoutButton` listener signs the user out when clicked.
- The registration and login forms handle user registration and login.
- The "Forgot Password" button (with the id `forgotPasswordBtn`) could handle password recovery, but it's currently commented out.

# License
This project is licensed under the MIT License - see the LICENSE file for details.

Please note that you'll need to adjust the paths, folder structure, and Firebase configuration to fit your project.

