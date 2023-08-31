"use strict";

// Global variable to hold the User instance of the currently-logged-in user.
let currentUser;

/******************************************************************************
 * User login/signup/logout
 */

/** Function to handle login form submission. If login is successful, sets up the user instance */
async function login(evt) {
  console.debug("login", evt); // Debug message to log the function call.
  evt.preventDefault(); // Prevent the default form submission behavior.

  // Get the username and password from the form inputs.
  const username = $("#login-username").val();
  const password = $("#login-password").val();

  // Use the User.login method to retrieve user info from API and return a User instance.
  currentUser = await User.login(username, password);

  $loginForm.trigger("reset"); // Reset the login form inputs.

  saveUserCredentialsInLocalStorage(); // Save user credentials in local storage.
  updateUIOnUserLogin(); // Update the UI after user login.
}

$loginForm.on("submit", login); // Attach login function to form submission event.

/** Function to handle signup form submission. */
async function signup(evt) {
  console.debug("signup", evt); // Debug message to log the function call.
  evt.preventDefault(); // Prevent the default form submission behavior.

  // Get user details from the signup form inputs.
  const name = $("#signup-name").val();
  const username = $("#signup-username").val();
  const password = $("#signup-password").val();

  // Use the User.signup method to retrieve user info from API and return a User instance.
  currentUser = await User.signup(username, password, name);

  saveUserCredentialsInLocalStorage(); // Save user credentials in local storage.
  updateUIOnUserLogin(); // Update the UI after user signup.

  $signupForm.trigger("reset"); // Reset the signup form inputs.
}

$signupForm.on("submit", signup); // Attach signup function to form submission event.

/** Function to handle click of logout button */
function logout(evt) {
  console.debug("logout", evt); // Debug message to log the function call.
  localStorage.clear(); // Clear user credentials from local storage.
  location.reload(); // Refresh the page to log out the user.
}

$navLogOut.on("click", logout); // Attach logout function to click event of logout button.

/******************************************************************************
 * Storing/recalling previously-logged-in user with localStorage
 */

/** Check for previously remembered user credentials in local storage. */
async function checkForRememberedUser() {
  console.debug("checkForRememberedUser"); // Debug message to log the function call.
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  if (!token || !username) return false;

  // Try to log in with the stored credentials and retrieve a User instance.
  currentUser = await User.loginViaStoredCredentials(token, username);
}

/** Store current user information in local storage. */
function saveUserCredentialsInLocalStorage() {
  console.debug("saveUserCredentialsInLocalStorage"); // Debug message to log the function call.
  if (currentUser) {
    localStorage.setItem("token", currentUser.loginToken);
    localStorage.setItem("username", currentUser.username);
  }
}

/******************************************************************************
 * General UI functionality related to users & profiles
 */

/** Update the UI when a user logs in or signs up. */
async function updateUIOnUserLogin() {
  console.debug("updateUIOnUserLogin"); // Debug message to log the function call.

  hidePageComponents(); // Hide all page components.

  putStoriesOnPage(); // Re-display stories to show "favorite" stars.
  $allStoriesList.show(); // Show the list of stories.

  updateNavOnLogin(); // Update the navigation bar for a logged-in user.
  generateUserProfile(); // Generate the user profile section.
  $storiesContainer.show(); // Show the stories container.
}

/** Generate and display the user profile section on the page. */
function generateUserProfile() {
  console.debug("generateUserProfile"); // Debug message to log the function call.

  // Update profile information with the current user's details.
  $("#profile-name").text(currentUser.name);
  $("#profile-username").text(currentUser.username);
  $("#profile-account-date").text(currentUser.createdAt.slice(0, 10)); // Display account creation date.
}

