var fs = require('fs');
var connect = require('gulp-connect');
var gulp = require('gulp');
var KarmaServer = require('karma').Server;
var concat = require('gulp-concat');
var header = require('gulp-header');
var rename = require('gulp-rename');
var es = require('event-stream');
var del = require('del');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-htmlmin');
var minifyCSS = require('gulp-minify-css');
var templateCache = require('gulp-angular-templatecache');
var plumber = require('gulp-plumber');
var open = require('gulp-open');
var less = require('gulp-less');
var order = require("gulp-order");
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');

var config = {
  pkg : JSON.parse(fs.readFileSync('./package.json')),
  banner:
      '/*!\n' +
      ' * Name: <%= pkg.name %>\n' +
      ' * GIT Page: <%= pkg.homepage %>\n' +
      ' * Version: <%= pkg.version %> - <%= timestamp %>\n' +
      ' * License: <%= pkg.license %>\n' +
      ' */\n\n\n'
};

gulp.task('connect', function() {
  connect.server({
    root: '.',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src(['./demo/*.html', '.src/*.html'])
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./demo/**/*.html'], ['html']);
  gulp.watch(['./**/*.less'], ['styles']);
  gulp.watch(['./src/**/*.js','./demo/**/*.js', './**/*.html'], ['scripts']);
});

gulp.task('clean', function(cb) {
  del(['dist'], cb);
});

gulp.task('scripts', function() {
  function buildTemplates() {
    return gulp.src('src/**/*.html')
      .pipe(minifyHtml({
             empty: true,
             spare: true,
             quotes: true
            }))
      .pipe(templateCache({module: 'carousel3d'}));
  }

  function buildVendorsJS() {
    return gulp.src('node_modules/babel-polyfill/dist/polyfill.js');
  }

  function buildDistJS(){
    return gulp.src('src/*.js')
      .pipe(babel())
      .pipe(plumber({
        errorHandler: handleError
      }));
  }

  es.merge(buildVendorsJS(), buildDistJS(), buildTemplates())
    .pipe(plumber({
      errorHandler: handleError
    }))
    .pipe(order([
      'vendors.js',
      'carousel-3d.js',
      'template.js'
    ]))
    .pipe(concat('carousel-3d.js'))
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify({
      output: {
        comments: 'some'
      }
    }))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('styles', function() {
  return gulp.src('src/carousel-3d.less')
    .pipe(less())
    .pipe(header(config.banner, {
      timestamp: (new Date()).toISOString(), pkg: config.pkg
    }))
    .pipe(gulp.dest('dist'))
    .pipe(minifyCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('open', function(){
  gulp.src('./demo/demo.html')
  .pipe(open('', {url: 'http://localhost:8080/demo/demo.html'}));
});

gulp.task('eslint', function () {
  return gulp.src('src/**/*.js')
    .pipe(eslint({ 'useEslintrc': true }))
    .pipe(eslint.format());
});

gulp.task('karma', function (done) {
  var server = new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
  server.on('run_complete', function (_browsers, res) {
    done(res.exitCode ? 'There are failing unit tests' : null);
  });
  server.start();
});

gulp.task('karma-serve', function(done) {
  var server = new KarmaServer({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
  server.start();
});

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('build', ['clean', 'eslint', 'scripts', 'styles']);
gulp.task('serve', ['build', 'connect', 'watch', 'open']);
gulp.task('default', ['build', 'test']);
gulp.task('test', ['build', 'karma']);
gulp.task('serve-test', ['build', 'watch', 'karma-serve']);
