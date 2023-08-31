"use strict";

// Enable strict mode for better error handling and code quality.

// DOM elements are found once and stored for later use:
const $body = $("body"); // Selects the <body> element in the HTML.

const $storiesLoadingMsg = $("#stories-loading-msg"); // Selects the element with id "stories-loading-msg".
const $allStoriesList = $("#all-stories-list"); // Selects the element with id "all-stories-list".
const $favoritedStories = $("#favorited-stories"); // Selects the element with id "favorited-stories".
const $ownStories = $("#my-stories"); // Selects the element with id "my-stories".
const $storiesContainer = $("#stories-container"); // Selects the element with id "stories-container".

// Selectors to find all three story lists:
const $storiesLists = $(".stories-list"); // Selects all elements with class "stories-list".

const $loginForm = $("#login-form"); // Selects the element with id "login-form".
const $signupForm = $("#signup-form"); // Selects the element with id "signup-form".

const $submitForm = $("#submit-form"); // Selects the element with id "submit-form".

const $navSubmitStory = $("#nav-submit-story"); // Selects the element with id "nav-submit-story".
const $navLogin = $("#nav-login"); // Selects the element with id "nav-login".
const $navUserProfile = $("#nav-user-profile"); // Selects the element with id "nav-user-profile".
const $navLogOut = $("#nav-logout"); // Selects the element with id "nav-logout".

const $userProfile = $("#user-profile"); // Selects the element with id "user-profile".

/**
 * This function hides various components on the page.
 * It's used to prepare the interface for individual components to be shown.
 */
function hidePageComponents() {
  const components = [
    $storiesLists,
    $submitForm,
    $loginForm,
    $signupForm,
    $userProfile
  ];
  components.forEach(c => c.hide()); // Hides each component in the 'components' array.
}

/**
 * Overall function to start the app.
 * It initializes the app, checks for logged-in users, fetches and displays stories.
 */
async function start() {
  console.debug("start"); // Logs a debug message to the console.

  // Checks if there's a remembered user and logs them in if credentials are stored.
  await checkForRememberedUser();

  // Fetches and displays stories when the app starts.
  await getAndShowStoriesOnStart();

  // If a logged-in user exists, updates the user interface.
  if (currentUser) updateUIOnUserLogin();
}

// Warns the user about debug messages in the console and calls the 'start' function when the DOM is loaded.
console.warn(
  "HEY STUDENT: This program sends many debug messages to the console." +
  " If you don't see the message 'start' below this, you're not seeing those helpful debug messages." +
  " In your browser console, click on menu 'Default Levels' and add Verbose"
);
$(start); // Calls the 'start' function when the DOM is fully loaded.

