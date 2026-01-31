/**
 * AWS S3 Storage Configuration
 * Real file upload implementation
 */

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const crypto = require('crypto');

// Validate S3 configuration
if (!process.env.S3_BUCKET || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    console.warn('⚠️  S3 configuration missing - file uploads will use local storage');
}

// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
});

// Allowed file types
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain',
    'text/csv',
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// File filter
const fileFilter = (req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`File type ${file.mimetype} not allowed`), false);
    }
};

// S3 Upload Configuration
const s3Upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET,
        acl: 'private',
        metadata: (req, file, cb) => {
            cb(null, {
                fieldName: file.fieldname,
                uploadedBy: req.user?.id || 'anonymous',
                uploadDate: new Date().toISOString(),
            });
        },
        key: (req, file, cb) => {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            const filename = `${Date.now()}-${uniqueId}${ext}`;
            cb(null, `documents/${filename}`);
        },
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});

// Local storage fallback (for development)
const localStorage = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/');
        },
        filename: (req, file, cb) => {
            const uniqueId = crypto.randomBytes(16).toString('hex');
            const ext = path.extname(file.originalname);
            cb(null, `${Date.now()}-${uniqueId}${ext}`);
        },
    }),
    fileFilter: fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
    },
});

// Choose storage based on configuration
const upload = process.env.S3_BUCKET ? s3Upload : localStorage;

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
    try {
        if (!process.env.S3_BUCKET) {
            console.log('S3 not configured - skipping delete');
            return;
        }

        const key = fileUrl.split('.com/')[1];
        await s3.deleteObject({
            Bucket: process.env.S3_BUCKET,
            Key: key,
        }).promise();
        
        console.log(`Deleted file from S3: ${key}`);
    } catch (error) {
        console.error('Error deleting from S3:', error);
        throw error;
    }
};

// Get signed URL for private file access
const getSignedUrl = async (fileKey, expiresIn = 3600) => {
    try {
        const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: process.env.S3_BUCKET,
            Key: fileKey,
            Expires: expiresIn,
        });
        return url;
    } catch (error) {
        console.error('Error generating signed URL:', error);
        throw error;
    }
};

module.exports = {
    upload,
    s3,
    deleteFromS3,
    getSignedUrl,
    ALLOWED_MIME_TYPES,
    MAX_FILE_SIZE,
};
