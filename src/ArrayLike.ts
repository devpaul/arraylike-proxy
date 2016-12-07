export default function factory<T>(target: T, initialValues?: Iterable<any>): T & Array<any> {
	const proxy = new Proxy(target, traps());
	if (initialValues) {
		proxy.concat(initialValues);
	}
	return proxy;
}

export const targetLengthSymbol = Symbol();

export const targetSymbol = Symbol();

export function traps() {
	let length: number = null;
	let transientLength: number = null;

	function getLength(target: any): number {
		if (length != null) {
			return length;
		}

		if (typeof target !== 'function') {
			length = target.length || 0;
		}
		else {
			length = 0;
		}
		return length;
	}

	function setLength(target: any, newLength: number) {
		if (!Number.isInteger(newLength)) {
			throw new Error('Invalid array length');
		}
		const current = transientLength == null ? getLength(target) : transientLength;
		if (current > newLength) {
			// splice likes to be super helpful and update our length for us creating an infinite loop w/o this
			transientLength = newLength;
			target.splice(newLength, Number.POSITIVE_INFINITY);
			length = transientLength;
			transientLength = null;
		}
		else {
			length = newLength;
		}
	}

	function createIterator(target: any) {
		return function* () {
			for (let i = 0; i < length; i++) {
				yield target[i];
			}
		};
	}

	return {
		getPrototypeOf() {
			return Array.prototype;
		},

		get(target: any, property: PropertyKey, receiver: any): any {
			switch (property) {
				case 'prototype':
					return undefined;
				case 'length':
					return getLength(target);
				case targetLengthSymbol:
					return target.length;
				case targetSymbol:
					return target;
				case Symbol.iterator:
					return createIterator(target);
				case Symbol.toStringTag:
					return 'Array';
				case Symbol.isConcatSpreadable:
					return true;
				case 'toString':
					return Object.prototype.toString.bind(receiver);
			}

			if (property in target) {
				return target[property];
			}
			else {
				const method = (<any> Array.prototype)[property];
				if (method) {
					return method.bind(receiver);
				}
			}
		},

		has(target: any, property: PropertyKey) {
			return (property in target || property === 'length');
		},

		set(this: any, target: any, property: PropertyKey, value: any, receiver: any): boolean {
			const index = Number(property);
			if (Number.isInteger(index)) {
				setLength(receiver, Math.max(getLength(target), index + 1));
			}
			else if (property === 'length') {
				setLength(receiver, Number(value));
				return true;
			}
			else if (property === targetSymbol || property === targetLengthSymbol) {
				return false;
			}

			target[property] = value;

			return true;
		}
	};
}
