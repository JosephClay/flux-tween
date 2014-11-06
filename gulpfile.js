var gulp       = require('gulp'),
    fs         = require('fs'),
    path       = require('path'),
    moment     = require('moment'),
    exorcist   = require('exorcist'),
    watchify   = require('watchify'),
    browserify = require('browserify'),
    buffer     = require('vinyl-buffer'),
    source     = require('vinyl-source-stream'),
    uglify     = require('gulp-uglify'),
    gutil      = require('gulp-util'),
    gzip       = require('gulp-gzip'),
    rename     = require('gulp-rename'),
    header     = require('gulp-header'),
    pkg        = require('./package.json'),
    UGLIFY_OPTS = {
        fromString: true,
        mangle: {
            sort:     true,
            toplevel: true,
            eval:     true
        },
        compress: {
            screw_ie8:    true,
            properties:   true,
            unsafe:       true,
            sequences:    true,
            dead_code:    true,
            conditionals: true,
            booleans:     true,
            unused:       true,
            if_return:    true,
            join_vars:    true,
            drop_console: true,
            comparisons:  true,
            loops:        true,
            cascade:      true,
            warnings:     true,
            negate_iife:  true,
            pure_getters: true

        }
    };

var build = function() {
    return browserify('./src/index.js', {
            standalone: 'flux'
        })
        .bundle()
        .pipe(source('flux-tween.js'))
        .pipe(buffer());
};

gulp.task('build', function() {
    build()
        .pipe(gulp.dest(process.cwd()));
});

gulp.task('min', function() {
    build()
        .pipe(rename('flux-tween.min.js'))
        .pipe(uglify(UGLIFY_OPTS))
        .pipe(gulp.dest(process.cwd()));
});

gulp.task('zip', function() {
    gulp.src('flux-tween.min.js')
        .pipe(gzip({ append: true }))
        .pipe(gulp.dest(process.cwd()));
});

gulp.task('banner', function() {
    var file = fs.readFileSync('./flux-tween.min.js').toString();
    file = file.replace(/^\/\*(.|\n)+\*\//, '');
    fs.writeFileSync('./flux-tween.min.js', file);

    var banner = [
        '/*! ${title} - v${version} - ${date} %>\n',
        ' * ${homepage}\n',
        ' * Copyright (c) 2013-${year} ${author}; License: ${license} */\n'
    ].join('');

    gulp.src('flux-tween.min.js')
        .pipe(header(banner, {
            title:    pkg.title || pkg.name,
            version:  pkg.version,
            date:     moment().format('YYYY-MM-DD'),
            homepage: pkg.homepage,
            author:   pkg.author.name,
            year:     moment().format('YYYY'),
            license:  pkg.license
        }))
        .pipe(gulp.dest(process.cwd()));

});

gulp.task('dev', function() {

    var mapfile = path.join(__dirname, 'flux.js.map'),

        stream = watchify(browserify('./src/index.js', {
            standalone: 'flux',
            debug: true
        })),

        build = function() {
            stream.bundle()
                .pipe(exorcist(mapfile))
                .pipe(source('flux-tween.js'))
                .pipe(buffer())
                .pipe(gulp.dest(process.cwd()));
        };

    stream.on('update', build);
    build();
});

gulp.task('default', function() {
    gulp.start([
        'build',
        'min',
        'zip',
        'banner'
    ]);
});