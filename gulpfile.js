// generated on 2017-01-04 using generator-webapp 2.3.2
var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        html: 'build/',
        js: 'dist/scripts/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        less: 'dist/styles/'
    },
    src: { //Пути откуда брать исходники
        html: 'src/*.html', //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
        main_js: 'scripts/main/*.js',//В стилях и скриптах нам понадобятся только main файлы
        widget_js: 'scripts/widget/*.js',
        admin_js: 'scripts/admin/*.js',
        style: 'src/style/main.css',
        img: 'src/img/**/*.*', //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
        fonts: 'src/fonts/**/*.*',
        less: 'styles/**/main.less'
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
        admin_js: 'scripts/admin/*.js',
        localization_js: 'scripts/localization/*.js',
        locales_json: 'scripts/localization/locales/**/*.json',
        style: 'styles/**/*.css',
        style_less: 'styles/**/*.less',
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
var gulpIgnore = require('gulp-ignore');
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

gulp.task('build:admin_js', function() {
  return gulp.src(path.src.admin_js)
    .pipe($.concat('admin.js'))
    .pipe(gulp.dest(path.build.js));
});

gulp.task('build:php', () => {
  return gulp.src('*.php')
    .pipe($.useref({searchPath: ['.']}))     
    .pipe($.if(['*.js','!bower_components/i18next/**','!bower_components/jquery-i18next/**'], $.uglify()))
   /* .pipe($.rev())    
    .pipe($.revReplace())*/
    /*.pipe($.if('*.css', $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: true})))*/
    .pipe(gulp.dest('dist'));
});

gulp.task('copy:style', () => {
  return gulp.src('styles/css/*.css')
    .pipe($.plumber())
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
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

gulp.task('copy:localization_js', () => {
  return gulp.src('scripts/localization/*.js')
    .pipe(gulp.dest('dist/scripts/localization/'));
});

gulp.task('copy:locales_json', () => {
  return gulp.src('scripts/localization/locales/**/*')
    .pipe(gulp.dest('dist/scripts/localization/locales'));
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
    $.watch([path.watch.admin_js], function(event, cb) {
        gulp.start('build:admin_js');        
    });
    $.watch([path.watch.localization_js], function(event, cb) {
        gulp.start('copy:localization_js');        
    });  
    $.watch([path.watch.locales_json], function(event, cb) {
        gulp.start('copy:locales_json');        
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