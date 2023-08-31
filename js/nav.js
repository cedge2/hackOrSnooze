"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Function to show the main list of all stories when the site name is clicked */
function navAllStories(evt) {
  console.debug("navAllStories", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  putStoriesOnPage(); // Display the main list of stories on the page.
}

// Attach the 'navAllStories' function to the click event of the site name.
$body.on("click", "#nav-all", navAllStories);

/** Function to show the story submit form when "submit" is clicked */
function navSubmitStoryClick(evt) {
  console.debug("navSubmitStoryClick", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  $allStoriesList.show(); // Show the list of all stories.
  $submitForm.show(); // Show the story submission form.
}

// Attach the 'navSubmitStoryClick' function to the click event of the "submit" link in the navigation.
$navSubmitStory.on("click", navSubmitStoryClick);

/** Function to show favorite stories when "favorites" is clicked */
function navFavoritesClick(evt) {
  console.debug("navFavoritesClick", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  putFavoritesListOnPage(); // Display the user's favorite stories on the page.
}

// Attach the 'navFavoritesClick' function to the click event of the "favorites" link.
$body.on("click", "#nav-favorites", navFavoritesClick);

/** Function to show the user's stories when "my stories" is clicked */
function navMyStories(evt) {
  console.debug("navMyStories", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  putUserStoriesOnPage(); // Display the user's own stories on the page.
  $ownStories.show(); // Show the user's own stories section.
}

// Attach the 'navMyStories' function to the click event of the "my stories" link.
$body.on("click", "#nav-my-stories", navMyStories);

/** Function to show login/signup forms when "login" is clicked */
function navLoginClick(evt) {
  console.debug("navLoginClick", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  $loginForm.show(); // Show the login form.
  $signupForm.show(); // Show the signup form.
  $storiesContainer.hide(); // Hide the stories container.
}

// Attach the 'navLoginClick' function to the click event of the "login" link.
$navLogin.on("click", navLoginClick);

/** Function to hide everything but the user profile when "profile" is clicked */
function navProfileClick(evt) {
  console.debug("navProfileClick", evt); // Debug message to log the function call.
  hidePageComponents(); // Hide all page components.
  $userProfile.show(); // Show the user profile section.
}

// Attach the 'navProfileClick' function to the click event of the "profile" link.
$navUserProfile.on("click", navProfileClick);

/** Function to update the navbar after user login */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin"); // Debug message to log the function call.
  $(".main-nav-links").css('display', 'flex'); // Display the main navigation links.
  $navLogin.hide(); // Hide the login link.
  $navLogOut.show(); // Show the logout link.
  $navUserProfile.text(`${currentUser.username}`).show(); // Display the username in the profile link.
}

