### Function Documentation

#### handleSwipe

- **Purpose:** Handles the swiping action between users and manages match notifications.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Request Body Parameters:**
  - `actionType`: Type of swipe action (e.g., left, right).
  - `secondUserId`: ID of the second user involved in the swipe.
  - `likeSwipe`: Boolean indicating if it's a like swipe (default: false).
  - `responseSwipe`: Boolean indicating if it's a response swipe (default: false).
- **Flow:**
  1. Updates the swiping data for both users based on the action type (left or right swipe).
  2. Manages the count and type of swipes for the primary user.
  3. Handles match logic when both users swipe right on each other.
  4. Sends push notifications to users for matches and likes.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### resetLikesCronRoute

- **Purpose:** Resets swipe data periodically based on a cron job.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Request Body Parameters:**
  - `page`: Page number for pagination (default: 0).
- **Flow:**
  1. Retrieves swipe data in batches of 100 based on the specified page.
  2. Checks if the reset date has passed for each swipe data and resets the data if necessary.
  3. Updates the reset date for the swipe data.
  4. Sends a response with the count of swipe data processed.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

### General Comments

- The `handleSwipe` function manages the swiping interaction between users, updating their swipe data and handling match notifications.
- `resetLikesCronRoute` is responsible for periodically resetting swipe data based on a cron job, ensuring that users can swipe again after a certain period.
- Both functions include error handling to log errors and send appropriate responses in case of failures.
- The code is structured and commented for clarity and maintainability.