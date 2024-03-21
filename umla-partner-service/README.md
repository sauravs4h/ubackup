# umla-partner-service

# Code Documentation

This documentation describes the `login` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## login Function

```javascript
const login = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It fetches the PartnerAdmin document associated with the email from the request body.
3. If no such user exists, it sends a response with HTTP status 400 and an error message in the response body.
4. It compares the password from the request body with the password in the fetched user document using bcrypt.
5. If the passwords do not match, it sends a response with HTTP status 400 and an error message in the response body.
6. It generates a JWT token with the user's `_id` as payload, signed with a secret key from the environment variables, and an expiration time of 1 year.
7. It sends a response with HTTP status 200, the generated token, and some user details in the response body.
8. If there's an error during the operation, it sends a response with HTTP status 500 and the error message in the response body.

# Code Documentation

This documentation describes the `addOutletMenu` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## addOutletMenu Function

```javascript
const addOutletMenu = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It destructures the request body to get `outletId`, `name`, `bio`, `price`, `menuTitleTags`, and `nonVeg`.
3. It also gets the uploaded files from the request.
4. For each uploaded file, it creates a blob name, uploads the file to Azure Blob Storage, and returns the URL of the uploaded image.
5. It splits `menuTitleTags` by '-' to create an array of tags.
6. It creates a new `OutletMenu` document with the provided details and the array of image URLs, and saves it to the database.
7. It finds the `Outlet` document associated with the `outletId` and updates its `menuTitle` field with the unique values from the existing `menuTitle` and `menuTitleTags`.
8. It sends a response with HTTP status 201, and the saved menu item in the response body.
9. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and the error message in the response body.

# Code Documentation

This documentation describes the `addOutletDetails` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## addOutletDetails Function

```javascript
const addOutletDetails = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It destructures the request body to get `name`, `bio`, `outletTags`, `location`, `address`, `opensAt`, and `closesAt`.
3. It also gets the uploaded files from the request and the user id from the request object.
4. For each uploaded file, it creates a blob name, uploads the file to Azure Blob Storage, and returns the URL of the uploaded image.
5. It splits `outletTags` by '-' to create an array of tags.
6. It finds the `Partner` document associated with the `pAdminId`.
7. It creates a new `Outlet` document with the provided details and the array of image URLs, and saves it to the database.
8. It updates the `Partner` document's `outlets` field by pushing the id of the newly created outlet.
9. It sends a response with HTTP status 201, and the saved outlet in the response body.
10. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and the error message in the response body.

# Code Documentation

This documentation describes the `addPartnerDetails` function. This function is part of a service in a Node.js application using Express.js and MongoDB.

## addPartnerDetails Function

```javascript
const addPartnerDetails = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It gets the user id from the request object and destructures the request body to get `name`, `bio`, and `tags`.
3. It also gets the uploaded files from the request.
4. It splits `tags` by '-' to create an array of tags.
5. For each uploaded file, it creates a blob name, uploads the file to Azure Blob Storage, and returns the URL of the uploaded image.
6. It creates a new `Partner` document with the provided details and the array of image URLs, and saves it to the database.
7. It sends a response with HTTP status 201, and the saved partner in the response body.
8. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and the error message in the response body.