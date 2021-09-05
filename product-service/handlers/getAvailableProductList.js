'use strict';

const { getMockData } = require("./services/getMockData");

module.exports.main = async (event) => {
  let productList = await getMockData();

  return {
    statusCode: 200,
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(productList.filter(el => el.count > 0)),
  };
};
