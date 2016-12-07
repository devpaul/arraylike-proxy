# ArrayLike Proxy

Treat everything like an array! ArrayLike Proxy wraps a function, arrow function, object, arguments, or an array
 and allows you to treat it just like an array.

## Uses

### Objects

Have an ArrayLike Object and you want to use it like an array? Too bad! You have to convert it first:

```
import ArrayLike from 'src/ArrayLike';

const array = {
    0: 'zero',
    1: 'one',
    length: 2
}

// X Cant do this!
// array.concat([1, 2, 3]);

// Now you can!
ArrayLike(array).concat([1, 2, 3])  // [ 'zero', 'one', 1, 2, 3]

// Or this!
ArrayLike(array).splice(array.length, 0, 1, 2, 3);
array.length; // 5
```

### Functions

Want a method to maintain its own list?

```
import ArrayLike from 'src/ArrayLike';

const addMiddleware = (route, handler) => {
	middleware.push({
		route,
		handler
	});
	return middleware;
};
const middleware = ArrayLike(addMiddleware);

// Now we have a functional list builder
middleware('/user/:id', () => {}).middleware('/admin', () => {}).middleware('/', () => {});
```

Or maybe we want to collect and build

```
import ArrayLike from 'src/ArrayLike';

const builder = function (name) {
	this.name = name;
	this.assignments = [... StudentAssignments]
}
const StudentAssignments = ArrayLike(builder);
StudentAssignments.push('Take home Test A');
StudentAssignments.push('Homework 1');
StudentAssignments.push('Quiz I');
const studentRecords = [
	new StudentAssignments('Joe Smith');
	new StudentAssignments('Jane Doe');
];
```

Ok. Maybe that last example is a solution looking for a problem....

### Arguments

How about an anarchronistic example. Nobody should be using `arguments` anymore!

```
import ArrayLike from 'src/ArrayLike';

function methodOne(one, two) {
	if (typeof two === 'number') {
		throw new Error();
	}
	
	// So fancy!
	return methodTwo(ArrayLike(arguments).reverse());
}

function methodTwo(two, one) {
	if (typeof two === 'number') {
		throw new Error();
	}
	
	return `${ two } is number: ${ one }`;
}

methodOne(1, 'I');  // I did it!
```

## Fin

Wow! You made it! Well I guess you deserve a story. I made this library because JavaScript, for all its flexibility,
	didn't have a good way of creating a method that could also behave like an array. Sure, we have this concept
	of arraylike objects, but those tend to break down when you want to use direct assignments or, you know, actually
	use the thing like an array. Plus I get to do terrible things with Proxy and Symbol. Win-win!