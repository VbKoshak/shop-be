const AWS = require('aws-sdk');
const s3 = new AWS.S3({region:'us-east-2'})
const BUCKET = "aws-shop-import-service-bucket";

module.exports.main = async (event) => {
    console.log(`event ${JSON.stringify(event)}`)
    try {
        const catalogPath = `uploaded/${event.queryStringParameters.name}`;
    
        const params = {
            Bucket: BUCKET,
            Key: catalogPath,
            Expires: 60,
            ContentType: 'text/csv'
        };
    
        const signedUrl = await s3.getSignedUrlPromise('putObject', params)
        console.log(`Signed url: ${signedUrl}`)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(
                signedUrl
            ),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                "message": "Error happened while working on your request"
            }),
        };
    }
}