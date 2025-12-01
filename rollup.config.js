import typescript from 'rollup-plugin-typescript2';

export default {
	input: 'index.js',
	format: 'umd',
	name: 'mapv',
	external: [
		'maptalks',
		'openlayers',
		'leaflet'
	],
  globals: {
    openlayers: 'ol',
    leaflet: 'L',
    maptalks: 'maptalks'
  },
	plugins: [
		typescript({
			tsconfig: './tsconfig.json',
			useTsconfigDeclarationDir: true
		})
	],
	output: {
		file: 'build/mapv.js',
		format: 'umd',
		name: 'mapv'
	}
}