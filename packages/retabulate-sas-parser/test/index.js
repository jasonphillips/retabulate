const should = require('should');
const expect = require('chai').expect;
const parser = require('../');

const fs = require('fs');
const path = require('path');

const tests = {
    basic: fs.readFileSync(path.join(__dirname, 'input/basic.txt')),
    basicResult: require('./output/basic.json'),
    complex: fs.readFileSync(path.join(__dirname, 'input/complex.txt')),
    complexResult: require('./output/complex.json'),
    broken: fs.readFileSync(path.join(__dirname, 'input/broken.txt')),
};

describe('sas-retabulate grammar', () => {

    it('should import with a parse() function', () => {
        expect(parser).to.respondTo('parse');
    });

    it('should handle a basic TABULATE with VAR, CLASS, and TABLE', () => {
        const result = parser.parse(tests.basic.toString());
        expect(result).to.be.an.object;
        expect(result).to.deep.equal(tests.basicResult);
    });

    it('should handle a complex TABULATE with formats, titles', () => {
        const result = parser.parse(tests.complex.toString());
        expect(result).to.be.an.object;
        expect(result).to.deep.equal(tests.complexResult);
    });

    it('throws errors with invalid syntax', () => {
        try {
            const result = parser.parse(tests.broken.toString());
            expect(result).to.be.empty;
        } catch (e) {
            expect(e.message).to.exist;
        }
    });

})