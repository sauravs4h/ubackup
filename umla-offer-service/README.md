# offer

# Code Documentation

This contains an asynchronous function that handles fetching all outlet data in a Node.js application using MongoDB.

## Overview

```javascript
const getAllOutlet = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getAllOutlet(req, res)`

This function handles getting all outlets for a user. It first finds the current user by their ID, then fetches all `Outlet` documents from the database, excluding certain fields (`__v`, `createdAt`, `updatedAt`, `pid`). The resulting list of outlets is then returned in the response.

There are commented out sections of code which suggest that this function may have previously also handled pagination (with a default page size of 15), and potentially filtering outlets based on their proximity to the user's location. However, as these sections are currently commented out, they do not affect the function's behavior.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

# Code Documentation

This contains an asynchronous function that handles fetching the menu of a specific outlet in a Node.js application using MongoDB.

## Overview

```javascript
const getMenu = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getMenu(req, res)`

This function handles getting the menu for a specific outlet. It first finds the menu by checking if `earlyBird` is `false`, then fetches the `OutletMenu` documents from the database, excluding certain fields (`__v`, `createdAt`, `updatedAt`, `outletId`). 

It also fetches the specific `Outlet` document by its ID, selecting only the `menuTitles` field. The resulting menu and menu titles are then returned in the response.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

# Code Documentation

This contains an asynchronous function that handles the creation of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const createOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `createOffer(req, res)`

This function handles creating an offer. It first destructures necessary fields from the request body. The `userId` is fetched from the authenticated user's request object.

It then checks if there are items for 'me' and 'you' in the order details. If present, it fetches the price of each item from the `OutletMenu` collection and adds them to the `items` array.

The total bill is calculated by summing up all the prices in the `items` array, adding tax (18% of the total), and a platform charge of 5. 

The date and time provided are converted into a JavaScript Date object.

A new offer is created with the constructed data and saved in the `Offer` collection. If a `guestId` is provided, it also triggers the `handleOfferCreationInChatRoom()` function (not defined in this code snippet). An `OfferResponse` document is also created with the newly created offer's ID.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

# Code Documentation

This contains an asynchronous function that handles the floating of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const floatOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `floatOffer(req, res)`

This function handles floating an offer. It first fetches the `userId` from the authenticated user's request object and the `offerId` from the request body.

It then fetches the offer with the provided `offerId` from the `Offer` collection and the user with the `userId` from the `User` collection.

The status of the offer is updated to "floating" and the `offerId` is assigned to the user's `offer` field. Both the offer and user documents are saved back to their respective collections.

A response with status code 200 and a success message is sent if the operation is successful.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message. 

**Note:** There's a TODO comment indicating that this function needs modification to handle scheduled and instant offers, which is not currently implemented in this code snippet.

# Code Documentation

This contains an asynchronous function that handles the usage of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const useOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `useOffer(req, res)`

This function handles the usage of an offer. It first fetches the `userId` from the authenticated user's request object and the `outletId` and `couponId` from the request body.

It then fetches the coupon with the provided `couponId` from the `Coupon` collection and calculates the final time by adding 10 minutes to the coupon time.

Next, it fetches the offer associated with the coupon and outlet from the `Offer` collection and populates various fields for further processing.

If the offer is an early bird offer, it updates the status of the offer and coupon to "consumed", emits socket events for arrival and order processing, and sends a success response.

If not, it determines the user type based on the owner of the coupon and sets the flow based on the arrival status of the other user type.

It then fetches the other user's coupon and checks if the final time is greater than the current time. If so, it expires the coupons and offer, sends push notifications to both users about the expired offer, and sends a response indicating that the coupon has expired.

Otherwise, it emits a socket event for arrival and processes the offer based on the user type and flow. This involves updating the status of the offer and coupons, scheduling jobs for handling expiration, emitting socket events for order processing, sending push notifications to users, and saving the updated documents.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** There are TODO comments indicating that the addition of 10 minutes to the coupon time and final time needs to be made dynamic, which is not currently implemented in this code snippet.

# Code Documentation

This contains an asynchronous function that retrieves the details of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const getOfferDetails = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getOfferDetails(req, res)`

This function handles fetching the details of an offer. It first fetches the `offerId` from the request parameters.

It then fetches the offer with the provided `offerId` from the `Offer` collection, excluding the `__v`, `createdAt`, and `updatedAt` fields, and populates various fields for further processing.

After successfully fetching the offer, it sends a response with status code 200 and the offer data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** The commented out line at the beginning of the function indicates that there might be a need to fetch the `userId` from the authenticated user's request object in future implementations of this function.

# Code Documentation

This contains an asynchronous function that retrieves the response of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const getOfferResponse = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getOfferResponse(req, res)`

This function handles fetching the response of an offer. It first fetches the `offerId` from the request parameters.

It then fetches the offer response with the provided `offerId` from the `OfferResponse` collection and populates the `users` field with `name` and `image`.

After successfully fetching the offer response, it sends a response with status code 200 and the offer response data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** The commented out line at the beginning of the function indicates that there might be a need to fetch the `userId` from the authenticated user's request object in future implementations of this function.

# Code Documentation

This contains an asynchronous function that handles the response of an offer in a Node.js application using MongoDB.

## Overview

```javascript
const handleOfferResponse = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `handleOfferResponse(req, res)`

This function handles the process of responding to an offer. It first fetches the `userId`, `offerId`, and `selectedUserId` from the request object.

It then fetches the necessary data from the database using `Promise.all()` to execute multiple promises concurrently. This includes fetching the user data, second user data, offer data, and swipe data for both users.

The function then updates the offer status and modifies the swipe data for both users.

Afterwards, it saves the updated data back to the database and deletes the offer response.

The function then calls `handleMatchViaOfferResponse()` to handle the match via offer response and creates a new room with the matched users and their respective offers.

Finally, it fetches the newly created room data, populates the necessary fields, and sends a response with status code 200 and the room data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** The commented out line at the beginning of the function indicates that there might be a need to rewrite this function to integrate coupons in future implementations of this function.

# Code Documentation

This contains an asynchronous function that fetches the active deals for a user in a Node.js application using MongoDB.

## Overview

```javascript
const activeDeals = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `activeDeals(req, res)`

This function handles the process of fetching active deals for a user. It first fetches the `userId` from the request object.

It then fetches the coupons owned by the user from the database using `Coupon.find()`. The returned documents are populated with related data from the `offer`, `item`, `outlet`, `owner`, and `meetingWith` fields using `populate()`.

Finally, it sends a response with status code 200 and the fetched coupons.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** The comment at the beginning of the function indicates that this function is used to fetch the user's coupons.

# Code Documentation

This contains an asynchronous function that fetches the offers for a user in a Node.js application using MongoDB.

## Overview

```javascript
const myOffers = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `myOffers(req, res)`

This function handles the process of fetching offers for a user. It first fetches the `userId` from the request object.

It then fetches the offers owned by the user from the database using `Offer.find()`. The returned documents are filtered based on the `ownerId` and `status`.

The fetched offers are then categorized into three groups - 'completed', 'inprogress' and 'archived' - based on their status using the `reduce()` method.

Finally, it sends a response with status code 200 and the categorized offers.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.

**Note:** This function is used to fetch the user's offers and categorize them based on their status.

# Code Documentation

This contains three asynchronous functions that handle different aspects of a coupon system in a Node.js application using MongoDB.

## Overview

```javascript
const getEarlyBirdOutlet = async (req, res) => { /* ... */ };
const getEarlyBirdOutletItem = async (req, res) => { /* ... */ };
const confirmOffer = async (req, res) => { /* ... */ };
```

All three functions are `async` functions, meaning they return a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getEarlyBirdOutlet(req, res)`

This function fetches all outlets that have an early bird offer and at least one coupon left. It then sends a response with status code 200 and the names of these outlets.

### Function: `getEarlyBirdOutletItem(req, res)`

This function fetches the menu items of a specific outlet that have an early bird offer. It also fetches the time slot for this outlet. The outlet ID is fetched from the request parameters. It then sends a response with status code 200 and the menu items and time slot.

### Function: `confirmOffer(req, res)`

This function handles the process of confirming an offer. It fetches various details from the request body, including the user ID, outlet ID, item ID, date, time, time slot, and WhatsApp number.

It first fetches the time slot data for the outlet and decreases the number of slots left for the selected time slot.

It then creates a new offer and a new coupon. The date and time for the coupon are adjusted based on the selected time slot.

The function also updates the user's details, including setting the WhatsApp number and marking the early bird coupon as claimed. If the user's contact number matches a certain value, it also sets additional properties.

Finally, it creates a new arrival, decreases the number of coupons left for the outlet, and sends a response with status code 200 and the new coupon.

In case of any error during the process in any of these functions, it logs the error and sends a response with status code 500 and the error message.

**Note:** These functions are used to handle different aspects of a coupon system, including fetching outlets and menu items with early bird offers, and confirming an offer.



/////// new


# Code Documentation

This contains an asynchronous function that handles actions against an offer in the Node.js application using MongoDB.

## Overview

```javascript
const takeActionAgainstOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `takeActionAgainstOffer(req, res)`

This function handles actions against an offer. It expects the `userId`, `offerId`, and `action` to be provided in the request body. The `action` parameter can have two possible values: "floating" or "consumed".

The function first updates the status of the offer based on the provided action. If the action is "floating", it updates the offer's status to "floating", resets the response count, sets up a new time for the offer, changes the offer type to "instant", and associates the offer with the user. If the action is "consumed", it updates the offer's status to "consumed", processes the order if applicable, updates the coupon status, and creates a new offer if the order is for the user.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.



# Code Documentation

This contains an asynchronous function that sends an alert in the Node.js application using MongoDB.

## Overview

```javascript
const sendAlert = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `sendAlert(req, res)`

This function sends an alert. It expects the `userId` and `couponId` to be provided in the request parameters.

The function first fetches the coupon details using the provided `couponId`. It then constructs the necessary data for the alert, including the `targetId` (outlet ID), `sourceId` (user ID), and `couponId`.

The function emits an "alert" event via socket.io with the constructed data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.


# Code Documentation

This contains an asynchronous function that handles accepting or rejecting an offer in the Node.js application using MongoDB.

## Overview

```javascript
const acceptRejectOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `acceptRejectOffer(req, res)`

This function handles the acceptance or rejection of an offer. It expects the `action`, `offerId`, and `roomId` to be provided in the request body. The `action` parameter can have two possible values: "accept" or "reject".

The function first fetches the offer, room, current user, owner user, and offer notification based on the provided IDs. It then updates the offer notification status to "Completed".

If the action is "accept", the function performs different actions based on whether the offer is floating or not. If it's a floating offer and part of a shared room, it updates the room and offer statuses, creates coupons for both users, associates the coupons with the room users, and schedules a function to run after 30 minutes for further processing. If it's not a floating offer, it updates the room and offer statuses, sends a push notification to the offer owner, and schedules a function to run after 30 minutes for further processing.

If the action is "reject", the function reopens the slot for the offer, blocks the current user, sends a push notification to the offer owner, and updates the offer notification status.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.


# Code Documentation

This contains an asynchronous function that sends data related to an offer in the Node.js application using MongoDB.

## Overview

```javascript
const sendData = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `sendData(req, res)`

This function sends data related to an offer. It expects the `offerId` to be provided in the request parameters.

The function fetches the offer details using the provided `offerId` and populates certain fields for better representation of the data. These fields include the `orderDetails.forMe.item`, `orderDetails.forYou.item`, and `outlet`.

The function then sends a response with status code 200 and the offer data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.


# Code Documentation

This contains an asynchronous function that confirms a free deal in the Node.js application using MongoDB.

## Overview

```javascript
const confirmFreeDeal = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `confirmFreeDeal(req, res)`

This function confirms a free deal. It expects various parameters such as `date`, `time`, `outletId`, `itemId`, and `whatsappNumber` to be provided in the request body. Additionally, it retrieves the authenticated user's ID from the request object.

The function first checks if the user has not already availed a free offer. If not, it constructs the necessary data for the offer, including the date, time, offering, purpose, outlet, order details, bill, and offer type. It then creates the offer, updates the user's free offer status and offer ID, creates an offer response, updates user data, decrements the number of coupons left at the outlet, and sends a response with status code 200 and the offer data.

If the user has already availed a free offer, the function retrieves the existing offer data and sends a response with status code 200 and the offer data.

In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.


# Code Documentation

This asynchronous function retrieves offer notifications for a user in the Node.js application using MongoDB.

## Overview

```javascript
const getOfferNotification = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getOfferNotification(req, res)`

This function retrieves offer notifications for a user. It expects the authenticated user's ID to be provided in the request object.

The function queries the database for offer notifications with a status of "Pending" for the specified user ID. It then populates the notifications with associated room details, including offer information, user details, and coupon details. The populated data is formatted appropriately before sending the response.

If successful, the function sends a response with status code 200 and an array of formatted offer notifications. In case of any error during the process, it logs the error and sends a response with status code 500 and the error message.


# Code Documentation

This asynchronous function handles the creation of a super offer in the Node.js application using MongoDB.

## Overview

```javascript
const superOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `superOffer(req, res)`

This function creates a super offer between two users. It expects the authenticated user's ID and the details of the super offer to be provided in the request body.

The function first checks if the authenticated user has a subscription. If the user has a subscription, it updates the swipe records for both users to indicate a match. Then, it checks if a room exists between the two users and creates one if it doesn't already exist. The function then sets the `superOffer` flag for the room to `true`.

Next, the function sends a POST request to an external API endpoint to create the super offer. It includes the necessary authorization token in the request headers. Upon receiving a response from the API, the function extracts the offer ID and updates the user, selected user, user swipe, and selected user swipe records accordingly.

If the authenticated user does not have a subscription, the function responds with a message indicating that a subscription is required.

If an error occurs during the process, the function logs the error and responds with a status code of 500 and the error message.

# Code Documentation

This asynchronous function handles the creation of a super offer with a floating offer in the Node.js application using MongoDB.

## Overview

```javascript
const superOfferWithFloatingOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `superOfferWithFloatingOffer(req, res)`

This function creates a super offer with a floating offer between two users. It expects the authenticated user's ID and the selected user's ID to be provided in the request body.

The function first checks if the authenticated user has a subscription. If the user has a subscription, it updates the swipe records for both users to indicate a match. Then, it checks if a room exists between the two users and creates one if it doesn't already exist. The function then sets the `superOffer` flag for the room to `true`.

Next, the function retrieves the authenticated user's floating offer and updates it with the selected user's ID as the guest. It then updates the room data with the floating offer ID and sets the offer status to "pending".

The function also updates the authenticated user's data to indicate that they should be hidden for one hour.

If the authenticated user does not have a subscription, the function responds with a message indicating that a subscription is required.

If an error occurs during the process, the function logs the error and responds with a status code of 500 and the error message.



# Code Documentation

This asynchronous function handles the creation of a group meeting in the Node.js application using MongoDB.

## Overview

```javascript
const createGroup = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `createGroup(req, res)`

This function creates a group meeting based on the provided details in the request body. It expects the authenticated user's ID, purpose, category, date, time, meeting type, and group size (optional) to be provided in the request body.

The function first checks if the user's slot is available for booking on the specified date and time using the `slotBooking` function.

If the user's slot is not available, the function responds with a status code of 400 and a message indicating the reason for failure.

Next, it checks if the user already has a scheduled group meeting. If a meeting is already scheduled, the function responds with a status code of 400 and a message indicating that the user already has a scheduled group meeting.

If the user's slot is available and they don't have a scheduled group meeting, the function calculates the size of the group based on the meeting type (fixed or flexible). If the meeting type is flexible, the group size is determined by the provided group size; otherwise, it defaults to 10.

The function then creates a new `GroupMeet` document in the database with the provided details and responds with a status code of 200 and the ID of the created group meeting.

If an error occurs during the process, the function logs the error and responds with a status code of 500 and the error message.



# Code Documentation

This asynchronous function handles the creation of a group meeting offer in the Node.js application using MongoDB.

## Overview

```javascript
const createGroupOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `createGroupOffer(req, res)`

This function creates a group meeting offer based on the provided details in the request body. It expects the group ID, offering, outlet ID, and order details (including item ID and quantity) to be provided in the request body.

The function first retrieves the group meeting details based on the provided group ID.

Next, it formats the date and time of the group meeting offer.

Then, it calculates the total bill for the offer based on the item price, quantity, taxes, and platform charges.

The function creates a new `GroupMeetOffer` document in the database with the provided details.

It also creates a corresponding `GroupMeetRoom` document for the group meeting.

The function responds with a status code of 200 and the details of the created group meeting offer and room.

If an error occurs during the process, the function logs the error and responds with a status code of 500 and the error message.

