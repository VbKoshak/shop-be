'use strict';
let productList = require("./productList.json");

module.exports.main = async (event) => {

    let productId = event.pathParameters.productId;
    let result = productList.find(el =>  {
        return el.id == productId;
    });


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
            body: JSON.stringify(result),
          };
    }
};
