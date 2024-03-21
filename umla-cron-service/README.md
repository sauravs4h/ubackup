# umla-cron-service

# Code Documentation

This script is a Node.js application using Express.js, MongoDB, and cron jobs for scheduling tasks. It uses the `node-cron` package to schedule tasks, and `axios` for making HTTP requests.

## Overview

```javascript
const express = require("express");
const cron = require("node-cron");
const axios = require("axios");
const {
  User,
  UserSubscription,
  SubscriptionChecks,
} = require("./models/index.models");
require("dotenv").config();
const app = express();

// ... rest of the code ...
```

The script starts by importing the necessary modules and setting up an Express application. It also imports several models from a local file.

### Task 1: Swipe Reset

```javascript
let task = cron.schedule("*/2 * * * *", async () => {
  // ... task body ...
});
task.start();
```

This task is scheduled to run every 2 minutes. It sends a POST request to a specified endpoint with a page number, then increments the page number if the response count is 100 or more.

### Task 2: Subscription Reset

```javascript
let task2 = cron.schedule("*/1 * * * *", async () => {
  // ... task body ...
});
task2.start();
```

This task is scheduled to run every minute. It finds all users with active subscriptions, checks if their subscriptions have expired, and updates their subscription status if necessary.

### Task 3: SubscriptionChecks Reset

```javascript
let task3 = cron.schedule("0 0 * * *", async () => {
  // ... task body ...
});
task3.start();
```

This task is scheduled to run once a day at midnight. It resets the `profileLimit` field of all documents in the `SubscriptionChecks` collection to `false`.

### Server Start

```javascript
const PORT = process.env.CRON_SERVICE_PORT || 3004;
const start = async () => {
  try {
    app.listen(PORT, () => console.log(`cron-service on port ${PORT} :)`));
  } catch (error) {
    console.log(":(", error);
  }
};
start();
```

### Function Documentation

#### Task 4

- **Purpose:** This function checks and updates the status of arrivals.
- **Schedule:** Runs every minute.
- **Flow:**
  1. Retrieves the current date and time.
  2. Adds 5 hours and 15 minutes to the current time.
  3. Updates the status of arrivals that have passed the specified time to "expired".
- **Error Handling:** Logs any errors that occur during execution.

#### Task 5

- **Purpose:** This function checks and updates the status of offers, coupons, and users.
- **Schedule:** Runs every minute.
- **Flow:**
  1. Retrieves the current date and time.
  2. Adds 5 hours and 1 minute to the current time.
  3. Updates the status of offers and coupons that have passed the specified time to "expired" or "archived".
  4. Updates the status of users who have completed offers to "completed: false".
- **Error Handling:** Logs any errors that occur during execution.

#### Task 6

- **Purpose:** This function resets offers that are not associated with any users.
- **Schedule:** Runs every minute.
- **Flow:**
  1. Retrieves users who have associated offers.
  2. Updates the status of offers that are not associated with any users to "archived".
- **Error Handling:** Logs any errors that occur during execution.

### General Comments

- All tasks run every minute, ensuring frequent updates and checks on various aspects of the system.
- The code follows a consistent structure of retrieving data, processing it, and updating database records based on specified conditions.
- Error handling is implemented for each task, logging errors to the console for debugging and monitoring purposes.
- The purpose, schedule, flow, and error handling are clearly documented for each task, aiding in understanding and maintaining the code.

//

### Function Documentation

#### Task 7

- **Purpose:** This function updates user documents by setting the `notification` field to `true`.
- **Schedule:** Runs every 30 seconds.
- **Flow:**
  1. Retrieves users in batches of 10 from the database.
  2. Sets the `notification` field to `true` for each user.
  3. Stops execution when the number of retrieved users is less than 10.
- **Error Handling:** Logs any errors that occur during execution.

#### Task 8

- **Purpose:** This function creates `UserSlot` documents for users for the next two days.
- **Schedule:** Runs every two days at 11:00 PM.
- **Flow:**
  1. Retrieves users in batches of 10 from the database.
  2. Calculates dates for the next two days (`nextDate` and `dayAfterNextDate`).
  3. Creates a `UserSlot` document for each user for both days.
  4. Stops execution when the number of retrieved users is less than 10.
- **Error Handling:** Logs any errors that occur during execution.

#### Task 9

- **Purpose:** This function creates `UserSlot` documents for users for the day after next.
- **Schedule:** Runs every day at 11:00 PM.
- **Flow:**
  1. Retrieves users in batches of 10 from the database.
  2. Calculates dates for the next two days (`nextDate` and `dayAfterNextDate`).
  3. Creates a `UserSlot` document for each user for the day after next.
  4. Stops execution when the number of retrieved users is less than 10.
- **Error Handling:** Logs any errors that occur during execution.

### General Comments

- The functions follow a similar structure of retrieving data in batches, processing it, and stopping execution when the batch size is less than 10.
- Error handling is consistent in all functions, with errors being logged to the console.
- The purpose, schedule, flow, and error handling are well-defined for each function, aiding in understanding and maintaining the code.

### Function Documentation

#### Task 10

- **Purpose:** This function creates `UserSlot` documents for each user with the current date.
- **Schedule:** Runs daily at 6:16 AM.
- **Flow:**
  1. Retrieves users from the database in batches of 10, skipping batches based on the value of `x`.
  2. Calculates the current date and the dates for the next two days.
  3. Iterates over each user and creates a `UserSlot` document with the current date.
  4. Stops the loop if fewer than 10 users are retrieved in a batch.
- **Error Handling:** Logs any errors that occur during execution.

#### Task 11

- **Purpose:** This function adds a default value to the `hideTime.shouldHide` field in the `User` model.
- **Schedule:** Runs daily at 6:25 PM.
- **Flow:**
  1. Retrieves users from the database in batches of 10, skipping batches based on the value of `x`.
  2. Updates each user's `hideTime.shouldHide` field to `false`.
  3. Stops the loop if fewer than 10 users are retrieved in a batch.
- **Error Handling:** Logs any errors that occur during execution.

### General Comments

- Both tasks run daily at different times to perform specific operations related to user data.
- Task 10 ensures that `UserSlot` documents are created daily for users, allowing for scheduling and booking functionality.
- Task 11 sets a default value for the `shouldHide` field in the `hideTime` object of the `User` model, ensuring consistency in user data.
- Error handling is implemented to log any errors encountered during the execution of tasks, aiding in debugging and maintenance.

### Function Documentation

#### Task 12

- **Purpose:** This function refreshes the like and response counts for swipe actions.
- **Schedule:** Runs daily at 6:32 PM.
- **Flow:**
  1. Retrieves swipe data from the database in batches of 10, skipping batches based on the value of `x`.
  2. Iterates over each swipe and updates its `likesRemaining` and `responsesRemaining` fields to 4.
  3. Stops the loop if fewer than 10 swipes are retrieved in a batch.
- **Error Handling:** Logs any errors that occur during execution.

#### Task 13

- **Purpose:** This function checks the time of group meetings and updates their status if they have expired.
- **Schedule:** Runs every minute.
- **Flow:**
  1. Retrieves the current time in the Asia/Kolkata timezone.
  2. Updates the status of group meetings with an offerStatus of "pending" and dateTime less than or equal to the current time to "expired".
- **Error Handling:** Logs any errors that occur during execution.

### General Comments

- Task 12 ensures that the like and response counts for swipes are regularly reset to 4, maintaining consistency in the application's behavior.
- Task 13 monitors group meeting times and automatically updates their status if they have expired, ensuring accurate representation of meeting statuses.
- Both tasks run at different intervals to handle specific functionalities related to swipe actions and group meetings.
- Error handling is implemented to log any errors encountered during the execution of tasks, facilitating debugging and maintenance efforts.

Finally, the script starts an Express server on a specified port.
