var gulp = require('gulp');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var csslint = require('gulp-csslint');
var cssmin = require('gulp-clean-css');
var reporter = require('gulp-reporter');
var notify = require('gulp-notify');
var imagemin = require('gulp-imagemin');
var less = require('gulp-less');
var sourceMap = require('gulp-sourcemaps');

// js语法校验
gulp.task('jshintJS', function(){
	gulp.src('./static/*.js')
			.pipe(jshint())
			.pipe(reporter())
			.pipe(notify('js all fine'));
});

// js压缩
gulp.task('uglifyJS', function(){
	gulp.src('./static/*.js')
			.pipe(uglify())
			.pipe(gulp.dest('build'));
});

// css语法校验
gulp.task('csslintCSS', function(){
	gulp.src('./static/*.css')
			.pipe(csslint())
			.pipe(reporter())
			.pipe(notify('css all fine'));
});

// css压缩
gulp.task('cssminCSS', function(){
	gulp.src('./static/*.css')
			.pipe(cssmin())
			.pipe(gulp.dest('build'));
});

// img压缩
gulp.task('imageminIMG', function(){
	gulp.src('./static/img/*.*')
			.pipe(imagemin({
				progressive: true
			}))
			.pipe(gulp.dest('build/img'));
});

// 编译less并生成sourcemap文件
gulp.task('less', function(){
	gulp.src('./static/test-less.less')
			.pipe(sourceMap.init())
			.pipe(less())
			.pipe(sourceMap.write('../map', {addComment: true}))
			.pipe(gulp.dest('build'));
});


gulp.task('default', ['uglifyJS']);


