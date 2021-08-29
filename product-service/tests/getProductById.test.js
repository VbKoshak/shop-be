const { expect } = require('@jest/globals')
const { test } = require('jest-circus')
const { main } = require('./../handlers/getProductById')

describe('Unit testing product by id Existing product', () => {

    const eventExistingObj = {
        pathParameters: {
            productId: "7567ec4b-b10c-48c5-9345-fc73c48a80a0"
        }
    }

    it('Verify response is defined', () => {
        return main(eventExistingObj).then(data => {
            expect(data).toBeDefined;
        })
    })

    it('Verify status code', () => {
        return main(eventExistingObj).then(data => {
            expect(data.statusCode).toBe(200);
        })
    })

    it('Verify headers', () => {
        return main(eventExistingObj).then(data => {
            expect(data.headers).toStrictEqual({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            });
        })
    })

    it('Verify product id matches requested id', () => {
        return main(eventExistingObj).then(data => {
            expect(JSON.parse(data.body).id).toBe(eventExistingObj.pathParameters.productId)
        })
    })
});

describe('Unit testing product by id not existing product', () => {    
    const eventNotExistingObj = {
        pathParameters: {
            productId: "12345"
        }
    }

    it('Verify response is defined', () => {
        return main(eventNotExistingObj).then(data => {
            expect(data).toBeDefined;
        })
    })

    it('Verify status code', () => {
        return main(eventNotExistingObj).then(data => {
            expect(data.statusCode).toBe(404);
        })
    })

    it('Verify headers', () => {
        return main(eventNotExistingObj).then(data => {
            expect(data.headers).toStrictEqual({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            });
        })
    })

    it('Verify product id matches requested id', () => {
        return main(eventNotExistingObj).then(data => {
            expect(JSON.parse(data.body).message).toBe("Product not found")
        })
    })
});