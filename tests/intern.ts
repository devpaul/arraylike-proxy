export const proxyPort = 9000;

export const proxyUrl = 'http://localhost:9000';

export const maxConcurrency = 1;

export const loaderOptions = {
	packages: [
		{ name: 'src', location: './_build/src' },
		{ name: 'tests', location: './_build/tests' },
	]
};

export const loaders = {
	'host-browser': 'node_modules/dojo-loader/loader.js',
	'host-node': 'dojo-loader'
};

export const suites = [ 'tests/unit/ArrayLike' ];

export const functionalSuites: string[] = [];

export const excludeInstrumentation = /^(?:_build\/tests|node_modules)\//;
