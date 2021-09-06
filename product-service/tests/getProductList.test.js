const { expect } = require('@jest/globals')
const { test } = require('jest-circus')
const { main } = require('./../handlers/mock/getProductList')

describe('Unit testing products', () => {
    it('Verify response is defined', () => {
        return main().then(data => {
            expect(data).toBeDefined;
        })
    })

    it('Verify status code', () => {
        return main().then(data => {
            expect(data.statusCode).toBe(200);
        })
    })

    it('Verify headers', () => {
        return main().then(data => {
            expect(data.headers).toStrictEqual({
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            });
        })
    })

    it('Verify products length', () => {
        return main().then(data => {
            expect(JSON.parse(data.body).length).toBeGreaterThan(0);
        })
    })
});