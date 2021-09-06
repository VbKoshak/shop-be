'use strict'

const { Client } = require('pg');
const { dbOptions } = require('./services/getDBOptions');

const validateInt = (value) => {
    const regEx = /^([1-9]\d{0,2}|0)$/;
    if (regEx.exec(value) == null) {
        return false;
    } else {
        return parseInt(value);
    }
}

const validateDouble = (value) => {
    const regEx = /^([1-9]\d{0,2}|0)(\.([1-9]|[0-9][1-9]))?$/;
    if (regEx.exec(value) == null) {
        return false;
    } else {
        return Math.round(parseFloat(value) * 100) / 100;
    }
}

const validateString = (value) => {
    if (value != value.trim() || value.trim().length == 0) return false;
    else return value;
}

const isFalse = (value) => {
    return value === false;
}

module.exports.main = async (event) => {
    console.log("Upcoming request: " + JSON.stringify(event));
    let client;
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
        let { title, description, price, count } = JSON.parse(event.body);
        title = validateString(title);
        description = validateString(description);
        price = validateDouble(price);
        count = validateInt(count);

        if ( isFalse(title) || isFalse(description) || isFalse(price) || isFalse(count)) {
            console.error("Error in request data: " + JSON.stringify({
                title,
                description,
                price,
                count
            }));
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify({
                    message: "Error in request body!"
                }),
            };
        }

        let id;
        try {
            await client.query('BEGIN')
            const queryProducts = `insert into products (title, description, price) values('${title}', '${description}', ${price}) RETURNING *`;
            const productsRes = await client.query(queryProducts);
            id = productsRes.rows[0].id;
            const queryStocks = `insert into stocks (\"product_id\", \"count\") values('${id}', ${count})`;
            await client.query(queryStocks);
            await client.query('COMMIT');
        } catch (err) {
            await client.query('ROLLBACK');
            throw(err);
        }


        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({
                "message": "Item created successfully with id: " + id
            }),
        };
    } catch (err) {
        console.error('Error in db request: ' + err);
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
    } finally {
        client.end();
    }
}