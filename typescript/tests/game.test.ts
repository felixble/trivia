import {expect} from 'chai';
import {describe, it, xit} from 'mocha';
import {GameRunner} from '../src/game-runner';
import * as fs from 'fs';

describe('The test environment', () => {
    it('should pass', () => {
        expect(true).to.be.true;
    });

    it("should access game", function () {
        expect(GameRunner).to.not.be.undefined;
    });

});

const captureGame = (seed: number) => {
    const tmpRandom = Math.random;
    Math.random = function() {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
    };
    const tmpLog = console.log;
    let buffer = '';
    console.log = function ($line) {
        buffer += $line;
    };

    GameRunner.main();

    Math.random = tmpRandom;
    console.log = tmpLog;

    return buffer;
};

describe("Safety net", function () {
    xit('can be created', () => {
        for(let seed = 0; seed < 400; seed++) {
            const output = captureGame(seed);

            if (!fs.existsSync("./tests/out")) {
                fs.mkdirSync("./tests/out");
            }
            fs.writeFileSync("./tests/out/test_" + seed + ".log", output);
        }
    });

    it('can be used', function () {
        for(let seed = 0; seed < 400; seed++) {
            const output = captureGame(seed);

            const expectedOutput = fs.readFileSync("./tests/out/test_" + seed + ".log", "utf8");

            expect(output).to.be.equal(expectedOutput);
        }
    });
});
