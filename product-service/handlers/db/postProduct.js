'use strict'

const { Client } = require('pg');
const { SourceMapDevToolPlugin } = require('webpack');
const { dbOptions } = require('./services/getDBOptions');

module.exports.main = async (event) => {
    const client = new Client(dbOptions);
    await client.connect();

    console.log("Request event: " + JSON.stringify(event));

    let  { title, description, price, count } = JSON.parse(event.body);
    price = price - 0;
    count = count - 0;

    const queryProducts = `insert into products (title, description, price) values('${title}', '${description}', ${price}) RETURNING *`;
    const queryStocks = `insert into stocks (product_id, \"count\") values((select id from products p where p.title = '${title}'), ${count}) RETURNING *`

    if (!(title && description && price && count)) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify("Error in request body!"),
        };
    }

    try {
        const productsRes = await client.query(queryProducts);
        const id = productsRes.rows[0].id;
        await client.query(queryStocks)
        

        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({"message": "Item created successfully with id: " + id}),
        };
    } catch (err) {
        console.error('Error for db request: ' + err);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({"message": "Some error accured on server"}),
        };

    } finally {
        client.end();
    }
}