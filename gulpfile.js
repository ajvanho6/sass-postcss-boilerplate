var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    imagemin   = require('gulp-imagemin'),
    minifyCSS = require('gulp-minify-css'),
    postcss = require('gulp-postcss'),
    rucksack = require('rucksack-css'),
    pxtorem = require('postcss-pxtorem'),
    vr = require('postcss-vertical-rhythm'),
    lost = require('lost');

//CSS task
gulp.task('css', function () {
    var processors = [
      lost,
      rucksack({fallbacks:true,autoprefixer:true}),
      pxtorem({
        rootValue: 16,
        unitPrecision: 5,
        propWhiteList: ['font', 'font-size', 'line-height', 'letter-spacing'],
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 0
      }),
      vr
    ];

    return gulp.src('src/scss/style.scss')
    .pipe(sass({errLogToConsole: true}))
    .pipe(postcss(processors))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({stream:true}));
});

//JS task
gulp.task('js',function(){
  gulp.src('src/js/scripts.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('app/assets/js'))
    .pipe(browserSync.reload({stream:true, once: true}));
});

//RELOAD task
gulp.task('browser-sync', function() {
    browserSync.init(null, {
        server: {
            baseDir: "app"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

//IMAGE MINIFY task
gulp.task('imagemin', function() {
  return gulp.src('src/img/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('app/assets/img'));
});

//DEFAULT task
gulp.task('default', ['css', 'js', 'browser-sync','imagemin'], function () {
    gulp.watch("src/scss/*/*.scss", ['css']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html", ['bs-reload']);
    gulp.watch('src/img/*.{jpg,png,gif}', ['imagemin']);
});
