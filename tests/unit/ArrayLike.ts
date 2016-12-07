import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
// Load like a CommonJS module
import factory = require('src/index');

let target: any;
let proxy: any;
let expected: any[];

function initialize(proxyTarget: any) {
	target = proxyTarget;
	proxy = factory(target);
	expected = arrayFrom(target);
}

function sequence(target: any, max: number) {
	for (let i = 0; i < max; i++) {
		target[i] = i;
	}
	assert.lengthOf(target, max);
	return target;
}

function arrayFrom(target: any) {
	if (typeof target === 'function') {
		return [];
	}
	return Array.from(target);
}

function createArrayParityTests() {
	return {
		'array type'() {
			assert.isArray(proxy);
		},

		initial() {
			assert.deepEqual(proxy, expected);
		},

		assignment: {
			basic() {
				const value = 'value';
				expected[0] = value;
				proxy[0] = value;

				assert.lengthOf(proxy, expected.length);
				assert.strictEqual(proxy[0], value);
				assert.deepEqual(proxy, expected);
			},

			'with holes'() {
				expected[2] = 'third';
				proxy[2] = 'third';

				assert.lengthOf(proxy, 3);
				assert.strictEqual(proxy[2], 'third');
				assert.deepEqual(proxy, expected);
			}
		},

		length: {
			'initialize empty array'() {
				expected.length = 3;
				proxy.length = 3;

				assert.lengthOf(proxy, 3);
				assert.deepEqual(proxy, expected);
			},

			'truncate an array'() {
				const expected = [ 0 ];
				sequence(proxy, 3);
				proxy.length = 1;
				assert.lengthOf(proxy, 1);
				assert.deepEqual(proxy, expected);
			}
		},

		splice: {
			'delete elements'() {
				const expected = [ 0 ];
				sequence(proxy, 3);
				proxy.splice(1);
				assert.lengthOf(proxy, 1);
				assert.deepEqual(proxy, expected);
			},

			'add elements to end'() {
				expected = sequence([], 5);
				sequence(proxy, 2);
				proxy.splice(proxy.length, 0, 2, 3, 4);
				assert.lengthOf(proxy, 5);
				assert.deepEqual(proxy, expected);
			},

			'add elements to beginning'() {
				expected = [3, 4, 5, 0, 1];
				sequence(proxy, 2);
				proxy.splice(0, 0, 3, 4, 5);
				assert.lengthOf(proxy, 5);
				assert.deepEqual(proxy, expected);
			},

			'delete and add elements'() {
				expected = [3, 4, 5, 1];
				sequence(proxy, 2);
				proxy.splice(0, 1, 3, 4, 5);
				assert.lengthOf(proxy, 4);
				assert.deepEqual(Array.from(proxy), expected);
			}
		},

		push() {
			const expected = sequence([], 4);
			sequence(proxy, 3);
			proxy.push(3);
			assert.lengthOf(proxy, 4);
			assert.deepEqual(proxy, expected);
		},

		concat() {
			sequence(proxy, 3);
			const actual = proxy.concat([3, 4, 5]);
			assert.deepEqual(actual, sequence([], 6));
		},

		from() {
			sequence(proxy, 3);
			const actual = Array.from(proxy);
			assert.deepEqual(actual, sequence([], 3));
		},

		fill: {
			'entire arraylike'() {
				proxy.length = 3;
				proxy.fill('value');
				assert.deepEqual(proxy, Array(3).fill('value'));
			},

			'with start offset'() {
				expected.length = 3;
				expected.fill('value', 1);
				proxy.length = 3;
				proxy.fill('value', 1);
				assert.deepEqual(proxy, expected);
			},

			'with end offset'() {
				expected.length = 3;
				expected.fill('value', 1, 2);
				proxy.length = 3;
				proxy.fill('value', 1, 2);
				assert.deepEqual(proxy, expected);
			}
		},

		iterator: {
			sequential() {
				sequence(proxy, 4);
				const expected = sequence([], 4);

				for (let v of proxy) {
					assert.equal(v, expected.shift());
				}
			},

			'with holes'() {
				expected[1] = 'value';
				expected.length = 3;
				proxy[1] = 'value';
				proxy.length = 3;

				let called = 0;
				for (let v of proxy) {
					assert.strictEqual(v, expected.shift());
					called++;
				}
				assert.equal(called, 3);
			}
		},

		spread() {
			sequence(proxy, 3);
			const actual = [... proxy, 3];
			assert.deepEqual(actual, sequence([], 4));
		}
	};
}

registerSuite({
	name: 'unit/ArrayLike',

	'function target': {
		beforeEach() {
			initialize(function (this: any, value: any) { this.value = value; });
		},

		'ArrayLike common tests': createArrayParityTests(),

		'can be instantiated'() {
			proxy[1] = 'first';
			proxy[2] = 'second';
			const obj = new proxy('value');

			assert.strictEqual(obj.value, 'value');
			assert.lengthOf(proxy, 3);
			assert.deepEqual(proxy, [, 'first', 'second']);
		}
	},

	'arrow function target': {
		beforeEach() {
			initialize((value: any) => { return `Hello ${ value }` });
		},

		'ArrayLike common tests': createArrayParityTests(),

		'retains functional usage'() {
			proxy[1] = 'first';
			proxy[2] = 'second';

			assert.equal(proxy('World'), 'Hello World');
			assert.lengthOf(proxy, 3);
			assert.deepEqual(proxy, [, 'first', 'second']);
		},

		isArray() {
			assert.isFalse(Array.isArray(proxy));
		}
	},

	'object target': {
		beforeEach() {
			initialize({});
		},

		'ArrayLike common tests': createArrayParityTests(),

		isArray() {
			assert.isFalse(Array.isArray(proxy));
		}
	},

	'array target': {
		beforeEach() {
			initialize([]);
		},

		'ArrayLike common tests': createArrayParityTests(),

		isArray() {
			assert.isTrue(Array.isArray(proxy));
		}
	},

	'arguments': {
		beforeEach() {
			(function (_one: string, _two: string) {
				initialize(arguments);
			})('one', 'two');
		},

		'ArrayLike common tests': createArrayParityTests(),
	}
});
