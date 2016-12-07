import ArrayLike from 'src/ArrayLike';

function methodOne(_one: number, two: any) {
	if (typeof two === 'number') {
		throw new Error();
	}

	// So fancy!
	return (<any> methodTwo)(... ArrayLike(arguments).reverse());
}

function methodTwo(two: any, one: number) {
	if (typeof two === 'number') {
		throw new Error();
	}

	return `${ two } is number: ${ one }`;
}

console.log(
	methodOne(1, 'I')  // I did it!
);
