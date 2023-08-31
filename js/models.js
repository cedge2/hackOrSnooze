"use strict";

// Define the base URL for API requests.
const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: Represents a single story in the system
 */

class Story {

  /** Create a new Story instance using story data.
   *   - {storyId, title, author, url, username, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Extract the hostname from the URL and return it. */

  getHostName() {
    return new URL(this.url).host;
  }
}

/******************************************************************************
 * StoryList: Represents a list of Story instances, used to show story lists in the UI
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Fetch and create a StoryList instance.
   *  - Make an API request.
   *  - Create Story instances from the response.
   *  - Return the StoryList instance.
   */

  static async getStories() {
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    const stories = response.data.stories.map(story => new Story(story));

    return new StoryList(stories);
  }

  /** Add a new story to the API and update the StoryList.
   * - user: The current User instance.
   * - obj: {title, author, url}.
   * Returns the new Story instance.
   */

  async addStory(user, { title, author, url }) {
    const token = user.loginToken;
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: { title, author, url } },
    });

    const story = new Story(response.data.story);
    this.stories.unshift(story);
    user.ownStories.unshift(story);

    return story;
  }

  /** Delete a story from the API and update the StoryList.
   * - user: The current User instance.
   * - storyId: The ID of the story to remove.
   */

  async removeStory(user, storyId) {
    const token = user.loginToken;
    await axios({
      url: `${BASE_URL}/stories/${storyId}`,
      method: "DELETE",
      data: { token: user.loginToken }
    });

    this.stories = this.stories.filter(story => story.storyId !== storyId);
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
  }
}

/******************************************************************************
 * User: Represents a user in the system (only used to represent the current user)
 */

class User {
  /** Create a User instance from user data and a token.
   * - {username, name, createdAt, favorites[], ownStories[]}
   * - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    this.loginToken = token;
  }

  /** Register a new user via the API and return a User instance.
   * - username: A new username.
   * - password: A new password.
   * - name: The user's full name.
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Log in a user via the API and return a User instance.
   * - username: An existing user's username.
   * - password: An existing user's password.
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Log in a user automatically via stored credentials.
   * - token: The user's login token.
   * - username: The user's username.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

  /** Add a story to the user's list of favorites and update the API.
   * - story: The Story instance to add to favorites.
   */

  async addFavorite(story) {
    this.favorites.push(story);
    await this._addOrRemoveFavorite("add", story)
  }

  /** Remove a story from the user's list of favorites and update the API.
   * - story: The Story instance to remove from favorites.
   */

  async removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
    await this._addOrRemoveFavorite("remove", story);
  }

  /** Update the API with a favorite/unfavorite action.
   * - newState: "add" or "remove".
   * - story: The Story instance to make a favorite or not favorite.
   * */

  async _addOrRemoveFavorite(newState, story) {
    const method = newState === "add" ? "POST" : "DELETE";
    const token = this.loginToken;
    await axios({
      url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
      method: method,
      data: { token },
    });
  }

  /** Check if a given Story instance is a favorite of this user.
   * - story: The Story instance to check.
   */

  isFavorite(story) {
    return this.favorites.some(s => (s.storyId === story.storyId));
  }
}
