// Config file for running Rollup

import json from '@rollup/plugin-json';
import pkg from '../package.json';
import {createBanner} from './banner';

const release = process.env.NODE_ENV === 'release';
const watch = process.argv.indexOf('-w') > -1 || process.argv.indexOf('--watch') > -1;
// Skip the git branch+rev in the banner when doing a release build
const version = release ? pkg.version : 'github-build';
const banner = createBanner(version);

const outro = `var oldL = window.L;
exports.noConflict = function() {
	window.L = oldL;
	return this;
}
// Always export us to window global (see #2364)
window.L = exports;`;

/** @type {import('rollup').RollupOptions} */
const config = {
	input: 'src/Leaflet.js',
	output: [
		{
			file: pkg.main,
			format: 'umd',
			name: 'leaflet',
			banner,
			outro,
			sourcemap: true,
			freeze: false,
			esModule: false
		}
	],
	plugins: [
		json()
	]
};

if (!watch) {
	config.output.push(
		{
			file: 'dist/leaflet-src.esm.js',
			format: 'es',
			banner,
			sourcemap: true,
			freeze: false
		}
	);
}
export default config;
