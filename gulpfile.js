/* jshint node:true */
'use strict';
var src = {
  less: 'app/less/*.less',
  css: 'app/css/**/*.css',
  js: 'app/js/*.js',
  fonts: 'app/fonts/**/*',
  html: 'app/*.html',

  images: 'app/img/**/*',
  content: 'app/content/**/*',
  extras: [
    'app/content.json',
    'app/favicon.ico',
    'app/apple-touch-icon-precomposed.png',
    'app/README.md',
    'app/robots.txt',
    'node_modules/apache-server-configs/dest/.htaccess'
  ],
  jsVendor: [
    // vendor scripts, no operations done on them
    'bower_components/jquery/dist/jquery.js',
    'bower_components/jsonlint/lib/jsonlint.js',
    'bower_components/marked/marked.min.js',
    'bower_components/pace/pace.min.js',
    'bower_components/routie/dist/routie.min.js',
    'app/js/vendor/*.js',
  ]
};

var Gulp = require('gulp');
var GP = {};
// Misc
GP.runSequence = require('run-sequence');
GP.es = require('event-stream');
GP.changed = require('gulp-changed');
GP.path = require('path');
GP.if = require('gulp-if');
GP.size = require('gulp-size');
GP.filter = require('gulp-filter');
GP.flatten = require('gulp-flatten');
GP.gutil = require('gulp-util');
// HTML
GP.minifyHtml = require('gulp-minify-html');
// Scripts
GP.jshint = require('gulp-jshint');
GP.uglify = require('gulp-uglify');
// Stylesheets
GP.less = require('gulp-less');
GP.csso = require('gulp-csso');
GP.autoprefixer = require('gulp-autoprefixer');
// Run
GP.livereload = require('gulp-livereload');


// var autoprefixerConf = GP.autoprefixer({
//   browsers: ['last 1 version']
// });

/******************** MAIN TASKS ***********************/
Gulp.task('default', function() {
  var tasks = ['html', 'fonts', 'js', 'less', 'css', 'content', 'jsVendor', 'images', 'extras'];
  return GP.runSequence('clean', tasks);
});

Gulp.task('serve', ['connect', 'watch'], function() {
  require('opn')('http://localhost:9000');
});

/************* Build Tasks ***********/
Gulp.task('clean', require('del').bind(null, ['dist']));

Gulp.task('html', function() {
  var minify = GP.minifyHtml({
    conditionals: true,
    loose: true
  });
  return Gulp.src(src.html).pipe(minify).pipe(Gulp.dest('dist'));
});

Gulp.task('less', function() {
  var lessConf = GP.less({
    paths: [GP.path.join(__dirname, 'less', 'includes')]
  });
  return Gulp.src(src.less).pipe(lessConf).pipe(Gulp.dest('dist/css'));
});

Gulp.task('css', function() {
  return Gulp.src(src.css).pipe(Gulp.dest('dist/css'));
});

Gulp.task('fonts', function() {
  var result = Gulp.src(src.fonts)
    .pipe(GP.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(GP.flatten())
    .pipe(Gulp.dest('dist/fonts'));
  return result;
});

Gulp.task('js', ['jshint'], function() {
  return Gulp.src(src.js).pipe(GP.uglify()).pipe(Gulp.dest('dist/js'));
});

Gulp.task('jshint', function() {
  return Gulp.src(src.js)
    .pipe(GP.jshint('.jshintrc'))
    .pipe(GP.jshint.reporter('jshint-stylish'))
    .pipe(GP.jshint.reporter('fail'));
});

/*********** Copy Tasks *********************/
Gulp.task('extras', function() {
  return Gulp.src(src.extras).pipe(Gulp.dest('dist'));
});

Gulp.task('jsVendor', function() {
  return Gulp.src(src.jsVendor).pipe(Gulp.dest('dist/js'));
});

Gulp.task('images', function() {
  return Gulp.src(src.images).pipe(Gulp.dest('dist/img'));
});

Gulp.task('content', function() {
  return Gulp.src(src.content).pipe(Gulp.dest('dist/content'));
});

/*********************** Runtime Tasks **************************/

Gulp.task('connect', function() {
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var app = require('connect')()
    .use(require('connect-livereload')({
      port: 35729
    }))
    .use(serveStatic('dist'))
    .use(serveIndex('dist'));
  require('http').createServer(app)
    .listen(9000)
    .on('listening', function() {
      console.log('Started connect web server on http://localhost:9000');
    });
});

Gulp.task('watch', ['connect'], function() {
  GP.livereload.listen();
  // specified build instead of build all
  Gulp.watch(src.js, ['js']);
  Gulp.watch(src.html, ['html']);

  Gulp.watch(src.extras, ['extras']);
  Gulp.watch(src.content, ['content']);
  Gulp.watch(src.images, ['images']);
  Gulp.watch('app/less/**/*.less', ['less']);
  Gulp.watch(src.css, ['css']);
  Gulp.watch(src.fonts, ['fonts']);

  // watch for changes
  Gulp.watch('dist/**/*.*').on('change', GP.livereload.changed);
});
