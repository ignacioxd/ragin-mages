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
let rename = require('gulp-rename');
let jsonModify = require('gulp-json-modify');

/******* NOTE: When testing using SocketIO to your local server set the variables below to the SocketIO server
        That you wish to communicate with
        This setting will be used when you do "yarn start" for socket communication
        If you do a yarn build it will use the production server raginmages.com
*/
let  testProtocol= 'http';
let testHost = 'localhost';
let testIOPort = 3030;

/************End test server configuation settings ******************/

const paths = {
  phaser: './node_modules/phaser/dist/',
  socket: './node_modules/socket.io-client/dist/',
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
  },
  serviceWorker: {
    entry: './src/js/sw.js',
    dest: 'sw.js'
  },
  config: {
    entry:'../config/config.json',
    dest:'config.json'
  }
};

gulp.task('default', ['serve']);

gulp.task('serve', ['build-dev'], function() {
  gulp.watch(paths.styles.src + '/**/*', ['styles']);
  gulp.watch(paths.assets.src + '/**/*', ['copy-assets']);
  gulp.watch(paths.script.src + '/**/*.js', ['lint', 'scripts']);
  gulp.watch(paths.config.entry, ['config-dev']);
  gulp.watch(paths.base + '/index.html', ['copy-html']);
  gulp.watch(paths.build + '/**/*').on('change', browserSync.reload);

  browserSync.init({
    server: paths.build
  });
});

gulp.task('build', ['copy-static', 'styles', 'lint', 'sw-dist', 'scripts-dist','config-dist']);

gulp.task('build-dev', ['copy-static', 'styles', 'lint', 'sw', 'scripts','config-dev']);

gulp.task('clean', function() {
  del([paths.build]);
});

gulp.task('copy-static', ['copy-html', 'copy-assets', 'copy-phaser', 'copy-socket']);

gulp.task('copy-html', function() {
  gulp.src([paths.base + '/index.html', paths.base + '/manifest.json'])
    .pipe(gulp.dest(paths.build));
});

gulp.task('config-dev', function() {
  gulp.src(paths.config.entry)
    .pipe(jsonModify({ key: 'protocol', value: testProtocol }))
    .pipe(jsonModify({ key: 'host', value: testHost }))
    .pipe(jsonModify({ key: 'ioport', value: testIOPort }))
    .pipe(gulp.dest(paths.build));
});

gulp.task('config-dist', function() {
  gulp.src(paths.config.entry)
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

gulp.task('copy-socket', function() {
  gulp.src(paths.socket + '/socket.io.js')
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
    .pipe(eslint.format());
});

gulp.task('sw', function () {
  return devScript(paths.base, paths.serviceWorker, paths.build);
});

gulp.task('scripts', function() {
  return devScript(paths.script.src, paths.game, paths.script.dest);
});
gulp.task('config', function() {
  return devScript(paths.config.src, paths.game, paths.config.dest);
});

gulp.task('sw-dist', function () {
  return distScript(paths.base, paths.serviceWorker, paths.build);
});

gulp.task('scripts-dist', function() {
  return distScript(paths.script.src, paths.game, paths.script.dest);
});

function devScript(basePath, scriptPath, destPath) {
  return browserify(
    {
      paths: [path.join(__dirname, basePath)],
      entries: scriptPath.entry,
      debug: true
    })
    .transform(babelify, {
      babel: require('@babel/core'),
      sourceMaps: true
    })
    .bundle()
    .pipe(source(scriptPath.dest))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./srcmaps'))
    .pipe(gulp.dest(destPath));
}

function distScript(basePath, scriptPath, destPath) {
  return browserify(
    {
      paths: [path.join(__dirname, basePath)],
      entries: scriptPath.entry,
      debug: false
    })
    .transform(babelify, {
      babel: require('@babel/core'),
    })
    .bundle()
    .pipe(source(scriptPath.dest))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(destPath));
}