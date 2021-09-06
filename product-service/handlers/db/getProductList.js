'use strict'

const { Client } = require('pg');
const { dbOptions } = require('./services/getDBOptions'); 

const query = "select p.id, p.title, p.description, p.price, s.count from products p left join  stocks s on p.id = s.product_id";

module.exports.main = async (event) => {
    console.log("Upcoming request: " + JSON.stringify(event));
    let client;
    try {
        client = new Client(dbOptions);
        await client.connect();
    } catch (ex) {
        console.error('Error appeared on connecting to db: ' + err);
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

    try {
        const productList = await client.query(query);
        
        return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(productList.rows),
          };
    } catch (err) {
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
    } finally {
        client.end();
    }
}