const { expect, it } = require('@jest/globals')
const { test } = require('jest-circus')
const { main } = require('./../handlers/mock/getAvailableProductList')

describe('Unit testing available products', () => {
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

    it('Verify there is no offers with count 0', () => {
        return main().then(data => {
            expect(JSON.parse(data.body).filter(el => el.count == 0).length).toBe(0);
        })
    })
});