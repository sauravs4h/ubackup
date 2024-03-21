const { BlobServiceClient } = require('@azure/storage-blob');
const multer = require('multer');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
	process.env.BLOB_CONNECTION_STRING
);
const containerClient = blobServiceClient.getContainerClient(
	process.env.BLOB_CONTAINER_NAME
);

module.exports = containerClient;
