# umla-payment-service

# Code Documentation

This documentation describes the flow of three functions: `generateTransactionNumber`, `createOrder`, and `confirmOrder`. These functions are part of an order management service in a Node.js application using Express.js, MongoDB, and Cashfree payment gateway.

## generateTransactionNumber Function

```javascript
const generateTransactionNumber = (userId) => {
	const timestamp = Date.now();
	return `${timestamp}${userId}`;
};
```

### Flow

1. The function takes in one parameter: `userId`.
2. It generates a timestamp using `Date.now()`.
3. It returns a string concatenating the timestamp and `userId`.

## createOrder Function

```javascript
const createOrder = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `offerId`, `subscriptionId`, and `userId` from the request object.
3. Depending on whether `offerId` or `subscriptionId` is provided, it fetches the corresponding document from the database.
4. It also fetches the user's details from the database.
5. It generates a transaction number using `generateTransactionNumber` function.
6. It prepares the options for making a POST request to the Cashfree API to create an order.
7. It sends the request to the Cashfree API and receives a response.
8. It creates a new ledger entry in the database with the received data.
9. If the operation is successful, it sends a response with HTTP status 200 and the received data.
10. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and the error message.

## confirmOrder Function

```javascript
const confirmOrder = async (req, res) => {
	// ... function body ...
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts `userId`, `status`, and `cf_order_id` from the request object.
3. It fetches the corresponding ledger entry and user's details from the database.
4. If no matching ledger entry is found, it sends a response with HTTP status 400 and an error message.
5. It prepares the options for making a GET request to the Cashfree API to fetch the payment details of the order.
6. It sends the request to the Cashfree API and receives a response.
7. Depending on whether the ledger entry is for a subscription or an offer, it performs different operations.
8. For both cases, it checks the status of the transaction and updates the ledger entry and other relevant documents in the database accordingly.
9. If the operation is successful, it sends a response with HTTP status 200 and a success message.
10. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and the error message.

> Note: This function needs to be revisited as a different third-party gateway might be used in the future.

### Function Documentation

#### Refund

- **Purpose:** Initiates a refund for a particular offer.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Request Body Parameters:**
  - `offerId`: The ID of the offer for which the refund is initiated.
  - `accountHolderName`: The name of the account holder.
  - `accountNumber`: The account number to which the refund is processed.
  - `ifscCode`: The IFSC code of the bank.
- **Flow:**
  1. Retrieves the offer details based on the provided `offerId`.
  2. Updates the status of the offer to "refunded".
  3. Creates a refund record in the database with details such as `userId`, `offerId`, `accountHolderName`, `accountNumber`, `ifscCode`, and the refund `amount`.
  4. Saves the changes to the offer and sends a success response with a message indicating that the refund has been initiated.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### PayAPI

- **Purpose:** Handles the payment initiation process for offers and subscriptions.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Request Body Parameters:**
  - `offerId`: The ID of the offer for which the payment is initiated.
  - `subscriptionId`: The ID of the subscription for which the payment is initiated.
- **Flow:**
  1. Based on the provided parameters, determines whether the payment is for an offer or a subscription.
  2. Constructs the payment payload with merchant and user details.
  3. Generates a transaction ID and calculates the payment amount.
  4. Sends a payment request to the payment gateway with the constructed payload.
  5. Upon receiving the response, processes the response data and updates the ledger with transaction details.
  6. If the payment is for an offer, sets the bill status to "pending" and schedules a task to check and update the bill status after 10 minutes if it remains pending.
  7. Sends a response with the base64 encoded payload and the result of the payment initiation.
  8. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### CallbackUrl

- **Purpose:** Handles the callback URL endpoint for payment gateway responses.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Flow:**
  1. Verifies the authenticity of the callback request using the X-VERIFY header.
  2. Processes the response data and updates the ledger with transaction details based on the payment status.
  3. If the payment is successful, sends an email notification to the admin with relevant details.
  4. Sends a success response if the verification is successful.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

### General Comments

- The `refund` function handles refund initiation for offers, updating the offer status and creating a refund record in the database.
- `payAPI` is responsible for initiating payments for both offers and subscriptions, constructing the payment payload, and interacting with the payment gateway.
- `callbackUrl` serves as the endpoint to handle responses from the payment gateway, verifying the authenticity of the response and updating transaction details accordingly.
- The code includes detailed comments to explain each step of the process, enhancing readability and maintainability.

### Function Documentation

#### refundCallback

- **Purpose:** Handles the callback URL endpoint for refund processing.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Request Body Parameters:**
  - `response`: The response received from the payment gateway.
- **Flow:**
  1. Verifies the authenticity of the callback request using the X-VERIFY header.
  2. Processes the response data and updates the refund status based on the payment status.
  3. Saves the changes to the refund record.
  4. Sends a success response if the verification is successful.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### checkStatusPayment

- **Purpose:** Checks the payment status from the payment gateway.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Query Parameters:**
  - `transactionId`: The transaction ID for which the payment status is checked.
- **Flow:**
  1. Constructs the URL and hash for the request to the payment gateway.
  2. Sends a request to the payment gateway to check the payment status.
  3. Processes the response data and updates the ledger with the payment status.
  4. Sends a response with the payment status details.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### checkStatusRefund

- **Purpose:** Checks the refund status from the payment gateway.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Query Parameters:**
  - `transactionId`: The transaction ID for which the refund status is checked.
- **Flow:**
  1. Constructs the URL and hash for the request to the payment gateway.
  2. Sends a request to the payment gateway to check the refund status.
  3. Processes the response data and updates the refund record with the refund status.
  4. Sends a response with the refund status details.
  5. If an error occurs, it logs the error and sends a 500 status response with an error message.

#### getPaymentStatus

- **Purpose:** Retrieves the payment status for a specific offer.
- **Parameters:**
  - `req`: HTTP request object.
  - `res`: HTTP response object.
- **Query Parameters:**
  - `offerId`: The ID of the offer for which the payment status is requested.
- **Flow:**
  1. Retrieves the ledger entry for the specified offer.
  2. Sends a response with the payment status extracted from the ledger entry.
  3. If an error occurs, it logs the error and sends a 500 status response with an error message.

### General Comments

- The `refundCallback` function handles the callback URL endpoint for refund processing, verifying the authenticity of the callback request and updating the refund status accordingly.
- `checkStatusPayment` and `checkStatusRefund` are responsible for checking the payment and refund statuses from the payment gateway, respectively, and updating the ledger records with the latest status.
- `getPaymentStatus` retrieves the payment status for a specific offer by querying the ledger entry.
- The code includes detailed comments to explain each step of the process, enhancing readability and maintainability.