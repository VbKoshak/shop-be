'use strict'

const { Client } = require('pg');
const { dbOptions } = require('./services/getDBOptions');

module.exports.main = async (event) => {
    console.log("Upcoming request: " + JSON.stringify(event));
    let client
    try {
        client = new Client(dbOptions);
        await client.connect();
    } catch (err) {
        console.error('Error appeared on connecting to db: ' + err);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                "message": "Some error accured on server, try again later"
            }),
        };
    }

    try {
        const query = `select p.id, p.title, p.description, p.price, s.count from products p left join  stocks s on p.id = s.product_id where p.id='${event.pathParameters.productId}'`;
        let result = await client.query(query);
        
        if (result.rows.length == 0) {
            console.error("Error in request, product not found: ");
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
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(result.rows[0]),
        };
    } catch (err) {
        if ((err.toString()).indexOf("invalid input syntax for type uuid") != -1) {
            console.error("Error in request, uuid is incorrect: " + err);
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
            console.error('Error for db request: ' + err);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: "Some error accured on server, try again later"
                }),
            };
        }
    } finally {
        client.end();
    }
}