import ArrayLike from 'src/ArrayLike';

const array = {
	0: 'zero',
	1: 'one',
	length: 2
};

// X Cant do this!
// array.concat([1, 2, 3]);

// Now you can!
console.log(
	ArrayLike(array).concat([1, 2, 3])  // [ 'zero', 'one', 1, 2, 3]
);

// Or this!
ArrayLike(array).splice(array.length, 0, 1, 2, 3);
console.log(
	array
);
