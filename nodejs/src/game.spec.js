const Should = require('should');
const Game = require('./game.js');
const fs = require('fs');

describe("The test environment", function () {
  it("should pass", function () {
    (true).should.equal(true);
  });

  it("should access game", function () {
    Should(Game).not.equal(undefined);
  });
});

describe("Your specs...", function () {
  // it ...
});

function captureGame(seed) {
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

    delete require.cache[require.resolve('./game.js')];
    require('./game.js');

    Math.random = tmpRandom;
    console.log = tmpLog;

    return buffer;
}

describe("Safety net", function () {
    xit('can be created', () => {
        for(let seed = 0; seed < 400; seed++) {
            const output = captureGame(seed);

            if (!fs.existsSync("./out")) {
                fs.mkdirSync("./out");
            }
            fs.writeFileSync("./out/test_" + seed + ".log", output);
        }
    });

    it('can be used', function () {
        for(let seed = 0; seed < 400; seed++) {
            const output = captureGame(seed);

            const expectedOutput = fs.readFileSync("./out/test_" + seed + ".log", "utf8");

            (output).should.equal(expectedOutput);
        }
    });
});
