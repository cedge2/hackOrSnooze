"use strict";

// Global variable to store the list of stories.
let storyList;

/** Function to fetch and display stories when the site first loads. */
async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove(); // Remove loading message.
  putStoriesOnPage(); // Display stories on the page.
}

/**
 * Generate HTML markup for an individual Story instance.
 * - story: An instance of Story.
 * - showDeleteBtn: Show delete button?
 *
 * Returns the markup for the story.
 */
function generateStoryMarkup(story, showDeleteBtn = false) {
  const hostName = story.getHostName(); // Extract the hostname from the URL.
  const showStar = Boolean(currentUser); // Determine if a user is logged in.

  return $(`
      <li id="${story.storyId}">
        <div>
        ${showDeleteBtn ? getDeleteBtnHTML() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <div class="story-author">by ${story.author}</div>
        <div class="story-user">posted by ${story.username}</div>
        </div>
      </li>
    `);
}

/** Create HTML for the delete button. */
function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Create HTML for the favorite/not-favorite star. */
function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}

/** Display the list of stories on the page. */
function putStoriesOnPage() {
  $allStoriesList.empty(); // Clear the stories list.

  // Loop through all stories and generate HTML for them.
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show(); // Show the stories list.
}

/** Function to handle story deletion. */
async function deleteStory(evt) {
  const $closestLi = $(evt.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  // Re-generate the user's stories list.
  await putUserStoriesOnPage();
}

$ownStories.on("click", ".trash-can", deleteStory); // Attach deleteStory function to delete button click.

/** Function to handle story submission form. */
async function submitNewStory(evt) {
  evt.preventDefault(); // Prevent the default form submission behavior.

  // Gather story information from the form.
  const title = $("#create-title").val();
  const url = $("#create-url").val();
  const author = $("#create-author").val();
  const username = currentUser.username;
  const storyData = { title, url, author, username };

  const story = await storyList.addStory(currentUser, storyData);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  $submitForm.slideUp("slow"); // Hide the form with a sliding animation.
  $submitForm.trigger("reset"); // Reset the form fields.
}

$submitForm.on("submit", submitNewStory); // Attach submitNewStory function to form submission event.

/******************************************************************************
 * Functionality for the list of user's own stories
 */

function putUserStoriesOnPage() {
  $ownStories.empty(); // Clear the user's stories list.

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // Loop through the user's stories and generate HTML for them.
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show(); // Show the user's stories list.
}

/******************************************************************************
 * Functionality for favorites list and star/un-star a story
 */

/** Display the favorites list on the page. */
function putFavoritesListOnPage() {
  $favoritedStories.empty(); // Clear the favorites list.

  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // Loop through the user's favorites and generate HTML for them.
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }

  $favoritedStories.show(); // Show the favorites list.
}

/** Function to handle favorite/un-favorite action on a story. */
async function toggleStoryFavorite(evt) {
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($tgt.hasClass("fas")) {
    // The story is already favorited: remove from user's favorites and change star.
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // The story is not favorited: add to user's favorites and change star.
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite); // Attach toggleStoryFavorite function to star click.

