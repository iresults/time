/**
 * Created by cod on 7.2.17.
 */
module.exports = class TestCase {
    assertSame(expected, actual) {
        if (expected !== actual) {
            throw new Error(`Value ${actual} does not match expected ${expected}`);
        }
    }

    printSuccess(message) {
        console.log('\u001B[0;32m' + message + '\u001B[0m');
    }

    printError(message) {
        console.log('\u001B[0;31m' + message + '\u001B[0m');
    }

    runTests() {
        const properties = Object.getOwnPropertyNames(this.constructor.prototype);

        const testMethods = properties.filter((prop) => {
            return prop.endsWith('Test') || prop.endsWith('TestShouldFail')
        }).filter((prop) => {
            return typeof this[prop] === 'function'
        });

        testMethods.forEach((prop) => {
            let error;
            let success;
            try {
                this[prop]();
                success = true;
            } catch (e) {
                error = e;
                success = false;
            }

            if (prop.endsWith('TestShouldFail')) {
                success = !success;
                if (!success) {
                    error = new Error('Test should have failed');
                }
            }

            if (success) {
                this.printSuccess(`[PASSED] Run ${prop}()`);
            } else {
                this.printError(`[FAILED] Run ${prop}(): ${error}`);
            }
        });
    }
};
