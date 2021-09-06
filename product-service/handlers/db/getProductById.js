'use strict'

const {
    Client
} = require('pg');
const {
    dbOptions
} = require('./services/getDBOptions');

module.exports.main = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const query = `select p.id, p.title, p.description, p.price, s.count from products p left join  stocks s on p.id = s.product_id where p.id='${event.pathParameters.productId}'`;
        const result = await client.query(query);

        if (!result.rows) {
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
                body: JSON.stringify(result.rows[0]),
            };
        }
    } catch (err) {
        console.error('Error for db request: ' + err);
    } finally {
        client.end();
    }
}