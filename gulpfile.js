'use strict';

const del = require('del');
const gulp = require('gulp');

const jsFiles = '/**/*.js';
const mapFiles = '/**/*.js.map';
const typingFiles = '/**/*.d.ts';

gulp.task('clean', function (done) {
	const dir = './source';
	return del([
		'index.js', 
		'index.js.map', 
		dir + jsFiles, 
		dir + mapFiles, 
		dir + typingFiles,
	], done);
});
