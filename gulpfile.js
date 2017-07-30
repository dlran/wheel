var gulp = require('gulp'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	clean = require('gulp-clean'),
	pkg = require('./package.json');

var banner = ['/*!',
	' * <%= pkg.name %> v<%= pkg.version %> (<%= pkg.homepage %>)',
	' * Developed by <%= pkg.author %> in June 2017',
	' */',
	''].join('\n');


gulp.task('css',function (){
	return	gulp.src('./src/sass/*.scss')
			.pipe(sass({outputStyle:'expanded'}).on('error', sass.logError))
			.pipe(autoprefixer({browsers: ['Chrome >=20','Firefox >= 20','ie >= 9']}))
			.pipe(header(banner,{pkg:pkg}))
			.pipe(gulp.dest('./dist/css'))
})

gulp.task('js',function (){
	return gulp.src('./src/js/jquery-wheel-*.js')
		.pipe(header(banner,{pkg:pkg}))
		.pipe(gulp.dest('./dist/js'))
		.pipe(uglify({output:{comments:"/^!/"}}).on('error',function (e){
			console.error(e);
		}))
		.pipe(rename(function (path){
			path.basename += '.min';
		}))
		.pipe(gulp.dest('./dist/js'))
})

gulp.task('assets',function(){
	return gulp.src('./src/js/jquery-1.11.3.min.js')
				.pipe(gulp.dest('./dist/js'))
})

gulp.task('reset',function (){
	gulp.src('./dist/*',{read: false})
		.pipe(clean());
})

gulp.task('release',function (){
	return gulp.start('assets','js','css')
})

gulp.task('prod',['release'])

gulp.task('default',['release'],function(){
	gulp.watch('src/sass/**/*',['css']);
	gulp.watch('src/js/jquery-wheel-*.js',['js']);
})