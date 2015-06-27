/* jshint node:true */
'use strict';
// generated on 2015-02-08 using generator-gulp-webapp 0.2.0
var gulp = require('gulp');
var gutil = require('gulp-util');
var $ = require('gulp-load-plugins')();
var config = {
  bowerDir: './bower_components'
};

gulp.task('less', function() {
  var less = require('gulp-less');
  var path = require('path');

  /*var AutoprefixPlugin = require('less-plugin-autoprefix');
  var autoprefixOptions = {
      browsers: ["last 2 versions"]
  };
  var autoprefix = new AutoprefixPlugin(autoprefixOptions);*/
  gulp.src('app/less/**/*.less')
    .pipe(less({
      //            plugins: [autoprefix],
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(gulp.dest('app/styles'));
});


gulp.task('styles', function() {
  return gulp.src('app/css/**/*.css')
    .pipe($.autoprefixer({
      browsers: ['last 1 version']
    }))
    .pipe(gulp.dest('app/styles'));
});


gulp.task('html', ['styles', 'less'], function() {
  var assets = $.useref.assets({
    searchPath: '{app,styles}'
  });

  return gulp.src('app/*.html')
    .pipe(assets)
    //        .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.csso()))
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.if('*.html', $.minifyHtml({
      conditionals: true,
      loose: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', function() {
  var folders = [config.bowerDir + '/bootstrap/dist/**/*'];
  // gutil.log(folders);
  var result = gulp.src(folders.concat('app/fonts/**/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'));
  return result;
});

gulp.task('jshint', function() {
  return gulp.src('app/scripts/**/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.jshint.reporter('fail'));
});


gulp.task('extras', function() {
  return gulp.src([
    // 'app/LICENSE',
    'app/*.*',
    '!app/*.html',
    // 'app/content/**/*',
    'node_modules/apache-server-configs/dest/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('content', function() {
  return gulp.src([
    'app/content/**/*',
  ], {
    dot: true
  }).pipe(gulp.dest('dist/content'));
});



gulp.task('clean', require('del').bind(null, ['dist']));

gulp.task('connect', function() {
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

gulp.task('serve', ['connect', 'watch'], function() {
  require('opn')('http://localhost:9000');
});


// inject bower components
gulp.task('wiredep', function() {
  var wiredep = require('wiredep').stream;

  gulp.src('app/*.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app'));
});

gulp.task('watch', ['connect'], function() {
  $.livereload.listen();

  // specified build instead of build all
  gulp.watch('app/*.*', ['extras']);
  gulp.watch('app/*.html', ['html']);

  gulp.watch('app/content/**/*', ['content']);
  gulp.watch('app/css/**/*.css', ['html']);
  gulp.watch('app/fonts/**/*', ['fonts']);
  gulp.watch('app/images/**/*', ['images']);
  gulp.watch('app/less/**/*.less', ['html']);
  gulp.watch('app/scripts/**/*', ['html']);

  // if bower changes wiredependencies
  gulp.watch('bower.json', ['wiredep']);

  // watch for changes
  gulp.watch('dist/**/*.*').on('change', $.livereload.changed);

});

// better use gulp so that clean is used before building
gulp.task('build', ['jshint', 'html', 'images', 'fonts', 'extras', 'content'], function() {
  return gulp.src('dist/**/*').pipe($.size({
    title: 'build',
    gzip: true
  }));
});

gulp.task('default', ['clean'], function() {
  gulp.start('build');
});
