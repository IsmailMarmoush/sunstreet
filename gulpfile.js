/* jshint node:true */
'use strict';
var src = {
  less: 'app/less/**/*.less',
  css: 'app/css/**/*.css',
  js: 'app/js/**/*.js',
  fonts: 'app/fonts/**/*',
  html: 'app/*.html',

  images: 'app/img/**/*',
  content: 'app/content/**/*',
  extras: [
    'app/content.json',
    'favicon.ico',
    'apple-touch-icon-precomposed.png',
    'app/README.md',
    'app/robots.txt',
    'node_modules/apache-server-configs/dest/.htaccess'
  ],
  jsVendor: [
    // vendor scripts, no operations done on them
    'bower_components/jquery/dist/jquery.js',
    'bower_components/marked/marked.min.js',
    'bower_components/pace/pace.min.js',
    'bower_components/routie/dist/routie.min.js',
    'app/js/highlight.pack.js',
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
GP.useref = require('gulp-useref');
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
/******************** MAIN TASKS ***********************/
Gulp.task('default', function() {
  var tasks = ['html', 'images', 'fonts', 'justcopy', 'content'];
  GP.runSequence('clean', tasks);
  return Gulp.src('dist/**/*').pipe(GP.size({
    title: 'build',
    gzip: true
  }));
});

Gulp.task('serve', ['connect', 'watch'], function() {
  require('opn')('http://localhost:9000');
});


/************* Build Tasks ***********/
Gulp.task('clean', require('del').bind(null, ['dist']));


Gulp.task('html', ['styles'], function() {
  var assets = GP.useref.assets({
    searchPath: '{app,styles}'
  });
  return Gulp.src(src.html)
    .pipe(assets)
    //        .pipe(GP.if('*.js', GP.uglify()))
    .pipe(assets.restore())
    .pipe(GP.if('*.html', GP.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(Gulp.dest('dist'));
});

Gulp.task('styles', function() {
  var autoprefixer = GP.autoprefixer({
    browsers: ['last 1 version']
  });
  var less = GP.less({
    paths: [GP.path.join(__dirname, 'less', 'includes')]
  });

  var lessFiles = Gulp.src(src.less)
    .pipe(less).pipe(GP.csso());

  var cssFiles = Gulp.src(src.css).pipe(autoprefixer).pipe(GP.csso());
  return GP.es.merge(lessFiles, cssFiles).pipe(Gulp.dest('dist/styles'));
});



Gulp.task('fonts', function() {
  // gutil.log(folders);
  var result = Gulp.src('app/fonts/**/*')
    .pipe(GP.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe(GP.flatten())
    .pipe(Gulp.dest('dist/fonts'));
  return result;
});

Gulp.task('scripts', ['jshint'], function() {
  return Gulp.src(src.js).pipe(GP.uglify).pipe(GP.dest('dist/scripts'));
});

Gulp.task('jshint', function() {
  return Gulp.src(src.js)
    .pipe(GP.jshint('.jshintrc'))
    .pipe(GP.jshint.reporter('jshint-stylish'))
    .pipe(GP.jshint.reporter('fail'));
});

/*********** Copy Tasks *********************/
Gulp.task('jsVendor', function() {
  return Gulp.src(src.jsVendor)
    .pipe(Gulp.dest('dist/js'));
});

Gulp.task('images', function() {
  return Gulp.src(src.images)
    .pipe(Gulp.dest('dist/img'));
});

Gulp.task('extras', function() {
  return Gulp.src(src.extras, {
    dot: true
  }).pipe(Gulp.dest('dist'));
});

Gulp.task('content', function() {
  return Gulp.src(src.content, {
    dot: true
  }).pipe(Gulp.dest('dist/content'));
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
    // paths to bower_components should be relative to the current file
    // e.g. in app/index.html you should use ../bower_components
    .use('/bower_components', serveStatic('bower_components'))
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
  Gulp.watch(src.extras, ['extras']);
  Gulp.watch(src.content, ['content']);
  Gulp.watch(src.images, ['images']);
  Gulp.watch(src.less, ['html']);
  Gulp.watch(src.css, ['html']);
  Gulp.watch(src.fonts, ['fonts']);
  Gulp.watch(src.js, ['html']);
  Gulp.watch(src.html, ['html']);
  // if bower changes wiredependencies
  Gulp.watch('bower.json', ['wiredep']);
  // watch for changes
  Gulp.watch('dist/**/*.*').on('change', GP.livereload.changed);
});
