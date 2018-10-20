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
var del = require('del');													//清空文件夹
var connect = require('gulp-connect');						//在本地开启一个websocket服务，使用liveReload实现实时更新，推荐使用html-watchhtml-connect写法
var htmlmin = require('gulp-htmlmin');						//可以压缩页面javascript、css，去除页面空格、注释，删除多余属性等操作
var rev = require('gulp-rev-append');							//使用gulp-rev-append给页面的引用添加版本号，清除页面引用缓存
var watch = require('gulp-watch');								//监听文件的变化，配合connect实现服务自动刷新
var plumber = require('gulp-plumber');						//实时更新错误不会导致终端gulp运行开启的服务断开
var rename = require('gulp-rename');							//重命名

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

// 清空文件夹
gulp.task('clean', del.bind(null, ['dist/*']));

// gulp.task('default', [
// 	// build
// 	'uglifyjs', 'minifycss', 'lesscss', 'image', 'copy',
// 	// watch
// 	'watchjs', 'watchcss', 'watchless', 'watchimage', 'watchcopy'
// 	]
// )

// 配置控制台输出颜色
// gulp.task('default', function(){
// 	gutil.log('Nomal Msg');
// 	gutil.log(gutil.colors.red('Error Msg : ') + 'some wrong');
// 	gutil.log(gutil.colors.green('Success Msg : ') + 'finish')
// });





	// //实时刷新1
	// //本地服务
	// gulp.task('connect', function(){
	// 	connect.server({
	// 		livereload: true
	// 	});
	// });
	// // 要自动更新的html文件
	// gulp.task('html', function(){
	// 	gulp.src('src/html/**/*.html')
	// 			.pipe(connect.reload());
	// });
	// // 监听html文件改变
	// gulp.task('watchhtml', function(){
	// 	gulp.watch('src/html/**/*.html', ['html']);
	// });
	// gulp.task('default', ['html', 'watchhtml', 'connect']);





	// // 实时刷新2
	// // 压缩html，去除页面空格、注释，删除多余属性等
	// gulp.task('buildHtmlmin', function () {
	// 	var options = {
	// 		removeComments: true,//清除HTML注释
	// 		collapseWhitespace: true,//压缩HTML
	// 		collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
	// 		removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
	// 		removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
	// 		removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
	// 		minifyJS: true,//压缩页面JS
	// 		minifyCSS: true//压缩页面CSS
	// 	};
	// 	gulp.src('src/html/**/*.html')
	// 			.pipe(htmlmin(options))
	// 			.pipe(rename({
	// 				suffix: '-min'
	// 			}))
	// 			.pipe(gulp.dest('dist/html'));
	// })
	// // 添加版本号
	// gulp.task('buildRev', function(){
	// 	gulp.src('src/html/**/index.html')
	// 			.pipe(rev())
	// 			.pipe(gulp.dest('dist/html'))
	// });
	// // 本地服务
	// gulp.task('connect', function(){
	// 	connect.server({
	// 		livereload: true,
	// 		port: 8888
	// 	});
	// });
	// // 要自动更新的html文件
	// gulp.task('html', function(){
	// 	gulp.src('src/html/**/*.html')
	// 			.pipe(rev())
	// 			.pipe(gulp.dest('dist/html'))
	// 			.pipe(connect.reload());
	// });
	// // 监听html文件改变
	// gulp.task('watchhtml', function(){
	// 	gulp.watch('src/html/**/*.html', ['html']);
	// });
	// gulp.task('default', ['html', 'watchhtml', 'connect']);