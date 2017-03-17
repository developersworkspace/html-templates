// Imports
var gulp = require('gulp');
var clean = require('gulp-clean');
var moment = require('moment');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var handlebars = require('gulp-compile-handlebars');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');


gulp.task('clean', function () {
    return gulp
        .src('./dist/*', { read: false })
        .pipe(clean())
});

gulp.task('compile:handlebars', function () {
    var templateData = {
        timeStamp: moment().format('MMMM Do YYYY, h:mm:ss a')
    },
        options = {
            ignorePartials: true,
            batch: ['./src/partials']
        }

    return gulp.src('./src/**/*.handlebars')
        .pipe(handlebars(templateData, options))
        .pipe(rename(function (path) {
            path.extname = ".html"
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('compile:sass', function () {
    return gulp.src('./src/assets/styles/*.scss')
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compressed'
        }))
        .pipe(gulp.dest('./dist/assets/styles'));
});


gulp.task('copy:assets', function () {
    return gulp
        .src([
            '!./src/assets/styles/**',
            './src/assets/**'
            ])
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('build', function (callback) {
    runSequence('clean', 'compile:handlebars', 'compile:sass', 'copy:assets', callback);
});

gulp.task('watch', ['build'], function () {
    return watch('./src/**/*', function () {
        gulp.start('build');
    });
});