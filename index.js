const AWS = require('aws-sdk');

const S3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        let objectContent = [];
        const bucketName = event.Records[0].s3.bucket.name;
        const name = event.Records[0].s3.object.key;
        const size = event.Records[0].s3.object.size;
        const type = event.Records[0].s3.object.key.split('.').pop();
        let image = {
            name,
            size,
            type
        }
        // Use the getObject method to retrieve the object's contents
        const params = {
            Bucket: bucketName,
            Key: 'image.json',
        };

        const data = await S3.getObject(params).promise();

        objectContent = JSON.parse(data.Body.toString('utf-8'))

        const existingImageIndex = objectContent.findIndex(item => item.name === image.name);

        if (existingImageIndex !== -1) {
            objectContent[existingImageIndex] = metadata;
        } else {

            objectContent.push(image)
        }

        await S3.putObject({ Bucket: bucketName, Key: 'image.json', Body: JSON.stringify(objectContent), ContentType: 'application/json' }).promise();

        return 'Added';

    } catch (error) {
        console.log('Error:', error);
        const response = {
            statusCode: 500,
            body: JSON.stringify('Error retrieving the object from S3.'),
        };
        return response;
    }
};
