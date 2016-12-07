import ArrayLike from 'src/ArrayLike';

interface Route {
	route: string,
	handler: Function
}

const addMiddleware = (route: string, handler: Function): any => {
	middleware.push({
		route,
		handler
	});
	return { middleware };
};
const middleware: Array<Route> & Function = ArrayLike(addMiddleware);
const handler = () => {};

// Now we have a functional list builder
middleware('/user/:id', handler)
	.middleware('/admin', handler)
	.middleware('/', handler);

(<any> console.log)(... middleware);
