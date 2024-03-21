# umla-PartnerDashboard-service

# Code Documentation

This documentation describes the flow of the `handleEvent` function. This function is part of an event management service in a Node.js application using Express.js, MongoDB, and the node-schedule package for scheduling jobs.

## handleEvent Function

```javascript
const handleEvent = async (outletId, userId, couponId, type) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in four parameters: `outletId`, `userId`, `couponId`, and `type`.
2. It fetches the corresponding coupon, offer, and outlet documents from the database.
3. It also tries to find an arrival document matching the offer id. If not found, it creates a new one with the given details.
4. Depending on the `type` parameter, it performs different operations:

   - **arrival**: It adds the `userId` to the guest list of the arrival document and sets its status to 'active'. If there are two guests, it schedules a job to update the arrival status to 'done' after 1 hour. It then returns the updated arrival document and the outlet's pid.
   
   - **process**: It tries to find an order document matching the arrival id. If not found, it creates a new one with the given details. If found, it adds the coupon item to the order. It then returns the updated order document and the outlet's pid.
   
   - **alert**: It sets the alert flag of the arrival document to true. It then returns the updated arrival document and the outlet's pid.

5. If there's an error during the operation, it logs the error.

> Note: The ObjectId type is used to create a new MongoDB ObjectID from the `outletId`. The node-schedule package is used to schedule jobs at specific dates or times.

# Code Documentation

This documentation describes the `orderStatusUpdate` function. This function is part of an order management service in a Node.js application using Express.js and MongoDB.

## orderStatusUpdate Function

```javascript
const orderStatusUpdate = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `orderId` from the request body.
3. It fetches the corresponding order document from the database using the `orderId`.
4. It updates the status of the order to 'done'.
5. It saves the updated order back to the database.
6. It sends a response with HTTP status 200 and the updated order in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request body contains an `orderId`. If the `orderId` is not provided or is invalid, the function will throw an error. Also, the function directly sets the order status to 'done' without checking the current status of the order. Depending on the business logic, additional checks might be necessary before updating the order status.

# Code Documentation

This documentation describes the `getArrivalAndOrder` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getArrivalAndOrder Function

```javascript
const getArrivalAndOrder = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `id` of the user from the request object.
3. It fetches the corresponding partner document from the database using the `pid`.
4. It fetches the outlet associated with the partner from the database.
5. It fetches all active arrivals associated with the outlet and populates the 'guest' field with the guest's name.
6. It fetches all active orders associated with the outlet and populates the 'item' field.
7. It sends a response with HTTP status 200 and the fetched arrivals and orders in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request object contains a `user` property with an `id`. If the `id` is not provided or is invalid, the function will throw an error. Also, the function directly fetches all active arrivals and orders without any additional filtering or sorting. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `getOrderHistory` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getOrderHistory Function

```javascript
const getOrderHistory = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `id` of the user from the request object.
3. It fetches the corresponding partner document from the database using the `pAdminId`.
4. It fetches the outlet associated with the partner from the database.
5. It fetches all completed orders associated with the outlet and populates the 'item' field.
6. For each order, it fetches the associated arrival document to get the time of arrival and calculates the total price of the order.
7. It sends a response with HTTP status 200 and the fetched orders in the response body. Each order includes the original order data, the time of arrival, and the total price.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request object contains a `user` property with an `id`. If the `id` is not provided or is invalid, the function will throw an error. Also, the function directly fetches all completed orders without any additional filtering or sorting. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `getRevenue` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getRevenue Function

```javascript
const getRevenue = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `id` of the user from the request object.
3. It fetches the corresponding partner document from the database using the `pAdminId`.
4. It fetches the outlet associated with the partner from the database.
5. It sets the start of the day and the start of the month dates.
6. It fetches all orders associated with the outlet that were created today and populates the 'item' field.
7. It initializes a `todayOrder` object to keep track of the number of bookings and revenue for today, and a `totalRevenue` variable.
8. For each order, it calculates the total price of the order. If the order was created today, it increments the booking count and adds the order price to the revenue for today. It also adds the order price to the total revenue.
9. It fetches all completed arrivals associated with the outlet that arrived this month.
10. It calculates the total number of customers this month by summing up the lengths of the 'guest' arrays of the arrivals.
11. It sends a response with HTTP status 200 and the calculated data in the response body.
12. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request object contains a `user` property with an `id`. If the `id` is not provided or is invalid, the function will throw an error. Also, the function directly fetches all orders and arrivals without any additional filtering or sorting. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `getActiveArrivals` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getActiveArrivals Function

```javascript
const getActiveArrivals = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `id` of the user from the request object.
3. It fetches the corresponding partner document from the database using the `pAdminId`.
4. It fetches the outlet associated with the partner from the database.
5. It fetches all active arrivals associated with the outlet, populates the 'offer' and 'guest' fields, and sorts them by creation date in descending order.
6. For each arrival, it fetches the associated order and populates the 'item' field. If an order exists, it calculates the total price of the order and returns a new object containing all properties of the arrival, the order, and the total price. If no order exists, it simply returns all properties of the arrival.
7. It waits for all promises to resolve using `Promise.all()` and then sends a response with HTTP status 200 and the calculated data in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request object contains a `user` property with an `id`. If the `id` is not provided or is invalid, the function will throw an error. Also, the function directly fetches all arrivals without any additional filtering or sorting. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `completeArrivalStatus` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## completeArrivalStatus Function

```javascript
const completeArrivalStatus = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `arrivalId` from the request body.
3. It fetches the corresponding arrival document from the database using the `arrivalId`.
4. It fetches the order associated with the arrival from the database.
5. It changes the status of both the arrival and the order to 'done'.
6. It saves the updated order and arrival documents back to the database.
7. It sends a response with HTTP status 200 and the updated arrival in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request body contains an `arrivalId`. If the `arrivalId` is not provided or is invalid, the function will throw an error. Also, the function directly updates the status of the arrival and the order without any additional checks. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `updateOutletStatus` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## updateOutletStatus Function

```javascript
const updateOutletStatus = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the user's id (`pid`) from the request object and the `status` from the request body.
3. It fetches the partner document associated with the user from the database.
4. It fetches the outlet document associated with the partner from the database.
5. If the status is 'open', it updates the outlet's timing status to 'open'. If the status is 'closed', it updates the outlet's timing status to 'closed'.
6. It saves the updated outlet document back to the database.
7. It sends a response with HTTP status 200 and the updated outlet in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the request body contains a `status` field. If the `status` is not provided or is invalid, the function will not change the outlet's timing status. Also, the function directly updates the outlet's timing status without any additional checks. Depending on the business logic, additional operations might be necessary.

# Code Documentation

This documentation describes the `getOutlet` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getOutlet Function

```javascript
const getOutlet = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the user's id (`pid`) from the request object.
3. It fetches the partner document associated with the user from the database.
4. It fetches the outlet document associated with the partner from the database.
5. It sends a response with HTTP status 200 and the fetched outlet in the response body.
6. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the user is associated with a partner and that the partner is associated with an outlet. If these associations do not exist, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases.

# Code Documentation

This documentation describes the `getUpcomingArrivals` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getUpcomingArrivals Function

```javascript
const getUpcomingArrivals = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the user's id (`pid`) from the request object.
3. It fetches the partner document associated with the user from the database.
4. It fetches the outlet document associated with the partner from the database.
5. It fetches the arrivals documents associated with the outlet and having status as 'upcoming' from the database. It also populates the 'offer' and 'guest' fields in the arrivals documents and sorts them in descending order of their creation time.
6. It sends a response with HTTP status 200 and the fetched arrivals in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the user is associated with a partner and that the partner is associated with an outlet. If these associations do not exist, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases.

# Code Documentation

This documentation describes the `allotTable` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## allotTable Function

```javascript
const allotTable = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `arrivalId` and `table` from the request body.
3. It fetches the arrival document associated with the `arrivalId` from the database.
4. It updates the `table` field in the fetched arrival document with the `table` value from the request body.
5. It saves the updated arrival document back to the database.
6. It sends a response with HTTP status 200 and the updated arrival in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the arrival document associated with the `arrivalId` exists in the database. If this is not the case, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases.

# Code Documentation

This documentation describes the `getMenuItems` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getMenuItems Function

```javascript
const getMenuItems = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts various parameters from the request:
   - `pid`: User ID from the request user object.
   - `page`: Page number from the query parameters. Defaults to 1 if not provided.
   - `search`: Search term from the query parameters. If provided, it's used to create a regex search object for item names.
   - `filter`: Filter term from the query parameters.
   - `category`: Category term from the query parameters.
3. It sets the page size to 15 items.
4. It creates a query object based on the filter and category parameters.
5. It fetches the partner document associated with the `pid` from the database.
6. It fetches the outlet document associated with the partner's ID from the database.
7. It fetches the menu items associated with the outlet's ID from the database, applying the search and filter queries, and paginating the results.
8. It sends a response with HTTP status 200 and the fetched items in the response body.
9. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the partner and outlet documents associated with the given IDs exist in the database. If this is not the case, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases.

# Code Documentation

This documentation describes the `addMenuItem` function. This function is part of a service in a Node.js application using Express.js, MongoDB and Azure Blob Storage.

## addMenuItem Function

```javascript
const addMenuItem = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts various parameters from the request:
   - `pid`: User ID from the request user object.
   - `name`, `price`, `description`, `isBest`, `classification`, `category`: These are extracted from the request body.
   - `files`: Files attached to the request.
3. It fetches the partner document associated with the `pid` from the database.
4. It fetches the outlet document associated with the partner's ID from the database.
5. It creates a data object for the new menu item, including the outlet ID, name, price, description, classification, category, and an empty image array.
6. If the `isBest` flag is true, it adds 'bestSeller' to the menu title tags.
7. If there are files attached to the request, it uploads each file to Azure Blob Storage, generates a URL for the uploaded file, and adds the URL to the image array.
8. It creates a new menu item document in the database using the constructed data object.
9. It sends a response with HTTP status 200 and the created menu item in the response body.
10. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the partner and outlet documents associated with the given IDs exist in the database. If this is not the case, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases.

# Code Documentation

This documentation describes the `updateMenuItemStatus` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## updateMenuItemStatus Function

```javascript
const updateMenuItemStatus = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `itemId` and `status` from the request body.
3. It fetches the menu item document associated with the `itemId` from the database.
4. If the `status` is 'active', it sets the status of the menu item to 'active'.
5. If the `status` is 'inactive', it sets the status of the menu item to 'inactive'.
6. It saves the updated menu item document back to the database.
7. It sends a response with HTTP status 200 and the updated menu item in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The function assumes that the menu item document associated with the given ID exists in the database. If this is not the case, the function will throw an error. Depending on the business logic, additional checks might be necessary to handle such cases. Also, the function only updates the status if it's either 'active' or 'inactive'. If the status is neither of these, the function does nothing. Depending on the business logic, additional handling might be necessary for other statuses.

# Code Documentation

This documentation describes the `deleteMenuItem` and `updateMenuItem` functions. These functions are part of a service in a Node.js application using Express.js and MongoDB.

## deleteMenuItem Function

```javascript
const deleteMenuItem = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `itemId` from the request parameters.
3. It deletes the menu item document associated with the `itemId` from the database.
4. It sends a response with HTTP status 200 and a success message in the response body.
5. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

## updateMenuItem Function

```javascript
const updateMenuItem = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts various fields from the request body and files from the request.
3. It fetches the menu item document associated with the `itemId` from the database.
4. If the menu item exists, it updates its fields based on the request body and uploads any attached images to a blob storage, storing the URLs in the menu item document.
5. It saves the updated menu item document back to the database.
6. It sends a response with HTTP status 200 and the updated menu item in the response body.
7. If the menu item does not exist, it sends a response with HTTP status 404 and an error message in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The `updateMenuItem` function assumes that the menu item document associated with the given ID exists in the database. If this is not the case, the function will return a 404 error. Depending on the business logic, additional checks might be necessary to handle such cases. Also, the function only updates the fields if they are provided in the request body. If a field is not provided, the function does nothing for that field. Depending on the business logic, additional handling might be necessary for missing fields.

# Code Documentation

This documentation describes the `getInprogressArrivals` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## getInprogressArrivals Function

```javascript
const getInprogressArrivals = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `id` from the authenticated user object in the request.
3. It fetches the partner document associated with the `id` from the database.
4. It fetches the outlet document associated with the partner's `_id` from the database.
5. It fetches all arrival documents associated with the outlet's `_id` and with status 'active' from the database, populates the 'offer' and 'guest' fields in these documents, and sorts them in descending order of creation time.
6. It sends a response with HTTP status 200 and the fetched arrivals in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

> Note: The `getInprogressArrivals` function assumes that the authenticated user is a partner and has an associated outlet. If this is not the case, the function might not behave as expected. Depending on the business logic, additional checks might be necessary to handle such cases. Also, the function only fetches arrivals with status 'active'. Depending on the business logic, additional handling might be necessary for arrivals with other statuses.

# Code Documentation

This documentation describes the `resolveAlert`, `getTodaysOrder` and `editOutlet` functions. These functions are part of a service in a Node.js application using Express.js and MongoDB.

## resolveAlert Function

```javascript
const resolveAlert = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `arrivalId`, `reason`, and `resolution` from the request body.
3. It fetches the arrival document associated with the `arrivalId` from the database.
4. It updates the `alert`, `alertReason`, and `alertResolution` fields in the fetched arrival document.
5. It saves the updated arrival document back to the database.
6. It sends a response with HTTP status 200 and the updated arrival in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

## getTodaysOrder Function

```javascript
const getTodaysOrder = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `id` from the authenticated user object in the request.
3. It fetches the partner document associated with the `id` from the database.
4. It fetches the outlet document associated with the partner's `_id` from the database.
5. It calculates the start and end of the current day in IST (Indian Standard Time).
6. It fetches all order documents associated with the outlet's `_id` and created within the current day from the database, sorts them in descending order of creation time, and populates the 'item' field in these documents.
7. It updates the 'table' field in each fetched order document if necessary and saves the updated order document back to the database.
8. It sends a response with HTTP status 200 and the fetched orders in the response body.
9. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.

## editOutlet Function

```javascript
const editOutlet = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts data from the request body.
3. It fetches the outlet document associated with the `outletId` from the database.
4. It updates the fetched outlet document with the data from the request body.
5. It saves the updated outlet document back to the database.
6. It sends a response with HTTP status 200 and the updated outlet in the response body.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and an error message in the response body.