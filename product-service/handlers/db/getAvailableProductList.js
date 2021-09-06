'use strict'

const { Client } = require('pg');
const { dbOptions } = require('./services/getDBOptions'); 

const query = "select p.id, p.title, p.description, p.price, s.count from products p left join  stocks s on p.id = s.product_id where s.count > 0";

module.exports.main = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();

    try {
        const productList = await client.query(query)
        
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
    } finally {
        client.end();
    }
}
