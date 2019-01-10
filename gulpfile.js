/*jshint esversion: 6 */
 
const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const del = require('del');
const plumber = require('gulp-plumber');
const beeper = require('beeper');
const imagemin = require('gulp-imagemin');
const gulpPngquant = require('gulp-pngquant');
const htmlmin = require('gulp-htmlmin');
const fileinclude = require('gulp-file-include');
const imageminMozjpeg = require('imagemin-mozjpeg');
const connect = require('gulp-connect');
const rollup = require('rollup');
const commonJs = require('rollup-plugin-commonjs');
const resolveNodeModules = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify-es');
const buble = require('rollup-plugin-buble');

gulp.task('sass', function () {
    return gulp.src([
        'sass/main.scss'
        ])
        .pipe(plumber(errorHandler))
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./css'));
});

function errorHandler(error) {
  // 3 beeps for error
  beeper('*-*');
  console.error(error);
  return true;
}

function html() {
  return gulp.src(['*.html','*.htm'])
      //.pipe(embedlr())
      .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file',
        indent: true
      }))
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('dist/'));
      //.pipe(refresh(server));
}

function js(){
  return rollup.rollup({
    //external: ['url','path'],
    input: [
        'js/modules/app.js',
        'js/modules/index.js',
        'js/modules/contacts.js'
        ],
    experimentalCodeSplitting: true,
    optimizeChunks: true,
    treeshake: true,
    // onwarn: function (message) {
    //   // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    //   // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    //   if (/The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten./.test(message)) {
    //       return;
    //   }
    //   console.error(message);
    // },
    plugins: [
        resolveNodeModules(),
        commonJs()
    ]
  }).then(bundle => {
    return bundle.write({
      dir: 'dist/js',
      format: 'system',
      //name: 'scripts',
      sourcemap: true
    });
  });
}

function jsProd(){
  return rollup.rollup({
    //external: ['lottie','PIXI'],
    input: [
        'js/modules/app.js',
        'js/modules/index.js',
        'js/modules/contacts.js'
        ],
    experimentalCodeSplitting: true,
    optimizeChunks: true,
    treeshake: true,
    // onwarn: function (message) {
    //   // Suppress this error message... there are hundreds of them. Angular team says to ignore it.
    //   // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
    //   if (/The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten./.test(message)) {
    //       return;
    //   }
    //   console.error(message);
    // },
    plugins: [
        resolveNodeModules(),
        commonJs(),
        buble({
            exclude: 'node_modules/**'
        }),
        uglify()
    ]
  }).then(bundle => {
    return bundle.write({
      dir: 'dist/js',
      format: 'system',
      //name: 'scripts',
      sourcemap: false
    });
  });
}


gulp.task('images', function() {
    return gulp.src(['images/**/*.gif','images/**/*.jpg','images/**/*.svg'])
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            /*imagemin.jpegtran({progressive: true}),*/
            imageminMozjpeg({quality: 87, progressive: true}),
            /*imagemin.optipng({optimizationLevel: 7}),*/

            imagemin.svgo({
                plugins: [
                    {removeViewBox: false},
                    {cleanupIDs: false}
                ]
            })
        ], {
            verbose: true
        }))
        .pipe(gulp.dest('dist/images'));
});

gulp.task('png', function() {
    return gulp.src(['images/**/*.png'])
        .pipe(gulpPngquant({
            quality: '90-95'
        }))
        .pipe(gulp.dest('dist/images'));
});

// TODO: add video optimization
// Example: ffmpeg -i input.mp4 -movflags faststart -c:a aac -b:a 64k -c:v libx264 -r 23 -crf 23 output.mp4
// No audio: ffmpeg -i "input.mp4" -movflags faststart -c:v libx264 -r 27 -crf 23 output.mp4
gulp.task('video', function() {
    return gulp.src(['video/**/*'])
        .pipe(gulp.dest('dist/video'));
});

gulp.task('fonts', function(){
    return gulp.src(['css/fonts/**/*'])
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('pdf', function() {
    return gulp.src(['*.pdf'])
        .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
    return gulp.src(['css/**/*.css'])
        .pipe(cleanCSS({compatibility: 'ie10'}))
        .pipe(gulp.dest('dist/css'));
     //   .pipe(sass().on('error', sass.logError));
});

gulp.task('assets', function() {
    return gulp.src(['assets/**/*'])
        .pipe(gulp.dest('dist/assets'));
});

function watch(done) {
    gulp.watch('sass/*.scss', gulp.series('sass','css'));
    gulp.watch('js/**/*.js', js);
    gulp.watch(['*.html','*.htm','partials/*.htm'], html);
    done();
}
gulp.task('watch', watch);

gulp.task('favicon', function() {
    return gulp.src(['favicon.ico','*.png','browserconfig.xml','manifest.json'])
        .pipe(gulp.dest('dist'));
});

gulp.task('vendor', function() {
    return gulp.src(['vendor/**/*'])
        .pipe(gulp.dest('dist/vendor'));
});

gulp.task('clean:cache', function(){
    return del('.sass-cache/**', {force:true});
});

gulp.task('sw', function() {
    return gulp.src(['sw.js'])
        .pipe(gulp.dest('dist'));
});

gulp.task('workers', function () {
    return gulp.src('js/workers/*')
        .pipe(gulp.dest('dist/workers'));
});

gulp.task('server', function(done) {
    connect.server({
        host: 'localhost',
        port: 5000,
        root: './dist',
        livereload: false,
        https: true
    });
    done();
});

exports.html = html;
exports.js = js;
exports.watch = watch;

const media = gulp.parallel('images', 'png', 'video', 'pdf', 'fonts', 'assets');
gulp.task('media', media);

const build =  gulp.series('sass', gulp.parallel('css', 'workers', html, js, 'favicon', 'vendor','sw'));
gulp.task('build', build);

const buildProd = gulp.series('sass', gulp.parallel('css', 'workers', html, jsProd, 'favicon', 'vendor','sw'));
gulp.task('build:prod', buildProd);

const defaultTask = gulp.series(build, gulp.parallel('server', 'watch'));
gulp.task('default', defaultTask);

const deploy = gulp.parallel(media, buildProd);
gulp.task('deploy', deploy);