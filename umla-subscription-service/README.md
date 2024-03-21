# umla-subscription-service

# Code Documentation

This documentation describes the flow of two functions: `getSubscriptions` and `getUserSubscription`. Both functions are part of a subscription service in a Node.js application using Express.js and MongoDB.

## getSubscriptions Function

```javascript
const getSubscriptions = async (req, res) => {
	try {
		const subscriptions = await Subscription.find().select(
			'-__v -createdAt -updatedAt'
		);
		res.status(200).json({ subscriptions });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'something went wrong' });
	}
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It tries to fetch all subscriptions from the `Subscription` collection in the database.
3. The `.find()` method without any argument returns all documents in the collection.
4. The `.select('-__v -createdAt -updatedAt')` method excludes the fields `__v`, `createdAt`, and `updatedAt` from the returned documents.
5. If the operation is successful, it sends a response with HTTP status 200 and the fetched subscriptions.
6. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and a message indicating that something went wrong.

## getUserSubscription Function

```javascript
const getUserSubscription = async (req, res) => {
	const userId = req.user.id;
	try {
		const data = await UserSubscription.find({
			name: 'Referral Bonus',
			userId,
		}).select('-createdAt -updatedAt');
		res.status(200).json({ subscription: data });
	} catch (err) {
		console.log(err);
		res.status(500).json({ message: 'something went wrong' });
	}
};
```

### Flow

1. The function is an asynchronous function that takes in two parameters: `req` (request) and `res` (response).
2. It extracts the `userId` from the request object.
3. It tries to fetch a specific subscription with the name 'Referral Bonus' for the user with the extracted `userId` from the `UserSubscription` collection in the database.
4. The `.find()` method with an argument returns all documents in the collection that match the provided search criteria.
5. The `.select('-createdAt -updatedAt')` method excludes the fields `createdAt` and `updatedAt` from the returned documents.
6. If the operation is successful, it sends a response with HTTP status 200 and the fetched subscription.
7. If there's an error during the operation, it logs the error and sends a response with HTTP status 500 and a message indicating that something went wrong.