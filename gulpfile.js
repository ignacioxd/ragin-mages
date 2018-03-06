let gulp = require('gulp');
let uglify = require('gulp-uglify');
let del = require('del');
let sass = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let browserSync = require('browser-sync').create();
let sourcemaps = require('gulp-sourcemaps');
let eslint = require('gulp-eslint');
let browserify = require('browserify');
let babelify = require('babelify');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let path = require('path');

const paths = {
  phaser: './node_modules/phaser/dist/',
  base: './src',
  build: './build',
  assets: {
    src: './src/assets',
    dest: './build/assets'
  },
  styles: {
    src: './src/css',
    dest: './build/css'
  },
  script: {
    src: './src/js',
    dest: './build/js'
  },
  game: {
    entry: './src/js/Game.js',
    dest: 'game.js'
  }
};

gulp.task('default', ['serve']);

gulp.task('serve', ['build-dev'], function() {
  gulp.watch(paths.styles.src + '/**/*', ['styles']);
  gulp.watch(paths.script.src + '/**/*.js', ['lint', 'scripts']);
  gulp.watch(paths.base + '/index.html', ['copy-html']);

  gulp.watch(paths.build + '/**/*').on('change', browserSync.reload);

  browserSync.init({
    server: paths.build
  });
});

gulp.task('build', ['copy-static', 'styles', 'lint', 'dist']);

gulp.task('build-dev', ['copy-static', 'styles', 'lint', 'scripts']);

gulp.task('clean', function() {
  del([paths.build]);
});

gulp.task('copy-static', ['copy-html', 'copy-assets', 'copy-phaser']);

gulp.task('copy-html', function() {
  gulp.src([paths.base + '/index.html', ])
    .pipe(gulp.dest(paths.build));
});

gulp.task('copy-assets', function() {
  gulp.src(paths.assets.src + '/**/*')
    .pipe(gulp.dest(paths.assets.dest));
});

gulp.task('copy-phaser', function() {
  gulp.src(paths.phaser + '/phaser.min.js')
    .pipe(gulp.dest(paths.script.dest));
});

gulp.task('styles', function() {
  gulp.src(paths.styles.src + '/**/*.css')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
});

gulp.task('lint', function () {
  return gulp.src([paths.script.src + '/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('scripts', function() {
  return browserify(
    {
      paths: [path.join(__dirname, paths.script.src)],
      entries: paths.game.entry,
      debug: true
    })
    .transform(babelify, {
      babel: require('@babel/core'),
      sourceMaps: true
    })
    .bundle()
    .pipe(source(paths.game.dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./srcmaps'))
    .pipe(gulp.dest(paths.script.dest));
});

gulp.task('dist', function() {
  return browserify(
    {
      paths: [path.join(__dirname, paths.script.src)],
      entries: paths.game.entry,
      debug: true
    })
    .transform(babelify, {
      babel: require('@babel/core'),
      sourceMaps: true
    })
    .bundle()
    .pipe(source(paths.game.dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./srcmaps'))
    .pipe(gulp.dest(paths.script.dest));
});