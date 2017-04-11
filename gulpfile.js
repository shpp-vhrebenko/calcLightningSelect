// generated on 2017-01-04 using generator-webapp 2.3.2
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'dist/scripts/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        main_js: 'scripts/main/*.js',//В стилях и скриптах нам понадобятся только main файлы
        widget_js: 'scripts/widget/*.js',
        style: 'src/style/main.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*'
    },
    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        php: '*.php',
        php_functions: 'functions/*.php',
        php_configs: 'configs/*.php',
        php_components: 'components/*.php',
        php_classes: 'classes/*.php',
        js: 'scripts/**/*.js',
        main_js: 'scripts/main/*.js',
        widget_js: 'scripts/widget/*.js',
        style: 'styles/**/*.css',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

/* jshint ignore:start */
const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence')
const $ = gulpLoadPlugins();


gulp.task('build:widget_js', function() {
  return gulp.src(path.src.widget_js)
    .pipe($.concat('widget.js'))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('build:main_js', function() {
  return gulp.src(path.src.main_js)
    .pipe($.concat('main.js'))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('build:php', () => {
  return gulp.src('*.php')
    .pipe($.useref({searchPath: ['.']}))    
    .pipe($.if('*.js', $.uglify()))
   /* .pipe($.rev())    
    .pipe($.revReplace())*/
    /*.pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))*/
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:style', () => {
  return gulp.src('styles/css/*.css')
    .pipe(gulp.dest('dist/styles/css/'));
});

gulp.task('copy:fonts', () => {
  return gulp.src('styles/fonts/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('dist/styles/fonts/'));
});

gulp.task('copy:functions_php', () => {
  return gulp.src('functions/*.php')
    .pipe(gulp.dest('dist/functions/'));
});

gulp.task('copy:configs_php', () => {
  return gulp.src('configs/*.php')
    .pipe(gulp.dest('dist/configs/'));
});

gulp.task('copy:components_php', () => {
  return gulp.src('components/*.php')
    .pipe(gulp.dest('dist/components/'));
});

gulp.task('copy:classes_php', () => {
  return gulp.src('classes/*.php')
    .pipe(gulp.dest('dist/classes/'));
});

gulp.task('watch', function(){
    $.watch([path.watch.php], function(event, cb) {
        gulp.start('build:php');        
    });
    $.watch([path.watch.php_functions], function(event, cb) {
        gulp.start('copy:functions_php');        
    });
    $.watch([path.watch.php_configs], function(event, cb) {
        gulp.start('copy:configs_php');        
    });
    $.watch([path.watch.php_components], function(event, cb) {
        gulp.start('copy:components_php');        
    });
    $.watch([path.watch.php_classes], function(event, cb) {
        gulp.start('copy:classes_php');        
    });
    $.watch([path.watch.main_js], function(event, cb) {
        gulp.start('build:main_js');
    });
    $.watch([path.watch.widget_js], function(event, cb) {
        gulp.start('build:widget_js');        
    });
    $.watch([path.watch.style], function(event, cb) {
        gulp.start('copy:style');
    });    
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(
        [
            'build:php',
            'build:main_js',
            'build:widget_js',
            'copy:style',
            'copy:fonts',
            'copy:functions_php',
            'copy:configs_php',
            'copy:components_php',
            'copy:classes_php'
        ], resolve);
  });
});

/* jshint ignore:end */