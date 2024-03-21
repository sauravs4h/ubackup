# umla-admin-service

# User Authentication Code Flow

This document describes the code flow for user authentication which includes registration, login and logout functionalities.

## 1. Registration

The `register` function is an asynchronous function that handles user registration.

```javascript
const register = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `name`, `email`, `password`, and `role` from the request body.
2. Generates a salt using bcrypt's `genSalt` method.
3. Hashes the password with the generated salt using bcrypt's `hash` method.
4. Creates a new user instance with the provided details and hashed password.
5. Saves the new user to the database.
6. Returns a response with status 201 and the saved user's details.
7. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

## 2. Login

The `login` function is an asynchronous function that handles user login.

```javascript
const login = async (req, res) => {
	...
};
```

### Flow:

1. Finds a user in the database with the email provided in the request body.
2. If no user is found, it returns a response with status 400 and a message stating that the user does not exist.
3. Compares the password provided in the request body with the hashed password of the found user using bcrypt's `compare` method.
4. If the passwords do not match, it returns a response with status 400 and a message stating that the credentials are invalid.
5. Generates a JWT token with the user's id and role as the payload, and the secret key from environment variables.
6. Returns a response with status 200, the token, and the user's details.
7. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

## 3. Logout

The `logout` function is an asynchronous function that handles user logout.

```javascript
const logout = async (req, res) => {
	...
};
```

### Flow:

1. Extracts the authorization header from the request headers.
2. Signs a new JWT token with the extracted authorization header as the payload, an empty string as the secret key, and an expiration time of 1 second.
3. If the token is successfully signed, it returns a response with a message stating that the user has been logged out.
4. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

# Onboarding Requests Code Flow

This document describes the code flow for handling onboarding requests which includes creating, retrieving and updating onboarding requests.

## 1. Creating Onboard Request

The `createOnboardRequest` function is an asynchronous function that handles the creation of onboarding requests.

```javascript
const createOnboardRequest = async (req, res) => {
	...
};
```

### Flow:

1. Extracts various details from the request body.
2. Initializes a data object with these details and an empty images array.
3. Checks if there are any files in the request.
4. If there are files, it loops through each file, uploads it to a blob storage, and adds the image URL to the images array in the data object.
5. Creates a new onboarding request with the data object.
6. Returns a response with status 200 and the created onboarding request.
7. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

## 2. Retrieving Onboard Requests

The `getOnboardRequests` function is an asynchronous function that retrieves onboarding requests.

```javascript
const getOnboardRequests = async (req, res) => {
	...
};
```

### Flow:

1. Initializes a filter object based on the status query parameter in the request.
2. Finds all onboarding requests that match the filter.
3. Returns a response with status 200 and the found requests.
4. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

## 3. Handling Onboard Requests

The `handleOnboardRequest` function is an asynchronous function that updates the status of an onboarding request.

```javascript
const handleOnboardRequest = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `status` and `requestId` from the request body.
2. Finds an onboarding request with the provided id.
3. Updates the status of the found onboarding request with the provided status.
4. Saves the updated onboarding request.
5. Returns a response with status 200 and the updated onboarding request.
6. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

# Registering Admin Code Flow

This document describes the code flow for registering a new admin.

## 1. Registering Admin

The `registerAdmin` function is an asynchronous function that handles the registration of a new admin.

```javascript
const registerAdmin = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `name` and `email` from the request body.
2. Generates a password using the provided name.
3. Creates a salt using bcrypt's `genSalt` method.
4. Hashes the generated password using the created salt with bcrypt's `hash` method.
5. Initializes a new PartnerAdmin object with the provided name, email, and hashed password.
6. Saves the new PartnerAdmin object.
7. Returns a response with status 201 and the saved PartnerAdmin's name, email, and the generated password.
8. If any error occurs during this process, it catches the error and returns a response with status 500 and the error message.

# Creating a Prompt Code Flow

This document describes the code flow for creating a new prompt.

## 1. Creating a Prompt

The `createPrompt` function is an asynchronous function that handles the creation of a new prompt.

```javascript
const createPrompt = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `tag` and `question` from the request body.
2. Tries to create a new Prompt object with the provided tag and question using the `Prompt.create` method.
3. Returns a response with status 201 and the created Prompt object.
4. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'Something went wrong'.

# Subscription Management Code Flow

This document describes the code flow for managing subscriptions.

## 1. Getting All Subscriptions

The `getAllSubscriptions` function is an asynchronous function that retrieves all subscriptions from the database.

```javascript
const getAllSubscriptions = async (req, res) => {
	...
};
```

### Flow:

1. Tries to find all Subscription objects using the `Subscription.find` method.
2. Returns a response with status 200 and the found Subscription objects.
3. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 2. Adding a Subscription

The `addSubscription` function is an asynchronous function that creates a new subscription.

```javascript
const addSubscription = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `name`, `price`, and `validity` from the request body.
2. Tries to create a new Subscription object with the provided name, price, and validity using the `Subscription.create` method.
3. Returns a response with status 201 and the created Subscription object.
4. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 3. Updating a Subscription

The `updateSubscription` function is an asynchronous function that updates an existing subscription.

```javascript
const updateSubscription = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `name`, `price`, `validity`, and `subscriptionId` from the request parameters.
2. Tries to find the Subscription object with the provided id using the `Subscription.findById` method.
3. If the name, price, or validity are provided, it updates the corresponding fields in the Subscription object.
4. Saves the updated Subscription object.
5. Returns a response with status 200 and the updated Subscription object.
6. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

# User Management Code Flow

This document describes the code flow for managing users.

## 1. Getting All Users

The `getUsers` function is an asynchronous function that retrieves all users from the database.

```javascript
const getUsers = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `page` from the request query.
2. Tries to find all User objects using the `User.find` method and applies pagination, sorting, and various count operations.
3. Maps over each user to calculate their referral status.
4. Returns a response with status 200 and the found User objects along with various counts.
5. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 2. Getting Early Bird Users

The `getEarlyBirdUsers` function is an asynchronous function that retrieves early bird users from the database.

```javascript
const getEarlyBirdUsers = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `page` from the request query.
2. Tries to find all User objects where `earlyBird` and `jaipur` are true using the `User.find` method and applies pagination and sorting.
3. Returns a response with status 200 and the found User objects.
4. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 3. Getting Early Bird User Data

The `getEarlyBirdUserData` function is an asynchronous function that retrieves data of an early bird user.

```javascript
const getEarlyBirdUserData = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `userId` from the request parameters.
2. Tries to find the User object with the provided id using the `User.findById` method.
3. Fetches the user's referral data and calculates the referral status.
4. Returns a response with status 200 and the found User object, referrals, and referral status.
5. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 4. Approving Status For Coupon

The `approveStatusForCoupon` function is an asynchronous function that approves a user for a coupon.

```javascript
const approveStatusForCoupon = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `userId` from the request body.
2. Tries to find the User object with the provided id using the `User.findById` method.
3. Updates the user's claimOffer, verified, and claimable fields to true and saves the user.
4. Sends a push notification to the user.
5. Returns a response with status 200 and the updated User object.
6. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 5. Verifying Profile

The `verifyProfile` function is an asynchronous function that verifies a user's profile.

```javascript
const verifyProfile = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `userId` from the request body.
2. Tries to find the User object with the provided id using the `User.findById` method.
3. Sets the user's verified field to true and if verificationDenied was true, sets it to false, then saves the user.
4. Sends a push notification to the user.
5. Returns a response with status 200 and the updated User object.
6. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 6. Second Offer

The `secondOffer` function is an asynchronous function that handles the second offer for a user.

```javascript
const secondOffer = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `userId` and `days` from the request body.
2. Tries to find the User object with the provided id using the `User.findById` method.
3. Updates the user's offerTwo fields and saves the user.
4. Creates a new UserSubscription object and saves it.
5. Sends a push notification to the user.
6. Returns a response with status 200 and success: true.
7. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

## 7. Denying User Verification

The `denyUserVerification` function is an asynchronous function that denies a user's verification.

```javascript
const denyUserVerification = async (req, res) => {
	...
};
```

### Flow:

1. Extracts `userId` from the request body.
2. Tries to find the User object with the provided id using the `User.findById` method.
3. Deletes the user's verification image and updates the user's verificationDenied field to true.
4. Sends a push notification to the user.
5. Returns a response with status 200 and a success message along with the updated User object.
6. If any error occurs during this process, it catches the error, logs it to the console, and returns a response with status 500 and a custom error message 'something went wrong'.

```markdown
# Code Documentation

This asynchronous function retrieves the list of coffee coupons claimed by users in a Node.js application using MongoDB.

## Overview

The function fetches coffee coupons from the database based on the provided pagination parameters (`page`) and a default page size of 20 coupons per page.

### Function: `getCoffeeClaimed(req, res)`

This function retrieves coffee coupons claimed by users.

The function expects the following parameters in the request:

- `page`: (Optional) Specifies the page number for pagination. Default is 1.

The function performs the following steps:

1. Retrieves coffee coupons from the database with pagination using the provided `page` parameter.
2. Populates the coupons with details such as item name, price, outlet name, owner name, and owner WhatsApp number.
3. Counts the total number of coupons available in the database.
4. Responds with the fetched coupons and the total count.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves the list of all users with optional search functionality in a Node.js application using MongoDB.

## Overview

The function retrieves users from the database based on pagination parameters (`page`), a default page size of 50 users per page, and an optional search query.

### Function: `getAllUsers(req, res)`

This function retrieves all users with optional search functionality.

The function expects the following parameters in the request:

- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `search`: (Optional) Specifies the search query to filter users.

The function performs the following steps:

1. Constructs a MongoDB query based on the provided search query, if any.
2. Retrieves users from the database with pagination and optional search filtering.
3. Modifies each user object to include additional information such as city derived from location.
4. Counts the total number of verified and unverified user profiles.
5. Responds with the fetched users, total count of verified profiles, and total count of unverified profiles.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves detailed information about a specific user in a Node.js application using MongoDB.

## Overview

The function fetches detailed information about a user based on the provided `userId`.

### Function: `getUser(req, res)`

This function retrieves detailed information about a user.

The function expects the following parameters in the request:

- `userId`: Specifies the ID of the user to fetch information for.

The function performs the following steps:

1. Retrieves the user document from the database based on the provided `userId`.
2. Retrieves additional information such as swipe count, offer count, and deals created.
3. Constructs user profile information including basic details, profile completion status, verification status, and more.
4. Constructs user profile information including personal details, educational details, professional details, and images.
5. Responds with the fetched user information.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves matches for a specific user in a Node.js application using MongoDB.

## Overview

The function fetches matches for a user based on the provided `userId`.

### Function: `userMatches(req, res)`

This function retrieves matches for a user.

The function expects the following parameters in the request:

- `userId`: Specifies the ID of the user to fetch matches for.

The function performs the following steps:

1. Retrieves the swipe document for the user from the database based on the provided `userId`.
2. Constructs matches data including match name, gender, offer status, offer item, cafe, offer time, and offer date.
3. Responds with the fetched matches.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves meetups associated with a specific user in a Node.js application using MongoDB.

## Overview

The function fetches meetups for a user based on the provided `userId`.

### Function: `userMeetups(req, res)`

This function retrieves meetups associated with a user.

The function expects the following parameters in the request:

- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `userId`: Specifies the ID of the user to fetch meetups for.

The function performs the following steps:

1. Constructs a MongoDB query to find offers associated with the specified user as either owner or guest.
2. Retrieves offers from the database based on the constructed query.
3. Constructs meetup data including date, time, partner name, partner ID, offer item, cafe name, address, offer status, and coupon status.
4. Responds with the fetched meetups.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves deals associated with a specific user in a Node.js application using MongoDB.

## Overview

The function fetches deals for a user based on the provided `userId`.

### Function: `userDeals(req, res)`

This function retrieves deals associated with a user.

The function expects the following parameter in the request:

- `userId`: Specifies the ID of the user to fetch deals for.

The function performs the following steps:

1. Constructs MongoDB queries to find floating and upcoming deals associated with the specified user.
2. Retrieves floating and upcoming deals from the database based on the constructed queries.
3. Constructs deal data including date, time, outlet name, outlet address, order details, and total bill amount for both floating and upcoming deals.
4. Responds with the fetched floating and upcoming deals.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves meetups and user data with optional filters in a Node.js application using MongoDB.

## Overview

The function fetches meetups and user data with optional filtering based on order status, city, restaurant ID, search query, and date range.

### Function: `usersDataMeetups(req, res)`

This function retrieves meetups and user data with optional filters.

The function expects the following parameters in the request:

- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `orderStatus`: (Optional) Specifies the order status for filtering meetups.
- `city`: (Optional) Specifies the city for filtering meetups based on user location.
- `restaurantId`: (Optional) Specifies the ID of the restaurant for filtering meetups.
- `search`: (Optional) Specifies the search query for filtering users.
- `startDate`: (Optional) Specifies the start date for filtering meetups.
- `endDate`: (Optional) Specifies the end date for filtering meetups.

The function performs the following steps:

1. Constructs MongoDB queries based on the provided parameters for filtering.
2. Retrieves meetups and user data from the database based on the constructed queries.
3. Constructs meetup and user data including order ID, date, time, user name, user image, contact number, email, guest name, restaurant name, city, and order status.
4. Responds with the fetched meetups and user data along with counts for verified and unverified users.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves verified users with optional search query and pagination in a Node.js application using MongoDB.

## Overview

The function fetches verified users with optional filtering based on the search query.

### Function: `verifiedUsers(req, res)`

This function retrieves verified users.

The function expects the following parameters in the request:

- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `search`: (Optional) Specifies the search query for filtering users.

The function performs the following steps:

1. Constructs a MongoDB query based on the provided search query for filtering.
2. Retrieves verified users from the database based on the constructed query.
3. Constructs user data including user name, user image, user ID, contact number, email, date of birth, city, and verified status.
4. Responds with the fetched verified users along with counts for verified and unverified users.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```


```markdown
# Code Documentation

This asynchronous function retrieves unverified users with optional search query and pagination in a Node.js application using MongoDB.

## Overview

The function fetches unverified users with optional filtering based on the search query.

### Function: `unVerifiedUsers(req, res)`

This function retrieves unverified users.

The function expects the following parameters in the request:
- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `search`: (Optional) Specifies the search query for filtering users.

The function performs the following steps:
1. Constructs a MongoDB query to find unverified users based on the provided search query for filtering.
2. Retrieves unverified users from the database based on the constructed query.
3. Constructs user data including user name, user image, user ID, contact number, email, date of birth, city, and verified status.
4. Responds with the fetched unverified users along with counts for verified and unverified users.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves refund requests with optional search query and pagination in a Node.js application using MongoDB.

## Overview

The function fetches refund requests with optional filtering based on the search query.

### Function: `refundRequest(req, res)`

This function retrieves refund requests.

The function expects the following parameters in the request:
- `page`: (Optional) Specifies the page number for pagination. Default is 1.
- `search`: (Optional) Specifies the search query for filtering refund requests.

The function performs the following steps:
1. Constructs a MongoDB query to find refund requests based on the provided search query for filtering.
2. Retrieves refund requests from the database based on the constructed query.
3. Constructs refund request data including user name, refund amount, account number, account holder name, IFSC code, and refund status.
4. Calculates total refunded amount and counts for refund requests with status "Refunded" and "Declined".
5. Responds with the fetched refund requests along with total refunded amount and counts for refund requests with different statuses.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves restaurants for selecting offers with optional pagination in a Node.js application using MongoDB.

## Overview

The function fetches restaurants for selecting offers.

### Function: `selectRestaurants(req, res)`

This function retrieves restaurants for selecting offers.

The function expects the following parameter in the request:
- `page`: (Optional) Specifies the page number for pagination. Default is 1.

The function performs the following steps:
1. Retrieves restaurants from the database.
2. Constructs restaurant data including restaurant ID, name, image, status, available offers, and number of offers left.
3. Responds with the fetched restaurant data.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This asynchronous function retrieves menu items for a specific restaurant in a Node.js application using MongoDB.

## Overview

The function fetches menu items for a specific restaurant.

### Function: `menuItems(req, res)`

This function retrieves menu items for a specific restaurant.

The function expects the following parameter in the request:
- `restaurantId`: Specifies the ID of the restaurant to fetch menu items for.

The function performs the following steps:
1. Retrieves menu items for the specified restaurant from the database.
2. Constructs menu item data including item ID, name, price, status, and availability for early bird offers.
3. Responds with the fetched menu item data along with the name of the restaurant.

If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
```


```markdown
# Code Documentation

This asynchronous function submits a claim offer request and blocks a user in a Node.js application using MongoDB.

## Overview

The function handles two different functionalities:
1. Claiming an offer by updating restaurant details and menu items based on user selection.
2. Blocking a user by updating the user's status to blocked.

### Function: `claimOfferSubmit(req, res)`

This function submits a claim offer request.

The function expects the following parameters in the request body:
- `restaurantId`: Specifies the ID of the restaurant.
- `resSelectForOffer`: Specifies whether the restaurant is selected for offering.
- `resNumOffer`: Specifies the number of offers available at the restaurant.
- `items`: An array containing information about the items selected for early bird offers, including item ID and selection status.

The function performs the following steps:
1. Checks if the restaurant exists in the database.
2. If the restaurant exists, updates the restaurant's early bird offer status and the number of offers available.
3. Iterates through the items array and updates the early bird offer status for each item.
4. Responds with a success message if the update is successful.

### Function: `blockUser(req, res)`

This function blocks a user.

The function expects the following parameter in the request body:
- `userId`: Specifies the ID of the user to be blocked.

The function performs the following steps:
1. Finds the user in the database based on the provided user ID.
2. If the user exists, updates the user's status to blocked.
3. Responds with a success message if the update is successful.

If an error occurs during the process, both functions log the error and respond with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This documentation covers two asynchronous functions related to partner data retrieval in a Node.js application using MongoDB.

## Overview

The functions handle retrieving partner data by ID and fetching menu items for a partner restaurant.

### Function: `partnerDataById(req, res)`

This function retrieves partner data based on the provided partner ID.

The function expects the following parameter in the request query:
- `partnerId`: Specifies the ID of the partner.

The function performs the following steps:
1. Finds the partner in the database using the provided partner ID.
2. Selects specific fields from the partner document such as name, address, city, manager name, manager contact, opening and closing times, email, status, category, and account details.
3. Formats the opening and closing times using the `changeTime` function, which converts the time to a 12-hour format with AM/PM.
4. Constructs a response object containing the retrieved partner data.
5. Responds with the constructed response object.

### Function: `partnerMenuItems(req, res)`

This function retrieves menu items for a partner restaurant.

The function expects the following parameters in the request query:
- `page`: Specifies the page number for pagination (default is 1).
- `restaurantId`: Specifies the ID of the partner restaurant.
- `nonVeg`: Specifies whether to filter non-vegetarian items (optional).

The function performs the following steps:
1. Constructs a query object based on the provided parameters to find menu items for the specified partner restaurant.
2. Retrieves menu items from the database using the constructed query.
3. Selects specific fields such as name, image, price, status, description, non-vegetarian status, early bird status, and menu title tags.
4. Constructs a response object containing the retrieved menu item data.
5. Responds with the constructed response object.

If an error occurs during the process, both functions log the error and respond with a status code of 500 along with an error message.
```

```markdown
# Code Documentation

This documentation covers several asynchronous functions related to user alerts, user reports, and statistics for a home page in a Node.js application using MongoDB.

## User Alerts

### Function: `userAlert(req, res)`

This function retrieves user alerts based on specific criteria such as page number and search query.

The function expects the following parameters in the request query:
- `page`: Specifies the page number for pagination (default is 1).
- `search`: Specifies the search query.

The function performs the following steps:
1. Constructs a query object based on the provided parameters to find user alerts.
2. Retrieves user alerts from the database using the constructed query.
3. Populates related fields such as offer and outlet for each user alert.
4. Formats the date and time fields for each user alert.
5. Constructs a response object containing the retrieved user alert data.
6. Responds with the constructed response object.

## User Reports

### Function: `userReport(req, res)`

This function retrieves user reports based on specific criteria such as page number and search query.

The function expects the following parameters in the request query:
- `page`: Specifies the page number for pagination (default is 1).
- `search`: Specifies the search query.

The function performs similar steps to `userAlert`, retrieving user reports from the database and constructing a response object containing the retrieved user report data.

## Home Page Statistics

### Function: `forUpperBoxs(req, res)`

This function retrieves various statistics for the home page, including total users, current active users, today's swipes, today's offer sent, today's meetups created, total cafe partners, total queries, users count, paid users count, and unpaid users count.

The function expects the following parameters in the request query:
- `startDate`: Specifies the start date for the statistics range.
- `endDate`: Specifies the end date for the statistics range.

If no start and end dates are provided, the function defaults to retrieving statistics for the last 7 days.

The function performs the following steps:
1. Constructs date range strings based on the provided start and end dates.
2. Constructs queries to retrieve statistics such as total users, current active users, today's swipes, today's offer sent, and more.
3. Executes the queries and retrieves the corresponding statistics from the database.
4. Constructs a response object containing the retrieved statistics data.
5. Responds with the constructed response object.

If an error occurs during the process, all functions log the error and respond with a status code of 500 along with an error message.
```

The provided code includes three asynchronous functions for retrieving and processing data related to new users, new reports, and new matches for display on a home page. Here's a summary of each function:

### `homeNewUser(req, res)`
- Retrieves information about new users.
- Expects optional query parameters:
  - `userPage`: Specifies the page number for pagination (default is 1).
- Queries the database for new users, sorts them by creation date in descending order, and limits the result to 5 users per page.
- Constructs a response object containing user IDs, names, profile images, and time differences since registration.
- Responds with the constructed response object.

### `homeNewReport(req, res)`
- Retrieves information about new reports.
- Expects optional query parameters:
  - `page`: Specifies the page number for pagination (default is 1).
- Queries the database for new reports, sorts them by creation date in descending order, and limits the result to 3 reports per page.
- Populates user details for each report.
- Constructs a response object containing user IDs, names, profile images, reported issues, and time differences since reporting.
- Responds with the constructed response object.

### `homeNewMatch(req, res)`
- Retrieves information about new matches.
- Queries the database for shared matches, sorts them by creation date in descending order, and limits the result to the latest 3 matches.
- Populates offer details for each match.
- Formats the offer date and constructs a response object containing details about the first and second users involved in the match, the offer item, offer date, restaurant, and time difference since the match was created.
- Responds with the constructed response object.

These functions handle errors by logging them and sending a 500 status code with a corresponding error message in the response.


The provided code includes two asynchronous functions for retrieving and processing data related to the most offered items and raised alerts for display on a home page. Here's a summary of each function:

### `homeMostOfferingItem(req, res)`
- Retrieves information about the most offered items within a specified date range.
- Expects optional query parameters:
  - `startDate`: Specifies the start date of the date range.
  - `endDate`: Specifies the end date of the date range.
- Parses the provided date range or defaults to the last 7 days if no date range is provided.
- Queries the database to aggregate the count of offered items for both "forMe" and "forYou" order details within the specified date range.
- Constructs an object mapping items to their respective counts and sorts them in descending order of counts.
- Retrieves details of the top 3 most offered items from the sorted object.
- Constructs a response object containing details of the top 3 most offered items and sends it as a JSON response.

### `homeAlertRaised(req, res)`
- Retrieves information about raised alerts.
- Expects optional query parameters:
  - `page`: Specifies the page number for pagination (default is 1).
- Queries the database for raised alerts with the `alert` field set to `true`, sorts them by creation date in descending order, and limits the result to 1 alert per page.
- Populates details for the outlet and offer associated with each alert.
- Formats the date and time of each alert and constructs a response object containing details of the alerts.
- Sends the constructed response object as a JSON response.

Both functions handle errors by logging them and sending a 500 status code with a corresponding error message in the response.


The provided code includes two additional asynchronous functions: `homeRevenue` and `homeTraffic`. Here's an overview of each function:

### `homeRevenue(req, res)`
- Retrieves revenue-related information for a specified date range.
- Expects optional query parameters:
  - `startDate`: Specifies the start date of the date range.
  - `endDate`: Specifies the end date of the date range.
- Parses the provided date range or defaults to the last 7 days if no date range is provided.
- Queries the database to calculate the total revenue within the specified date range using the `aggregate` function.
- Queries the database to retrieve the latest 5 revenue transactions using the `find` function.
- Populates user information for each revenue transaction.
- Formats the date and time of each transaction.
- Constructs a response object containing the total revenue amount and details of the latest revenue transactions, then sends it as a JSON response.

### `homeTraffic(req, res)`
- Retrieves traffic-related information based on user locations.
- Utilizes MongoDB's aggregation pipeline to perform the following operations:
  - Splits the `location` field of each user document to extract the town.
  - Groups users based on their towns and calculates the count of users in each town.
  - Sorts the result by the count of users in descending order.
- Constructs a response object containing the traffic information and sends it as a JSON response.

Both functions handle errors by logging them and sending a 500 status code with a corresponding error message in the response.