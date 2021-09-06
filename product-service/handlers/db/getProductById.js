'use strict'

const {
    Client
} = require('pg');
const {
    dbOptions
} = require('./services/getDBOptions');

const query = "select p.id, p.title, p.description, p.price, s.count from products p left join  stocks s on p.id = s.product_id where p.id='$1'";

module.exports.main = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const productList = await client.query(query, [event.pathParameters.productId]).rows;

        if (!result) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: "Product not found"
                }),
            }
        } else {
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(productList),
            };
        }
    } catch (err) {
        console.error('Error for db request: ' + err);
    } finally {
        client.end();
    }
}