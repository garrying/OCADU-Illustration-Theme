/*global -$ */

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('styles', function() {
  return gulp.src('assets/src/styles/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      outputStyle: 'nested', // libsass doesn't support expanded yet
      precision: 10,
      includePaths: ['.'],
      onError: console.error.bind(console, 'Sass error:')
    }))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('assets/dist/styles'))
    .pipe(reload({stream: true}));
});

gulp.task('jshint', function() {
  return gulp.src('assets/src/js/*.js')
    .pipe(reload({stream: true, once: true}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('bower', function() {
  var mainBowerFiles = require('main-bower-files');
  return gulp.src(mainBowerFiles())
    .pipe($.concat('libs.js'))
    .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('scripts', ['jshint', 'bower'], function() {
  return gulp.src('assets/src/js/*.js')
    .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('images', function() {
  return gulp.src('assets/src/images/**/*')
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('assets/dist/images'));
});

gulp.task('fonts', function() {
  return gulp.src('assets/src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('assets/dist/fonts'));
});

gulp.task('minify', function() {
  return gulp.src('assets/dist/**/*')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(gulp.dest('assets/dist'));
});

gulp.task('clean', require('del').bind(null, ['assets/dist']));

gulp.task('serve', ['styles', 'fonts', 'images', 'scripts'], function() {

  browserSync.init({
    proxy: 'ocaduillustration.dev'
  });

  gulp.watch([
    'assets/dist/js/**/*.js',
    'assets/dist/images/**/*',
  ]).on('change', reload);

  gulp.watch('assets/src/styles/**/*.scss', ['styles']);
  gulp.watch('assets/src/images/**/*', ['images']);
  gulp.watch('assets/src/js/**/*', ['scripts']);

});

gulp.task('build', ['styles', 'images', 'fonts', 'scripts'], function() {
  gulp.start('minify');
  return gulp.src('assets/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], function() {
  gulp.start('minify');
});