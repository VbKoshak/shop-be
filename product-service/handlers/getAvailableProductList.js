'use strict';
let productList = require("./productList.json");

module.exports.main = async (event) => {
  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(productList.filter(el => el.count > 0)),
  };
};
