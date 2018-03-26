let gulp = require('gulp');
let del = require('del');
let sourcemaps = require('gulp-sourcemaps');
let eslint = require('gulp-eslint');
let babel = require('gulp-babel');

const paths = {
  base: './src',
  build: './build',
  script: {
    src: './src',
    dest: './build'
  }
};

gulp.task('default', ['build']);

gulp.task('build', [ 'lint', 'scripts']);

gulp.task('serve', ['build'], function() {
  gulp.watch(paths.script.src + '/**/*.js', ['lint', 'scripts']);
});


gulp.task('clean', function() {
  del([paths.build]);
});

gulp.task('lint', function () {
  return gulp.src([paths.script.src + '/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('scripts', function() {
  return gulp.src(paths.script.src + '/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.build));
});