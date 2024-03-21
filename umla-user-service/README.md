# Package.json File

### Main Fields

- **name**: The name of the project, which is "umla-user-service".
- **version**: The current version of the project, which is "1.0.0".
- **main**: The main entry point to the program, which is "app.js".

### Scripts

There are two scripts defined:

```json
"scripts": {
	"start": "node app.js",
	"dev": "nodemon app.js"
}
```

- **start**: This script starts the application using Node.js.
- **dev**: This script starts the application using Nodemon, which will automatically restart the server whenever file changes in the directory are detected.

### Dependencies

The project has several dependencies, including:

- `@azure/storage-blob`: Azure Storage SDK for JavaScript.
- `axios`: Promise based HTTP client for the browser and node.js.
- `body-parser`: Node.js body parsing middleware.
- `cors`: Middleware that can be used to enable CORS with various options.
- `dotenv`: Loads environment variables from a `.env` file into `process.env`.
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `googleapis`: Google's officially supported Node.js client library for accessing Google APIs.
- `jsonwebtoken`: An implementation of JSON Web Tokens.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
- `morgan`: HTTP request logger middleware for Node.js.
- `multer`: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- `node-rsa`: RSA key generation, encryption/decryption, signing/verifying in Node.js.
- `node-schedule`: A cron-like and not-cron-like job scheduler for Node.
- `redis`: A complete and feature-rich Redis client for Node.js.

### Dev Dependencies

The project has one development dependency:

- `nodemon`: A utility that will monitor for any changes in your source and automatically restart your server.

## Express Routes

This is an Express router file that defines various routes for a web application. It uses the `express.Router()` class to create route handlers.

### Middleware

- **multer**: This middleware is used for handling multipart/form-data, which is primarily used for uploading files. The configuration sets the storage to memory and limits the file size to 20MB.
- **authorizeRequest**: This middleware function is used to authorize requests. It's applied to all routes.

### Routes

- **GET /getUser**: This route is used to fetch the details of a single user. It requires authorization.

- **GET /getAllUser/:page**: This route fetches all users with pagination. The page number is passed as a parameter in the URL. It also requires authorization.

- **POST /addUserDetails**: This route is used to add details for a user. It expects an image file in the request and requires authorization.

- **POST /addImage**: This route handles image upload for a user. It expects an image file in the request and requires authorization.

- **GET /prompt/questions**: This route fetches prompt questions for a user. It requires authorization.

- **POST /prompt/answer**: This route is used to add a prompt answer to a user's profile. It requires authorization.

- **POST /travel**: This route updates a user's location. It requires authorization.

- **POST /aadhaar/generate/otp**: This route generates an OTP for Aadhaar verification. It requires authorization.

- **POST /aadhaar/verify/otp**: This route submits the OTP for Aadhaar verification. It requires authorization.

- **POST /update/loc**: This route updates a user's coordinates. It requires authorization.

- **GET /getInstantQueue/:page**: This route fetches users in the instant queue with pagination. It requires authorization.

- **POST /reportUser**: This route reports a user. It requires authorization.

- **POST /blockUser**: This route blocks a matched user. It requires authorization.

- **POST /unmatch**: This route unmatches a user. It requires authorization.

- **GET /filters/get**: This route fetches filter data for a user. It requires authorization.

- **POST /filters/update**: This route updates a user's filter data. It requires authorization.

- **POST /preference/update**: This route updates a user's preferences. It requires authorization.

- **GET /preference/get**: This route fetches a user's preferences. It requires authorization.

- **POST /handleReferral**: This route handles a referral from a user. It requires authorization.

- **GET /getReferralStatus**: This route fetches the status of a referral. It requires authorization.

- **GET /claimOffer**: This route allows a user to claim an offer. It requires authorization.

- **GET /noReferral**: This route is used when a user has no referrals. It requires authorization.

- **POST /delete/singleImage**: This route deletes a single image from a user's profile. It requires authorization.

# Code Flow Documentation

## Function: getUser

This function is an asynchronous function named `getUser` which is used to fetch a user's data and calculate their profile completion percentage.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`.

```javascript
const userId = req.user.id;
```

2. **Find User and Populate Data**: Inside a `try-catch` block, the function attempts to find a user in the `User` model by the `userId`. It also populates related data from the 'offer' and 'outlet' fields.

```javascript
const user = await User.findById(userId)
  .populate({
    path: "offer",
    select: "time offering purpose outlet",
    populate: {
      path: "outlet",
      model: "Outlet",
      select: "name",
    },
  })
  .exec();
```

3. **Find User Prompts**: It then finds all prompts related to the user using `UserPrompt.find({ userId })`.

```javascript
const prompts = await UserPrompt.find({ userId })
  .populate("prompt", "-createdAt -updatedAt")
  .select("-createdAt -updatedAt -userId");
```

4. **Calculate Total Values of Interests**: The function calculates the total values of the user's interests.

```javascript
let totalValues = Object.values(interest).reduce((total, currentArray) => {
  return total + currentArray.length;
}, 0);
```

5. **Calculate Profile Completion Percentage**: It then calculates the profile completion percentage based on various factors such as image, prompts, bio, interests, profession, education, height, gender, location, homeTown, language, starSign, pronouns, sexualOrientation, drinking, exercising, smoking, kids, politicalViews, and religion.

```javascript
let profileCompletion =
  5 * user.image.length +
  5 * prompts.length +
  (user.bio ? 5 : 0) +
  3 * totalValues +
  2 * (user.profession.companyName && user.profession.jobTitle ? 1 : 0) +
  2 * (user.education.instituteName ? 1 : 0) +
  2 * (user.height ? 1 : 0) +
  2 * (user.gender ? 1 : 0) +
  2 * (user.location ? 1 : 0) +
  2 * (user.homeTown ? 1 : 0) +
  2 * (user.language.length ? 1 : 0) +
  2 * (user.starSign ? 1 : 0) +
  2 * (user.pronouns ? 1 : 0) +
  2 * (user.sexualOrientation ? 1 : 0) +
  2 * (user.drinking.length ? 1 : 0) +
  2 * (user.exercising.length ? 1 : 0) +
  2 * (user.smoking.length ? 1 : 0) +
  2 * (user.kids.length ? 1 : 0) +
  2 * (user.politicalViews.length ? 1 : 0) +
  2 * (user.religion.length ? 1 : 0);
```

6. **Set Maximum Profile Completion to 100**: If the calculated profile completion percentage exceeds 100, it is set to 100.

```javascript
if (profileCompletion > 100) {
  profileCompletion = 100;
}
```

7. **Update User's Completion Percentage**: The user's `completionPercentage` field is updated with the calculated profile completion percentage.

```javascript
user.completionPercentage = profileCompletion;
```

8. **Save Updated User Data**: The updated user data is saved using `await user.save()`.

```javascript
await user.save();
```

9. **Send Response**: Finally, a response with status 200 is sent back, containing the user data.

```javascript
res.status(200).json({ success: true, data: { user } });
```

10. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
 console.log(err);
 res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that a user's data is fetched, their profile completion percentage is calculated, and appropriate responses are sent based on the success or failure of the operation.

## Function: getAllUsers

This function is an asynchronous function named `getAllUsers` which is used to fetch all users except the current user and those who have been swiped left, right or matched with.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID and Page**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`. It also extracts the `page` from `req.params`.

```javascript
const userId = req.user.id;
const { page = 0 } = req.params;
```

2. **Fetch Current User, Swipe Data, and User Filter**: Inside a `try-catch` block, the function attempts to find the current user in the `User` model by the `userId`, swipe data from the `Swipe` model, and user filter from the `UserFilter` model.

```javascript
const [currentUser, swipeData, userFilter] = await Promise.all([
  User.findById(userId),
  Swipe.findOne({ uid: userId }),
  UserFilter.findOne({ userId }),
]);
```

3. **Prepare IDs to Exclude**: It then prepares a list of IDs to exclude from the search results. These include the current user's ID and the IDs of users who have been swiped left, right, or matched with.

```javascript
const idToExclude = [
  ...swipeData.left,
  ...swipeData.right,
  ...swipeData.match,
  userId,
];
```

4. **Prepare Query**: The function then prepares the query for fetching users. This includes excluding the IDs prepared in the previous step and only including users who have completed their profiles.

```javascript
const query = {
  _id: { $nin: idToExclude },
  completed: true,
};
```

5. **Fetch Users**: It then fetches users based on the prepared query, skipping a certain number of documents based on the page number and limiting the results to 5 per page. It also excludes certain fields from the results and populates related data from the 'offer' and 'outlet' fields.

```javascript
const users = await User.find(query)
  .skip(page * 5)
  .limit(5)
  .select(
    "-__v -contactNumber -deviceId -email -notification -createdAt -updatedAt"
  )
  .populate({
    path: "offer",
    match: {
      $or: [{ offerType: "scheduled" }, { offerType: { $exists: false } }],
    },
    select: "time offering purpose outlet",
    populate: {
      path: "outlet",
      model: "Outlet",
      select: "name",
    },
  })
  .exec();
```

6. **Send Response**: Finally, a response with status 200 is sent back, containing the fetched users.

```javascript
res.status(200).json({ success: true, data: { user: users } });
```

7. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that all users except the current user and those who have been swiped left, right or matched with are fetched, and appropriate responses are sent based on the success or failure of the operation.

## Function: addUserDetails

This function is an asynchronous function named `addUserDetails` which is used to add or update details of a user.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID and Request Body**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`. It also extracts various fields from `req.body`.

```javascript
const userId = req.user.id;
const {
  name,
  email,
  dob,
  jobTitle,
  companyName,
  instituteName,
  passingYear,
  drinks,
  food,
  place,
  hobbies,
  location,
  notification,
  gender,
  ethnicity,
  starSign,
  height,
  coordinates,
  drinking,
  exercising,
  smoking,
  kids,
  politicalViews,
  religion,
} = req.body;
```

2. **Fetch User**: Inside a `try-catch` block, the function attempts to find the user in the `User` model by the `userId`.

```javascript
const user = await User.findById(userId);
```

3. **Update User Details**: If the corresponding field exists in the request body, each field of the user document is updated accordingly. For example, if `name` exists in the request body, `user.name` is updated with this value.

```javascript
if (name) user.name = name;
if (email) user.email = email;
// ...and so on for all fields
```

4. **Set Completed Status**: The `completed` field of the user document is set to `true`.

```javascript
user.completed = true;
```

5. **Check Location**: If the location doesn't includes 'jaipur' (case-insensitive), certain fields are set to `false`.

```javascript
if (!location.toLowerCase().includes("jaipur".toLowerCase())) {
  user.claimOffer = false;
  user.claimable = false;
  user.earlyBird = false;
}
```

6. **Save User**: The updated user document is then saved to the database.

```javascript
const result = await user.save();
```

7. **Send Response**: Finally, a response with status 200 is sent back, containing the updated user.

```javascript
res.status(200).json({ success: true, data: { user: result } });
```

8. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the user's details are updated based on the provided request body, and appropriate responses are sent based on the success or failure of the operation.

## Function: updateLocation

This function is an asynchronous function named `updateLocation` which is used to update the location details of a user.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID and Request Body**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`. It also extracts `coordinates` and `location` from `req.body`.

```javascript
const userId = req.user.id;
const { coordinates, location } = req.body;
```

2. **Fetch User**: Inside a `try-catch` block, the function attempts to find the user in the `User` model by the `userId`.

```javascript
const user = await User.findById(userId);
```

3. **Update Location Details**: The `coordinates` and `location` fields of the user document are updated with the corresponding values from the request body. The `travel` field is set to `true`.

```javascript
user.loc.coordinates = coordinates;
user.location = location;
user.travel = true;
```

4. **Save User**: The updated user document is then saved to the database.

```javascript
await user.save();
```

5. **Send Response**: Finally, a response with status 200 is sent back, containing a success message.

```javascript
res.status(200).json({ message: "updated" });
```

6. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the user's location details are updated based on the provided request body, and appropriate responses are sent based on the success or failure of the operation.

## Function: handleImageUpload

This function is an asynchronous function named `handleImageUpload` which is used to handle the image upload process for a user.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID and Image**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`. It also extracts `file` from `req` and assigns it to `image`.

```javascript
const userId = req.user.id;
const image = req.file;
```

2. **Fetch User**: Inside a `try-catch` block, the function attempts to find the user in the `User` model by the `userId`.

```javascript
const user = await User.findById(userId);
```

3. **Create Blob Name**: A blob name is created using the current date-time and the original name of the image file.

```javascript
const blobName = `${Date.now()}-${image.originalname}`;
```

4. **Get Block Blob Client**: A block blob client is obtained from the container client using the blob name.

```javascript
const blockBlobClient = containerClient.getBlockBlobClient(blobName);
```

5. **Upload Data**: The image data (buffer) is uploaded using the block blob client. The content type of the blob is set to the mimetype of the image.

```javascript
await blockBlobClient.uploadData(image.buffer, {
  blobHTTPHeaders: { blobContentType: image.mimetype },
});
```

6. **Update User Document**: The URL of the uploaded image is pushed into the `image` array of the user document.

```javascript
const imageUrl = blockBlobClient.url;
user.image.push(imageUrl);
```

7. **Save User**: The updated user document is then saved to the database.

```javascript
await user.save();
```

8. **Send Response**: Finally, a response with status 200 is sent back, containing a success message and the URL of the uploaded image.

```javascript
res.status(200).json({ success: true, url: imageUrl });
```

9. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the user's image is uploaded successfully and the URL of the image is stored in the user document. Appropriate responses are sent based on the success or failure of the operation.

## Function: getPrompts

This function is an asynchronous function named `getPrompts` which is used to fetch prompts from the database.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`.

```javascript
const userId = req.user.id;
```

2. **Fetch Prompts**: Inside a `try-catch` block, the function attempts to find all documents in the `Prompt` model, excluding the fields `__v`, `createdAt`, and `updatedAt`.

```javascript
const prompts = await Prompt.find().select("-__v -createdAt -updatedAt");
```

3. **Process Prompts**: The fetched prompts are then processed using the `reduce` method to create an object where each key is a tag and its value is an array of objects containing `_id` and `question` for each prompt with that tag.

```javascript
let tags = [];
let response = prompts.reduce((acc, item) => {
  if (!acc[item.tag]) {
    tags.push(item.tag);
    acc[item.tag] = [];
  }
  acc[item.tag].push({
    _id: item._id,
    question: item.question,
  });
  return acc;
}, {});
```

4. **Fetch User Prompts**: The function then finds all user prompts associated with the `userId`, populates the `prompt` field with `_id`, `tag`, and `question`, and selects `_id`, `prompt`, and `answer`.

```javascript
const userPrompt = await UserPrompt.find({ userId })
  .populate("prompt", "_id tag question")
  .select("_id prompt answer")
  .lean()
  .exec();
```

5. **Send Response**: Finally, a response with status 200 is sent back, containing the processed prompts, tags, and user prompts.

```javascript
res.status(200).json({ prompts: response, tags, userPrompt });
```

6. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the prompts are fetched successfully from the database, processed, and returned along with the user prompts. Appropriate responses are sent based on the success or failure of the operation.

## Function: addPromptToProfile

This function is an asynchronous function named `addPromptToProfile` which is used to add a prompt to a user's profile.

### Parameters

- `req`: The request object from the client.
- `res`: The response object to be sent back to the client.

### Code Flow

1. **Extract User ID and Request Body**: The function begins by extracting the `id` from `req.user` and assigns it to `userId`. It also extracts `answer`, `promptId`, and `bio` from `req.body`.

```javascript
const userId = req.user.id;
const { answer, promptId, bio } = req.body;
```

2. **Create User Prompt**: Inside a `try-catch` block, the function checks if `answer` and `promptId` are provided. If they are, it creates a new document in the `UserPrompt` model with `userId`, `promptId`, and `answer`.

```javascript
if (answer && promptId) {
  await UserPrompt.create({
    userId,
    prompt: promptId,
    answer,
  });
}
```

3. **Update User Bio**: If `bio` is provided, the function finds the user with `userId`, updates their `bio`, and saves the changes.

```javascript
if (bio) {
  const user = await User.findById(userId);
  user.bio = bio;
  await user.save();
}
```

4. **Fetch User Prompts**: The function then finds all user prompts associated with the `userId`, populates the `prompt` field with `_id`, `tag`, and `question`, and selects `_id`, `prompt`, and `answer`.

```javascript
const userPrompt = await UserPrompt.find({ userId })
  .populate("prompt", "_id tag question")
  .select("_id prompt answer")
  .lean()
  .exec();
```

5. **Fetch User Bio**: The function finds the user with `userId` again to fetch their updated bio.

```javascript
const user = await User.findById(userId);
```

6. **Send Response**: Finally, a response with status 201 is sent back, containing the user prompts and the user's bio.

```javascript
res.status(201).json({ userPrompt, bio: user.bio ? user.bio : "" });
```

7. **Error Handling**: If any error occurs during this process, they are caught in the `catch` block, logged to the console, and a response with status 500 and an error message is sent back.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that a prompt is added to a user's profile successfully and the user's bio is updated if provided. Appropriate responses are sent based on the success or failure of the operation.

## Function: generateSignature

This function is an asynchronous function named `generateSignature` which is used to generate a signature by encrypting data using a public key.

### Code Flow

1. **Generate Timestamp**: The function begins by generating a timestamp, which is the current time in seconds since the Unix epoch (January 1, 1970).

```javascript
const timestamp = Math.floor(Date.now() / 1000);
```

2. **Prepare Data to Encrypt**: It then prepares the data to be encrypted by concatenating the client ID (retrieved from environment variables) and the timestamp, separated by a dot.

```javascript
const dataToEncrypt = `${process.env.x_client_id}.${timestamp}`;
```

3. **Define Public Key**: The public key used for encryption is defined as a string.

```javascript
const publicKey =
	'-----BEGIN PUBLIC KEY-----\n' +
	... +
	'-----END PUBLIC KEY-----\n';
```

4. **Import Public Key**: A new instance of `NodeRSA` is created and the public key is imported into it.

```javascript
const key = new NodeRSA();
key.importKey(publicKey, "pkcs8-public-pem");
```

5. **Encrypt Data**: The data prepared earlier is encrypted using the imported public key and the output format is set to 'base64'.

```javascript
const encryptedData = key.encrypt(dataToEncrypt, "base64");
```

6. **Return Encrypted Data**: Finally, the encrypted data is returned from the function.

```javascript
return encryptedData;
```

This function ensures that a signature is generated by encrypting the client ID and timestamp using a public key. The encrypted data can then be used as a signature for secure communication.

## Function: generateOtpToVerifyAadhaar

This asynchronous function named `generateOtpToVerifyAadhaar` is used to generate an OTP for Aadhaar verification.

### Code Flow

1. **Extract User ID and Aadhaar Number**: The function begins by extracting the user ID from the request object and the Aadhaar number from the request body.

```javascript
const userId = req.user.id;
const { aadhaarNumber } = req.body;
```

2. **Find Aadhaar Data**: It then tries to find the Aadhaar data in the database using the provided Aadhaar number.

```javascript
const aadhaarData = await AadhaarData.findOne({
  aadhaar: aadhaarNumber,
});
```

3. **Check Aadhaar Data**: If the Aadhaar data exists and it's linked to another account, the function returns an error message.

```javascript
if (aadhaarData) {
  if (aadhaarData.uid !== userId && aadhaarData.status === "verified") {
    res.status(401).json({
      message: "aadhaar linked to another account",
    });
  }
}
```

4. **Prepare Request Data**: The function prepares the URL, headers, and data for the API request.

```javascript
const url = "https://api.cashfree.com/verification/offline-aadhaar/otp";
const headers = {
  "x-client-id": process.env.x_client_id,
  "x-client-secret": process.env.x_client_secret,
  "X-Cf-Signature": await generateSignature(),
  "Content-Type": "application/json",
};
const data = {
  aadhaar_number: aadhaarNumber,
};
```

5. **Send API Request**: The function sends a POST request to the API and logs the response.

```javascript
const response = await axios.post(url, data, { headers });
console.log("response ", response.data);
```

6. **Handle API Response**: The function handles the API response based on the message received.

```javascript
switch (response.data.message) {
  case "OTP sent successfully":
    await AadhaarData.create({
      uid: userId,
      ref_id: response.data.ref_id,
      aadhaar: aadhaarNumber,
      status: "failed",
    });
    return res.status(200).json({
      message: response.data.message,
      ref_id: response.data.ref_id,
    });
  case "Invalid Aadhaar Card":
    return res.status(200).json({ message: response.data.message });
  case "Aadhaar not linked to mobile number":
    return res.status(200).json({ message: response.data.message });
}
```

7. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	console.log(err.response);
	if (err.response && err.response.status === 409) {
		return res.status(409).son({
			message:
				'Otp generated for this aadhaar, please try after some time',
		});
	} else if (err.response && err.response.status === 422) {
		return res.status(409).son({
			message: 'Insufficient balance to process this request',
		});
	} else return res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that an OTP is generated for Aadhaar verification by interacting with an external API and handling the responses appropriately.

## Function: submitOptForAadhaarVerification

This asynchronous function named `submitOptForAadhaarVerification` is used to submit an OTP for Aadhaar verification.

### Code Flow

1. **Extract User ID, OTP and Reference ID**: The function begins by extracting the user ID from the request object, and the OTP and reference ID from the request body.

```javascript
const userId = req.user.id;
const { otp, ref_id } = req.body;
```

2. **Prepare Request Data**: It then prepares the URL, headers, and data for the API request.

```javascript
const url = "https://api.cashfree.com/verification/offline-aadhaar/verify";
const headers = {
  "x-client-id": process.env.x_client_id,
  "x-client-secret": process.env.x_client_secret,
  "X-Cf-Signature": await generateSignature(),
  "Content-Type": "application/json",
};
const data = {
  ref_id,
  otp,
};
```

3. **Send API Request**: The function sends a POST request to the API.

```javascript
const response = await axios.post(url, data, { headers });
```

4. **Update Aadhaar Data**: The function finds the Aadhaar data using the reference ID and updates it with the response data.

```javascript
const aadhaarData = await AadhaarData.findOne({ ref_id });
aadhaarData.name = response.data.name;
aadhaarData.state = response.data.split_address.state;
aadhaarData.dob = response.data.dob;
aadhaarData.status = "verified";
aadhaarData.gender = response.data.gender;
await aadhaarData.save();
```

5. **Update User Data**: The function finds the user using the user ID and updates the user's data.

```javascript
const user = await User.findById(userId);
user.dob = aadhaarData.dob;
if (!aadhaarData.name.includes(user.name)) {
  const name = aadhaarData.name.split(" ");
  user.name = name[0];
}
if (aadhaarData.gender === "M") {
  user.gender = "male";
}
if (aadhaarData.gender === "F") {
  user.gender = "female";
}
user.verified = true;
user.homeTown = response.data.split_address.state;
await user.save();
```

6. **Send Response**: The function sends a success message as the response.

```javascript
res.status(200).json({ message: "Verification successful" });
```

7. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	console.log(err.response);
	if (err.response && err.response.status === 401) {
		return res.status(401).son({
			message: 'Invalid OTP',
		});
	} else return res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that an OTP is submitted for Aadhaar verification by interacting with an external API and handling the responses appropriately.

## Function: updateCoordinates

This asynchronous function named `updateCoordinates` is used to update the coordinates of a user.

### Code Flow

1. **Extract User ID and Request Data**: The function begins by extracting the user ID from the request object, and the coordinates, location, and travel status from the request body.

```javascript
const userId = req.user.id;
const { coordinates, location, travel } = req.body;
```

2. **Find User and Update Data**: It then finds the user using the user ID. If the travel status is not provided or if the user's travel status is false, it updates the user's coordinates and location.

```javascript
const user = await User.findById(userId);
if (!travel) {
  user.travel = false;
}
if (!user.travel) {
  user.loc.coordinates = coordinates;
  user.location = location;
  await user.save();
}
```

3. **Send Response**: The function sends a success message as the response.

```javascript
res.status(200).json({ message: "updated" });
```

4. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the user's coordinates are updated correctly based on their travel status.

## Function: getInstantQueueUsers

This asynchronous function named `getInstantQueueUsers` is used to fetch users who are in the instant queue.

### Code Flow

1. **Extract User ID and Page Number**: The function begins by extracting the user ID from the request object, and the page number from the request parameters.

```javascript
const userId = req.user.id;
const { page = 0 } = req.params;
```

2. **Fetch Current User and Swipe Data**: It then fetches the current user and swipe data using the user ID.

```javascript
const [currentUser, swipeData] = await Promise.all([
  User.findById(userId),
  Swipe.findOne({ uid: userId }),
]);
```

3. **Prepare Exclusion List and Fetch Instant Offers**: It prepares a list of IDs to exclude (those who have been swiped left, right, matched, or the current user) and fetches instant offers within a certain distance that do not belong to the excluded users.

```javascript
const userLocation = currentUser.loc.coordinates;
const idToExclude = [
  ...swipeData.left,
  ...swipeData.right,
  ...swipeData.match,
  userId,
];
const instantOffers = await Offer.find({
  offerType: "instant",
  "loc.coordinates": {
    $nearSphere: {
      $geometry: { type: "Point", coordinates: userLocation },
      $minDistance: 0,
      $maxDistance: 2 * 1000, //! need to make is dynamic
    },
  },
  owner: { $nin: idToExclude },
}).select("owner");
```

4. **Fetch Users**: It fetches users who are not in the exclusion list and whose IDs are in the list of owners of the fetched instant offers. It also populates the offer details for these users.

```javascript
const userIds = instantOffers.map((offer) => offer.owner);
const users = await User.find({
  $and: [
    {
      _id: { $nin: idToExclude },
    },
    {
      _id: { $in: userIds },
    },
  ],
})
  .skip(page * 5)
  .limit(5)
  .select(
    "-__v -contactNumber -deviceId -email -notification -createdAt -updatedAt"
  )
  .populate({
    path: "offer",
    match: {
      offerType: "instant",
    },
    select: "time offering purpose outlet",
    populate: {
      path: "outlet",
      model: "Outlet",
      select: "name",
    },
  })
  .exec();
```

5. **Send Response**: The function sends the fetched users as the response.

```javascript
let response = users;
res.status(200).json({ success: true, data: { user: response } });
```

6. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that the users in the instant queue are fetched correctly based on their location and swipe data.

## Function: reportUser

This asynchronous function named `reportUser` is used to report a user.

### Code Flow

1. **Extract User ID, Second User ID and Reason**: The function begins by extracting the user ID from the request object, and the second user ID and reason from the request body.

```javascript
const userId = req.user.id;
const { secondUserId, reason } = req.body;
```

2. **Block User**: It then calls the `blockUser` function to block the second user for the current user.

```javascript
await blockUser(userId, secondUserId, true);
```

3. **Create Report**: After blocking the user, it creates a new report with the user ID, reported user ID, and the reason for reporting.

```javascript
await Report.create({
  userId,
  reportedUserId: secondUserId,
  reportReason: reason,
});
```

4. **Send Response**: The function sends a success message as the response.

```javascript
res.status(200).json({ message: "User reported" });
```

5. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that users can be reported and blocked correctly based on the provided information.

## Function: blockMatchedUser

This asynchronous function named `blockMatchedUser` is used to block a matched user.

### Code Flow

1. **Extract User ID and Second User ID**: The function begins by extracting the user ID from the request object, and the second user ID from the request body.

```javascript
const userId = req.user.id;
const { secondUserId } = req.body;
```

2. **Block User**: It then calls the `blockUser` function to block the second user for the current user.

```javascript
await blockUser(userId, secondUserId, true);
```

3. **Send Response**: The function sends a success message as the response.

```javascript
res.status(200).json({ message: "User blocked" });
```

4. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that users can be blocked correctly based on the provided information.

## Function: unmatch

This asynchronous function named `unmatch` is used to unmatch a user.

### Code Flow

1. **Extract User ID and Second User ID**: The function begins by extracting the user ID from the request object, and the second user ID from the request body.

```javascript
const userId = req.user.id;
const { secondUserId } = req.body;
```

2. **Unmatch User**: It then calls the `blockUser` function with the third parameter as false to unmatch the second user for the current user.

```javascript
await blockUser(userId, secondUserId, false);
```

3. **Send Response**: The function sends a success message as the response.

```javascript
res.status(200).json({ message: "User unmatched" });
```

4. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that users can be unmatched correctly based on the provided information.

## Function: getFilterData

This asynchronous function named `getFilterData` is used to retrieve the filter data for a user.

### Code Flow

1. **Extract User ID**: The function begins by extracting the user ID from the request object.

```javascript
const userId = req.user.id;
```

2. **Retrieve Filter Data**: It then attempts to find the filter data for the user in the `UserFilter` collection.

```javascript
let filterData = await UserFilter.findOne({ userId });
```

3. **Create Filter Data if Not Found**: If no filter data is found, it creates a new entry in the `UserFilter` collection for the user and retrieves the newly created filter data.

```javascript
if (!filterData) {
  await UserFilter.create({ userId });
  filterData = await UserFilter.findOne({ userId });
}
```

4. **Send Response**: The function sends the retrieved filter data as the response.

```javascript
res.status(200).json({ filter: filterData });
```

5. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.log(err);
	res.status(500).json({ message: 'something went wrong' });
}
```

This function ensures that users can retrieve their filter data correctly based on the provided information.

## Function: updateFilter

This asynchronous function named `updateFilter` is used to update the filter data for a user.

### Code Flow

1. **Extract User ID**: The function begins by extracting the user ID from the request object.

```javascript
const userId = req.user.id;
```

2. **Retrieve Filter Data**: It then attempts to find the filter data for the user in the `UserFilter` collection.

```javascript
let filterData = await UserFilter.findOne({ userId });
```

3. **Create Filter Data if Not Found**: If no filter data is found, it creates a new entry in the `UserFilter` collection for the user.

```javascript
if (!filterData) {
  filterData = new UserFilter({ userId });
}
```

4. **Update Filter Data**: The function then updates the filter data based on the keys and values provided in the request body.

```javascript
// Update filter data based on keys and values in req.body
...
```

5. **Save Updated Filter Data**: After updating the filter data, it saves the changes to the database.

```javascript
await filterData.save();
```

6. **Send Response**: The function sends the updated filter data as the response.

```javascript
res.status(200).json({ filter: filterData });
```

7. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: 'Something went wrong' });
}
```

This function ensures that users can update their filter data correctly based on the provided information.

## Function: getPreference

This asynchronous function named `getPreference` is used to retrieve the preference data for a user.

### Code Flow

1. **Retrieve Preference Data**: The function begins by attempting to find the preference data for the user in the `OfferPreference` collection.

```javascript
const preference = await OfferPreference.findOne({
  userId: req.user.id,
});
```

2. **Check if Preference Exists**: If no preference data is found, it returns a 404 status code with an appropriate message.

```javascript
if (!preference) {
  return res.status(404).json({ message: "No preference found for this user" });
}
```

3. **Send Response**: If the preference data is found, it sends the data as the response.

```javascript
res.status(200).json(preference);
```

4. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (error) {
	console.error(err);
	res.status(500).json({ message: error.message });
}
```

This function ensures that users can retrieve their preference data correctly.

## Function: updatePreference

This asynchronous function named `updatePreference` is used to update the preference data for a user.

### Code Flow

1. **Update Preference Data**: The function begins by attempting to find and update the preference data for the user in the `OfferPreference` collection.

```javascript
const updatedPreference = await OfferPreference.findOneAndUpdate(
  { userId: req.user.id },
  req.body,
  { new: true }
);
```

2. **Check if Preference Exists**: If no preference data is found, it returns a 404 status code with an appropriate message.

```javascript
if (!updatedPreference) {
  return res.status(404).json({
    message: "No preference found to update for this user",
  });
}
```

3. **Send Response**: If the preference data is found and updated, it sends the updated data as the response.

```javascript
res.status(200).json(updatedPreference);
```

4. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (error) {
	console.error(err);
	res.status(500).json({ message: error.message });
}
```

This function ensures that users can update their preference data correctly.

## Function: handleReferral

This asynchronous function named `handleReferral` is used to handle the referral process for a user.

### Code Flow

1. **Extract User and Referral Data**: The function begins by extracting the user ID from the request object and the referral code from the request body.

```javascript
const userId = req.user.id;
const { referralCode } = req.body;
```

2. **Find Current User's Referral Document**: It then finds the referral document for the current user based on their user ID.

```javascript
const currentUserReferral = await UserReferral.findOne({
  userId: userId,
});
```

3. **Update Current User's ReferredBy Status**: The function updates the `referredBy` status of the current user to `true`.

```javascript
currentUser.referredBy = true;
```

4. **Find Referred User's Referral Document**: It then finds the referral document for the referred user based on the referral code.

```javascript
const referredUserReferral = await UserReferral.findOne({
  referralCode: referralCode,
});
```

5. **Check for Invalid Referral Code**: If the referral code belongs to the current user or if either the current user's referral document or the referred user's referral document does not exist, it returns an error message.

```javascript
if (currentUser.referralCode === referralCode) {
  return res.status(404).json({ message: "Invalid Referral Code" });
}

if (!currentUserReferral || !referredUserReferral) {
  return res.status(404).json({ message: "Invalid Referral Code" });
}
```

6. **Check for Already Referred Status**: If the current user has already been referred, it returns an error message.

```javascript
if (currentUserReferral.referredBy) {
  return res.status(400).json({ message: "Already referred" });
}
```

7. **Update ReferredTo and ReferredBy Fields**: The function then updates the `referredTo` field of the referred user's referral document and the `referredBy` field of the current user's referral document.

```javascript
referredUserReferral.referredTo[gender] = [
  ...new Set([...referredUserReferral.referredTo[gender], userId]),
];

currentUserReferral.referredBy = referredUserReferral.userId;
```

8. **Calculate Referral Rewards**: The function calculates the referral rewards based on the number of successful referrals and updates the `referralReward` field of the referred user's referral document accordingly.

9. **Save Updated Documents**: It then saves the updated documents to the database.

```javascript
await currentUserReferral.save();
await referredUserReferral.save();

await user.save();
await currentUser.save();
```

10. **Return Success Message**: Finally, it returns a success message.

```javascript
res.json({ message: "Successfully updated referral information" });
```

11. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: err.message });
}
```

This function ensures that the referral process is handled correctly and that users receive their referral rewards as expected.

## Function: getReferralStatus

This asynchronous function named `getReferralStatus` is used to fetch the referral status for a user.

### Code Flow

1. **Extract User ID**: The function begins by extracting the user ID from the request object.

```javascript
const userId = req.user.id;
```

2. **Find User's Referral Document**: It then finds the referral document for the user based on their user ID.

```javascript
const userReferral = await UserReferral.findOne({ userId });
```

3. **Create Referral Code Array**: The function creates an array of referral codes by combining the `referredTo.male` and `referredTo.female` arrays from the user's referral document.

```javascript
const referralCodeArray = [
  ...userReferral.referredTo.male,
  ...userReferral.referredTo.female,
];
```

4. **Fetch Referral Status**: It then fetches the referral status for each referral code in the array using `Promise.all` to execute all promises concurrently.

```javascript
const referralStatus = await Promise.all(
  referralCodeArray.map(async (code) => {
    const referralData = await UserReferral.findOne({
      referralCode: code,
    });
    const user = await User.findById(referralData.userId);
    const data = {
      name: user.name,
      img: user.image[0],
      verified: user.verified,
      profileCompletion: user.profileCompletion,
      referralSuccess: user.verified && user.profileCompletion >= 80,
    };
    return data;
  })
);
```

5. **Return Referral Status**: Finally, it returns the referral status as a JSON response.

```javascript
res.status(200).json({ referralStatus });
```

6. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: err.message });
}
```

This function ensures that users can easily fetch their referral status, including information about each referred user such as their name, image, verification status, profile completion percentage, and whether the referral was successful.

## Function: claimOffer

This asynchronous function named `claimOffer` is used to allow a user to claim an offer.

### Code Flow

1. **Extract User ID**: The function begins by extracting the user ID from the request object.

```javascript
const userId = req.user.id;
```

2. **Find User Document**: It then finds the user document based on their user ID.

```javascript
const user = await User.findById(userId);
```

3. **Update Claim Offer Status**: The function updates the `claimOffer` field of the user document to `true`, indicating that the user has claimed the offer.

```javascript
user.claimOffer = true;
await user.save();
```

4. **Return Success Response**: Finally, it returns a success response as a JSON object.

```javascript
res.status(200).json({ success: true });
```

5. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: err.message });
}
```

This function ensures that users can easily claim offers, and that this action is properly recorded in their user document.

## Function: noReferral

This asynchronous function named `noReferral` is used to update the referral status of a user.

### Code Flow

1. **Extract User ID**: The function begins by extracting the user ID from the request object.

```javascript
const userId = req.user.id;
```

2. **Find User Document**: It then finds the user document based on their user ID.

```javascript
const user = await User.findById(userId);
```

3. **Update Referral Status**: The function updates the `referredBy` field of the user document to `true`, indicating that the user was referred by someone.

```javascript
user.referredBy = true;
await user.save();
```

4. **Return Success Response**: Finally, it returns a success response as a JSON object.

```javascript
res.status(200).json({ success: true });
```

5. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: err.message });
}
```

This function ensures that users' referral status can be easily updated, and that this

## Function: deleteSingleImage

This asynchronous function named `deleteSingleImage` is used to remove a specific image from a user's image array.

### Code Flow

1. **Extract User ID and Image URL**: The function begins by extracting the user ID from the request object and the image URL from the request body.

```javascript
const userId = req.user.id;
const { imageUrl } = req.body;
```

2. **Find User Document**: It then finds the user document based on their user ID.

```javascript
const user = await User.findById(userId);
```

3. **Remove Image from Array**: The function removes the specified image URL from the user's image array using the `pull` method.

```javascript
user.image.pull(imageUrl);
await user.save();
```

4. **Fetch Updated User Data**: After saving the changes, it fetches the updated user data.

```javascript
const userData = await User.findById(userId);
```

5. **Return Success Response**: Finally, it returns a success response along with the updated user data as a JSON object.

```javascript
res.status(200).json({ success: true, user: userData });
```

6. **Error Handling**: If an error occurs during the process, the function logs the error and returns an appropriate response.

```javascript
catch (err) {
	console.error(err);
	res.status(500).json({ message: err.message });
}
```

This function ensures that a specific image can be easily removed from a user's image array, and that this action is properly recorded in their user document.

# Snooze Toggle Function Documentation

This document provides a detailed explanation of the `snoozeToggle` function in JavaScript.

## Function Definition

```javascript
const snoozeToggle = async (req, res) => {
  const userId = req.user.id;
  try {
    const user = await User.findById(userId);
    user.snoozed = user.snoozed === false ? true : false;
    await user.save();
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "something went wrong" });
  }
};
```

## Code Flow

1. **Function Initialization**: The function `snoozeToggle` is an asynchronous function that takes two parameters, `req` and `res`. These represent the request and response objects respectively.

2. **User ID Extraction**: The user ID is extracted from the request object (`req.user.id`) and stored in the `userId` variable.

3. **Try-Catch Block**: A try-catch block is used to handle any potential errors during the execution of the code.

   - **Try Block**:

     1. The function attempts to find a user with the given `userId` using the `User.findById()` method.
     2. If the user is found, the `snoozed` property of the user object is toggled. If it was `false`, it becomes `true` and vice versa.
     3. The updated user object is then saved using the `user.save()` method.
     4. If all these operations are successful, a response with status code `200` and a JSON object `{ success: true }` is sent back to the client.

   - **Catch Block**:
     1. If there's an error at any point during the execution of the try block, the catch block is executed.
     2. The error is logged to the console and a response with status code `500` and a JSON object `{ message: 'something went wrong' }` is sent back to the client.

This function is typically used in scenarios where a user wants to toggle their "snooze" setting, which could be a feature in an application that allows users to mute notifications for a certain period of time.

# Code Documentation

This asynchronous function handles the soft deletion of a user's profile in the Node.js application using MongoDB.

## Overview

```javascript
const softDeleteProfile = async (req, res) => {
  /* ... */
};
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `softDeleteProfile(req, res)`

This function soft deletes the profile of the authenticated user. It sets the `deleted` flag of the user document to `true` and updates the `contactNumber` to the user's `_id` for reference. Additionally, it allows the user to provide a reason for the deletion.

The function retrieves the user's document using the user ID from the request, updates the necessary fields, and saves the changes.

It then finds all rooms associated with the user, including those where the user is the first or second user, and deletes the corresponding chats, offer responses, and rooms.

Next, it deletes the user's preferences, subscription checks, swipes, filters, prompts, referrals, and subscription records.

The function also deletes any images associated with the user from the Azure Blob Storage container.

If successful, the function responds with a status code of 200 and a success message. If an error occurs during the process, it logs the error and responds with a status code of 500 and a generic error message.

# Code Documentation

This asynchronous function handles the deletion of a prompt associated with a user in the Node.js application using MongoDB.

## Overview

```javascript
const deletePrompt = async (req, res) => {
  /* ... */
};
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `deletePrompt(req, res)`

This function deletes a prompt associated with the authenticated user. It takes the prompt ID from the request body and attempts to delete the corresponding prompt document from the database.

If the prompt is successfully deleted, the function retrieves all prompts associated with the user and returns them along with the user's bio. The prompts are populated with their details, including the prompt ID, tag, and question.

If an error occurs during the deletion process or while fetching the user's prompts, the function logs the error and responds with a status code of 500 along with a generic error message.

The `whoLikedYou` function retrieves information about users who have liked the authenticated user. Below is the documentation for this function:

# Code Documentation

This asynchronous function retrieves information about users who have liked the authenticated user in the Node.js application using MongoDB.

## Overview

```javascript
const whoLikedYou = async (req, res) => {
  /* ... */
};
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `whoLikedYou(req, res)`

This function retrieves information about users who have liked the authenticated user. It queries the database to find the user's swipe data and populates the `gotRight` field, which represents users who have swiped right (liked) the authenticated user.

The function then filters out users who have liked the authenticated user but have not resulted in a match or are not blocked by the authenticated user. The filtered list of users who have liked the authenticated user is then returned in the response.

If an error occurs during the retrieval process, the function logs the error and responds with a status code of 500 along with a generic error message.


The `getOtherUserPreference` function retrieves the preferences of a user specified by their user ID. Below is the documentation for this function:


# Code Documentation

This asynchronous function retrieves the preferences of a user specified by their user ID in the Node.js application using MongoDB.

## Overview

```javascript
const getOtherUserPreference = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getOtherUserPreference(req, res)`

This function retrieves the preferences of a user specified by their user ID. It queries the database to find the preference document associated with the provided user ID.

If no preference document is found for the specified user ID, the function responds with a status code of 404 along with a message indicating that no preference was found.

If the preference document is found, it is returned in the response with a status code of 200.

If an error occurs during the retrieval process, the function logs the error and responds with a status code of 500 along with an error message.



The `getOtherUser` function retrieves user information and prompts associated with a specific user ID. Below is the documentation for this function:

```markdown
# Code Documentation

This asynchronous function retrieves user information and prompts associated with a specific user ID in the Node.js application using MongoDB.

## Overview

```javascript
const getOtherUser = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getOtherUser(req, res)`

This function retrieves user information and prompts associated with a specific user ID provided in the request body. It queries the database to find the user document associated with the provided user ID.

If the user document is found, it populates the `offer` field, selecting specific fields from the Offer model, and populates the `outlet` field within the `offer` field, selecting specific fields from the Outlet model.

It then retrieves prompts associated with the user ID from the UserPrompt collection.

The function constructs a response object containing the user information and prompts and sends it in the response.

If an error occurs during the retrieval process, the function logs the error and responds with a status code of 500 along with an error message.



Below is the documentation for the `addUserQuery` function:

```markdown
# Code Documentation

This asynchronous function adds a user query with associated title, description, and images to the database in a Node.js application using MongoDB.

## Overview

```javascript
const addUserQuery = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `addUserQuery(req, res)`

This function adds a user query to the database with the provided user ID, title, description, and images. It expects the user ID to be available in the request object (`req.user.id`), the title and description to be provided in the request body, and the images to be uploaded as files in the request.

The function uploads each image to the Azure Blob Storage using the Azure Storage SDK. It generates a unique blob name based on the current timestamp and the original name of the file. After uploading, it retrieves the URL of each uploaded image.

The function then creates a new Userquery document with the user ID, title, description, and array of image URLs, and saves it to the database.

If successful, the function responds with a status code of 200 and a success message along with the saved query object. If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.

Below is the documentation for the `getUserQuery` function:

```markdown
# Code Documentation

This asynchronous function retrieves user queries from the database in a Node.js application using MongoDB.

## Overview

```javascript
const getUserQuery = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `getUserQuery(req, res)`

This function retrieves user queries associated with the currently authenticated user from the database. It expects the user ID to be available in the request object (`req.user.id`).

The function queries the `Userquery` collection in the database to find documents where the user ID matches the authenticated user's ID and the title is not equal to "Feedback". It selects specific fields (`status`, `title`, `description`, `resolution`, and `createdAt`) and sorts the results in descending order based on the creation date.

For each query document retrieved, the function formats the date and time fields to display in Indian Standard Time (IST) and constructs a response object containing the status, date, time, title, query description, and resolution (if available).

If successful, the function responds with a status code of 200 and an array of formatted query objects. If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.


Below is the documentation for the `addUserFeedback` function:

```markdown
# Code Documentation

This asynchronous function adds user feedback to the database in a Node.js application using MongoDB.

## Overview

```javascript
const addUserFeedback = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `addUserFeedback(req, res)`

This function adds user feedback provided by the authenticated user to the database. It expects the user ID to be available in the request object (`req.user.id`). The feedback description is extracted from the request body.

The function uploads any images attached to the feedback using Azure Blob Storage. It generates a unique blob name for each image, uploads the image data to the blob storage container, and retrieves the URL of the uploaded image.

The function then creates a new document in the `Userquery` collection with the user ID, title set to "Feedback", feedback description, and URLs of any attached images. The document is saved to the database.

If successful, the function responds with a status code of 200 and a success message along with the details of the saved query. If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.

Below is the documentation for the `cancelfreeOffer` function:

```markdown
# Code Documentation

This asynchronous function cancels a free offer for the authenticated user in a Node.js application using MongoDB.

## Overview

```javascript
const cancelfreeOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `cancelfreeOffer(req, res)`

This function cancels a free offer for the authenticated user. It expects the user ID to be available in the request object (`req.user.id`).

The function updates the `UserCheck` document for the user to mark that the free offer has been denied.

If successful, the function responds with a status code of 200 and a success message. If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.

Below is the documentation for the `checkIfFloatOffer` function:

```markdown
# Code Documentation

This asynchronous function checks if the authenticated user has a floating offer and filters out other users based on their availability in a Node.js application using MongoDB.

## Overview

```javascript
const checkIfFloatOffer = async (req, res) => { /* ... */ };
```

The function is an `async` function, meaning it returns a Promise and can use the `await` keyword to pause execution until a Promise is resolved or rejected.

### Function: `checkIfFloatOffer(req, res)`

This function checks if the authenticated user has a floating offer and filters out other users based on their availability.

The function expects the following parameters in the request:
- `userId`: The ID of the authenticated user.
- `allUsers`: An array containing all users to be filtered.

The function performs the following steps:
1. Retrieves the booked slots of the authenticated user for the next two days using the `bookedSlots` function.
2. Checks if the user has no booked slots. If so, returns all users without any filtering.
3. Retrieves the floating offers of the authenticated user that occur after the current time.
4. Filters out users who have floating offers at the same time as the authenticated user's floating offers. If both users have floating offers at the same time, they should not see each other's profiles.
5. Filters out users whose booked slots overlap with the authenticated user's floating offer slots.
6. Returns the filtered list of users.

If successful, the function responds with a status code of 200 and a success message along with the filtered user data. If an error occurs during the process, it logs the error and responds with a status code of 500 along with an error message.
