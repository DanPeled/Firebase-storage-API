import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-storage.js";
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

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);

let currentUser = null;

onAuthStateChanged(auth, (user) => {
	if (user) {
		currentUser = user;
		document.getElementById('loginButton').style.display = "none";
		document.getElementById('registerButton').style.display = "none";
		document.getElementById('login-form').style.display = "none";
		document.getElementById('register-form').style.display = "none";
		document.getElementById('upload-section').style.display = 'block';
		document.getElementById('logoutButton').style.display = 'inline-block';

		// Fetch and display user's uploaded files
		fetchAndDisplayUserFiles();
	} else {
		currentUser = null;
		document.getElementById('login-form').style.display = 'block';
		document.getElementById('register-form').style.display = 'block';
		document.getElementById('upload-section').style.display = 'none';
		document.getElementById('logoutButton').style.display = 'none';

		// Clear the file list when the user logs out
		document.getElementById('fileList').innerHTML = '';
	}
});
function fetchAndDisplayUserFiles() {

	if (!currentUser) {
		console.error("User not authenticated.");
		return;
	}

	const userId = currentUser.uid;
	const fileListContainer = document.getElementById('fileList');
	fileListContainer.innerHTML = 'Loading...';

	const userStorageRef = ref(storage, userId);

	// Function to list files in a folder and its subfolders
	function listFilesInFolder(folderRef) {
		let allFiles = [];

		return listAll(folderRef)
			.then((res) => {
				const files = res.items;
				allFiles = allFiles.concat(files);

				const subfolderPromises = res.prefixes.map((prefix) => {
					return listFilesInFolder(prefix);
				});

				return Promise.all(subfolderPromises);
			})
			.then((subfolderFiles) => {
				return allFiles.concat(...subfolderFiles);
			});
	}

	// List all files in the user's storage
	listFilesInFolder(userStorageRef)
		.then((files) => {
			fileListContainer.innerHTML = ''; // Clear loading message

			const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

			files.forEach((fileRef) => {
				const fileName = fileRef.name;
				const fileExtension = fileName.split('.').pop().toLowerCase();

				if (imageExtensions.includes(fileExtension)) {
					// File is an image, display it as an <img> element
					const downloadURLPromise = getDownloadURL(fileRef);

					const img = document.createElement('img');
					img.style.width = '300px'; // Limit image size to the container width
					img.style.cursor = "pointer";
					downloadURLPromise
						.then((downloadURL) => {
							img.src = downloadURL;
							img.addEventListener('click', (e) => {
								e.preventDefault();
								downloadURLPromise
									.then((downloadURL) => {
										// Open the file in a new tab or window
										window.open(downloadURL);
									})
									.catch((error) => {
										console.error("Error getting download URL:", error);
									});
							})
							const listItem = document.createElement('li');
							listItem.appendChild(img);
							fileListContainer.appendChild(listItem);
						})
						.catch((error) => {
							console.error("Error getting download URL:", error);
						});
				} else {
					// File is not an image, display it as a clickable link
					const downloadURLPromise = getDownloadURL(fileRef);

					const link = document.createElement('a');
					link.href = '#';
					link.textContent = fileName;
					link.addEventListener('click', (e) => {
						e.preventDefault();
						downloadURLPromise
							.then((downloadURL) => {
								// Open the file in a new tab or window
								window.open(downloadURL);
							})
							.catch((error) => {
								console.error("Error getting download URL:", error);
							});
					});

					const listItem = document.createElement('li');
					listItem.appendChild(link);
					fileListContainer.appendChild(listItem);
				}
			});

			if (fileListContainer.children.length === 0) {
				fileListContainer.innerHTML = 'No files uploaded.';
			}
		})
		.catch((error) => {
			console.error("Error listing files:", error);
			fileListContainer.innerHTML = 'Error fetching files. Please check the console for details.';
		});
}

function uploadFile(file, originalFilename) {
	if (!currentUser) {
		console.error("User not authenticated.");
		return;
	}
	const folders = { 'jpeg': 'images', 'png': 'images', 'gif': 'images', 'jpg': 'images', 'txt': 'text' }
	const userId = currentUser.uid;
	const fileExtension = originalFilename.split('.').pop();
	const folder = folders[fileExtension]
	const timestamp = Date.now();
	const filename = `${originalFilename.replace(/\s+/g, '_').toLowerCase().replace('.', '_')}_${timestamp}.${fileExtension}`;

	const fileRef = ref(storage, `${userId}/${folder}/${filename}`);

	const reader = new FileReader();

	reader.onload = (event) => {
		const fileData = event.target.result;

		uploadBytes(fileRef, fileData)
			.then((snapshot) => {
				console.log('Uploaded');
				document.getElementById('status').textContent = 'Status: Upload successful';

				const progressBar = document.getElementById('progress');
				progressBar.value = 100;
			})
			.catch((error) => {
				console.error("Upload error:", error);
				document.getElementById('status').textContent = 'Status: Upload failed';
			});
	};

	reader.readAsArrayBuffer(file);
}

document.addEventListener("DOMContentLoaded", () => {
	const fileInput = document.getElementById("fileInput");
	const uploadBtn = document.getElementById("uploadBtn");

	// Event listener for file upload button
	uploadBtn.addEventListener("click", () => {
		const file = fileInput.files[0];

		if (file) {
			const originalFilename = file.name;
			document.getElementById('status').textContent = 'Status: Uploading...';
			uploadFile(file, originalFilename);
		} else {
			console.error("No file selected or folder not chosen.");
		}
	});

	// Event listener for logout button
	const logoutButton = document.getElementById("logoutButton");
	logoutButton.addEventListener("click", () => {
		signOut(auth)
			.then(() => {
				console.log("User signed out.");
			})
			.catch((error) => {
				console.error("Logout error:", error);
			});
	});

	// Event listener for registration form submission
	const registerForm = document.getElementById("registerForm");
	registerForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const registerEmail = document.getElementById("registerEmail").value;
		const registerPassword = document.getElementById("registerPassword").value;

		createUserWithEmailAndPassword(auth, registerEmail, registerPassword)
			.then((userCredential) => {
				const user = userCredential.user;
				console.log('User registered:', user);
			})
			.catch((error) => {
				console.error('Registration error:', error);
			});
	});

	// Event listener for login form submission
	const loginForm = document.getElementById("loginForm");
	loginForm.addEventListener("submit", (e) => {
		e.preventDefault();

		const loginEmail = document.getElementById("loginEmail").value;
		const loginPassword = document.getElementById("loginPassword").value;

		signInWithEmailAndPassword(auth, loginEmail, loginPassword)
			.then((userCredential) => {
				const user = userCredential.user;
			})
			.catch((error) => {
				console.error('Login error:', error);
			});
	});
});

document.getElementById("forgotPasswordBtn").addEventListener('click', () => {
	// forgot password handling
})