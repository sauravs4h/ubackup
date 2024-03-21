const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();
const blobServiceClient = BlobServiceClient.fromConnectionString(
	process.env.BLOB_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
	process.env.BLOB_CONTAINER_NAME
);

module.exports = containerClient;
