var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync = require('browser-sync');
var del = require('del');

var babelify = require('babelify');
var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var source = require('vinyl-source-stream');

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

gulp.task('styles', () => {
  return gulp.src('assets/src/styles/main.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['last 1 version']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('assets/dist/styles'))
    .pipe(reload({stream: true}));
});

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format());
  };
}

gulp.task('lint', lint('assets/src/js/*.js'));

gulp.task('scripts', ['lint'], () => {
  return browserify('assets/src/js/app.js')
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('images', () => {
  return gulp.src('assets/src/images/**/*')
    .pipe($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .pipe(gulp.dest('assets/dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src('assets/src/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('assets/dist/fonts'));
});

gulp.task('minify', () => {
  return gulp.src('assets/dist/**/*')
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe(gulp.dest('assets/dist'));
});

gulp.task('clean', del.bind(null, ['assets/dist']));

gulp.task('serve', ['styles', 'fonts', 'images', 'scripts'], () => {

  browserSync({
    proxy: 'ocaduillustration.dev',
    notify: false,
    open: false,
    port: 9000
  });

  gulp.watch([
    '*.php',
    'assets/dist/js/**/*.js',
    'assets/dist/images/**/*'
  ]).on('change', reload);

  gulp.watch('assets/src/styles/**/*.scss', ['styles']);
  gulp.watch('assets/src/images/**/*', ['images']);
  gulp.watch('assets/src/js/**/*', ['scripts']);

});

gulp.task('build', ['styles', 'images', 'fonts', 'scripts'], () => {
  gulp.start('minify');
  return gulp.src('assets/dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('minify');
});