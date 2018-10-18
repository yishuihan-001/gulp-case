// https://github.com/yishuihan-001/gulp-book/blob/master/chapter7.md
var gulp = require('gulp');
var gutil = require('gulp-util');									//工具方法
var uglify = require('gulp-uglify');							//压缩JS
var watchPath = require('gulp-watch-path');				//路径监听处理变动文件
var combiner = require('stream-combiner2');				//错误处理，避免程序中断
var sourcemaps = require('gulp-sourcemaps');			//资源对应查找
var minifycss = require('gulp-minify-css');				//压缩CSS
var autoprefixer = require('gulp-autoprefixer');	//CSS自动添加前缀
var less = require('gulp-less');									//LESS编译
var imagemin = require('gulp-imagemin');					//图片压缩

// 错误日志
var handleError = function (err) {
	var colors = gutil.colors;
	console.log('\n');
	gutil.log(colors.red('Error!'));
	gutil.log('fileName: ' + colors.red(err.fileName));
	gutil.log('lineNumber: ' + colors.red(err.lineNumber));
	gutil.log('message: ' + err.message);
	gutil.log('plugin: ' + colors.yellow(err.plugin));
}

// 压缩js
gulp.task('uglifyjs', function () {
	// gulp.src('src/js/**/*.js')
	// 		.pipe(sourcemaps.init())
	// 		.pipe(uglify())
	// 		.pipe(sourcemaps.write('./'))
	// 		.pipe(gulp.dest('dist/js'));
	var combined = combiner.obj([
			gulp.src('src/js/**/*.js'),
			sourcemaps.init(),
			uglify(),
			sourcemaps.write('./'),
			gulp.dest('dist/js/')
	]);
	combined.on('error', handleError);
});

// 监听js改变并自动编译
gulp.task('watchjs', function(){
	gulp.watch('src/js/**/*.js', function(event){
		var paths = watchPath(event, 'src/', 'dist/');
		/*
			paths:{
				srcPath: 'src/js/log.js',
				srcDir: 'src/js/',
				distPath: 'dist/js/log.js',
				distDir: 'dist/js/',
				srcFilename: 'log.js',
				distFilename: 'log.js'
			}
		*/
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		/*
		gulp.src(paths.srcPath)
				.pipe(uglify())
				.pipe(gulp.dest(paths.distDir));
		*/
		var combined = combiner.obj([
				gulp.src(paths.srcPath), //gulp.src('src/js/**/*.js'),一次性编译所有js文件
				sourcemaps.init(),
				uglify(),
				sourcemaps.write('./'),
				gulp.dest(paths.distDir)
		]);
		combined.on('error', handleError);
	})
});

// 压缩css
gulp.task('minifycss', function(){
	gulp.src('src/css/**/*.css')
			.pipe(sourcemaps.init())
			.pipe(autoprefixer({
				browsers: 'last 2 versions'
			}))
			.pipe(minifycss())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('dist/css/'));
});

// 监听css改变并自动编译
gulp.task('watchcss', function(){
	gulp.watch('src/css/**.css', function(event){
		var paths = watchPath(event, 'src/', 'dist/');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		var combined = combiner.obj([
			gulp.src(paths.srcPath),
			sourcemaps.init(),
			autoprefixer({browsers: 'last 2 versions'}),
			minifycss(),
			sourcemaps.write('./'),
			gulp.dest(paths.distDir)
		]);
		combined.on('error', handleError);
	});
});

// 压缩less
gulp.task('lesscss', function(){
	var combined = combiner.obj([
		gulp.src('src/less/**/*.less'),
		sourcemaps.init(),
		autoprefixer({
			browsers: 'last 2 versions'
		}),
		less(),
		minifycss(),
		sourcemaps.write('./'),
		gulp.dest('dist/css')
	]);
	combined.on('error', handleError);
});

// 监听less改变并自动编译
gulp.task('watchless', function(){
	gulp.watch('src/less/**/*.less', function(event){
		var paths = watchPath(event, 'src/less', 'dist/css');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		var combined = combiner.obj([
			gulp.src(paths.srcPath),
			sourcemaps.init(),
			autoprefixer({browsers: 'last 2 versions'}),
			less(),
			minifycss(),
			sourcemaps.write('./'),
			gulp.dest(paths.distDir)
		]);
		combined.on('error', handleError);
	});
});

// sass配置略

// 图片压缩
gulp.task('image', function(){
	gulp.src('src/images/**/*')
			.pipe(imagemin({
				progressive: true
			}))
			.pipe(gulp.dest('dist/images'));
});

// 监听image改变并自动编译
gulp.task('watchimage', function(){
	gulp.watch('src/iamges/**/*', function(event){
		var paths = watchPath(event, 'src/', 'dist/');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		gulp.src(paths.srcPath)
				.pipe(imagemin({
					progressive: true
				}))
				.pipe(gulp.dest(paths.distDir));
	});
});

// 文件复制
gulp.task('copy', function(){
	gulp.src('src/fonts/**/*')
			.pipe(gulp.dest('dist/fonts'));
});

// 监听文件改变并自动复制
gulp.task('watchcopy', function(){
	gulp.watch('src/fonts/**/*', function(event){
		var paths = watchPath(event, 'src/', 'dist/');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath);
		gutil.log('Dist ' + paths.distPath);
		gulp.src(paths.srcPath)
				.pipe(gulp.dest(paths.distDir));
	});
});


gulp.task('default', [
	// build
	'uglifyjs', 'minifycss', 'lesscss', 'image', 'copy',
	// watch
	'watchjs', 'watchcss', 'watchless', 'watchimage', 'watchcopy'
	]
)


// 配置控制台输出颜色
// gulp.task('default', function(){
// 	gutil.log('Nomal Msg');
// 	gutil.log(gutil.colors.red('Error Msg : ') + 'some wrong');
// 	gutil.log(gutil.colors.green('Success Msg : ') + 'finish')
// });

