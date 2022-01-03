"use strict";

//IMPORTS PLUGINS
const gulp          = require("gulp");
const gplugins      = require("gulp-load-plugins")();
const syncy         = require("syncy");
const babel 		= require("gulp-babel");
const browser_sync  = require("browser-sync");
const injectscg 	= require("gulp-inject-svg");
const glog 			= require("fancy-log");

//DIRETORIOS BASE
const src_base_path  = "src";
const dest_base_path = "dist";

//DEFINICAO
var env = "DEV";

//RAMIFICACAO DOS DIRETORIOS
const config = {
    sass_path:      "sass",
    styles_path:    "css",
    images:         "image",
    js:             "js",
	html:           "",
	json:           "json"
};

// COMBINA A BASE DOS PATHS DE DIST E SRC COM OS PATHS ACIMA
var config_src = {}, config_dest = {};

//LINK DIRS
Object.keys(config).map(function(key, index) { config_src[key]  = src_base_path + "/" + config[key];});
Object.keys(config).map(function(key, index) { config_dest[key] = dest_base_path + "/" + config[key];});

//PREFIXOS PARA STYLES
const AUTOPREFIXER_BROWSERS = [
    "ie >= 10",
    "ff >= 24"
];

// SICRONIZAR ARQUIVOS NAO COMPILADOS DO SRC PARA DIST
gulp.task("sync", function(done) {
    syncy([
            src_base_path + "/**",
            // A TAFERA DO JAVASCRIPT E RESPONSAVEL POR MINIFICAR TODOS OS JS E CONCATENALOS
            "!" + config_src.js + "/**/*.*",
            // A TAREFA DE IMAGIN E RESPONSAVEL POR OTIMIZAR AS IMAGENS
            "!" + config_src.images + "/**/*.*",
            // A TAREFA DE STYLES E RESPONSAVEL POR TRANSFORMAR O SASS EM CSS MININICADO E CONDENSADO
            "!" + config_src.sass_path + "/**/*.*",
            // A TAREFA DE HTML E RESPONSAVEL POR MINIFICAR E OTIMIZAR OS HTML
			"!" + config_src.html + "/**/*.html",
			// A TAREFA DE JSON REALIZAR A VALIDACAO E TRASNFERENCIAS DOS JSONS
            "!" + config_src.json + "/**/*.*"
        ],
        "dist/",
        {
            base: "src"
        }
    )
    .then(function() {
        done();
    })
    .catch(function(err){
        done(err);
    });
});

//OTIMIZACAO DE IMAGENS
gulp.task("imagemin", function () {
    return gulp.src(config_src.images + "/*.*")
        .pipe(gplugins.imagemin({
            progressive: true,
            optimizationLevel: 5,
            verbose: true,
            svgoPlugins: [{
                removeViewBox: false
            }]
        }))
        .pipe(gulp.dest(config_dest.images));
});

//COMPILE JAVASCRIPT
gulp.task("scripts", ["cbabel"], function() {
    return gulp.src([
			// INCLUSAO DE DEPENDENCIAS
			"node_modules/jquery/dist/jquery.min.js",
			"node_modules/jquery-ui-dist/jquery-ui.min.js",
			"node_modules/jquery-lazy/jquery.lazy.min.js",
			"node_modules/bootstrap/dist/js/bootstrap.min.js",

            config_src.js + "/.cache/mod.functions.js",
			config_src.js + "/.cache/mod.prototypes.js",

			//POLYFILLS
			config_src.js + "/.cache/mod.promise.js",
			config_src.js + "/.cache/mod.keyframes.js",

            // APLICACAO
			config_src.js + "/.cache/app.load.js",

		])
		.pipe(gplugins.sourcemaps.init())
		.pipe(gplugins.concat("app.js"))
        .pipe(gplugins.if(env == "PROD", gplugins.uglify()))
		.pipe(gplugins.sourcemaps.write("."))
        .pipe(gulp.dest(config_dest.js));
});

//COMPILE JAVASCRIPT FOR SUPORT ECMA6
gulp.task("cbabel", function() {
    return gulp.src([

            // HELPS AUXILIARES
            config_src.js + "/mod.functions.js",
			config_src.js + "/mod.prototypes.js",

			//POLYFILLS
			config_src.js + "/mod.promise.js",
			config_src.js + "/mod.keyframes.js",

            // APLICACAO
			config_src.js + "/app.load.js",

		]).on("end", function(){
			glog.warn("Passou pelo SRC...");
		})
		.pipe(babel())
			.on("error", function(err){
				glog.warn(">> Error Babel <<");
				glog.warn("File Error: " + err.fileName);
				glog.warn("Line Error: " + err.loc.line);
				glog.warn("Column Error: " + err.loc.column);
				glog.warn("Error Babel: " + err.message);
				this.emit("end");
			})
			.on("end", function() {
				glog.warn("Finish Process Babel");
			})
		.pipe(gulp.dest(config_src.js + "/.cache"));
});

// BROWSER-SYNC
gulp.task("browser-sync", ["styles"], function () {

    //WATCH FILES
    var files = [
        config_dest.styles_path + "/main.css",
        config_dest.js + "/app.js"
    ];

    //INITIALIZE browser_sync
    browser_sync(files, {
        notify: true,
        server: {
            baseDir: ".",
            directory: true
        },
        ghostMode: false,
        open: false
    });

});

// STYLES
gulp.task("styles", function () {
    return gulp.src(config_src.sass_path + "/**/*.scss")
        .pipe(gplugins.sourcemaps.init())
        .pipe(
            gplugins.sass({
                includePaths: [
					"node_modules/bootstrap/scss/",
					"node_modules/@fortawesome/fontawesome-free/scss/",
					"/node_modules/animate.css/"
                ]
            })
            .on("error", gplugins.notify.onError(function (error) {
                return "Error: " + error.message;
            }))
        )
        .pipe(gplugins.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe(gplugins.concat("main.css"))
        .pipe(gplugins.if(env == "PROD", gplugins.cssnano({autoprefixer: false})))
        .pipe(gplugins.sourcemaps.write("."))
        .pipe(gulp.dest(config_dest.styles_path));
});

// HTML INLINE SOURCE
gulp.task("html", function () {
	return gulp.src(config_src.html + "/*.html")
		.pipe(injectscg({
			base: "/src/"
		}).on("end", function(){
			glog.warn("Finish Process Inject SVG");
		}))
        .pipe(gplugins.inlineSource())
        .pipe(gplugins.if(env == "PROD", gplugins.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest("./dist"));
});

// JSON SOURCE UPDATE
gulp.task("json", function () {
	return gulp.src(config_src.json + "/*.json")
		.pipe(gulp.dest("./dist"));
});

// SERVER TASKS
gulp.task("watch", function () {
    // JS DO APP DEVEM SER AGRUPADOS
    gulp.watch(config_src.js + "/*.js", ["scripts"]);

    // PROCESSAR O HTML
	gulp.watch(config_src.html + "/*.html", ["html"]);

	// ATUALIZAR O JSON
    gulp.watch(config_src.json + "/*.json", ["json"]);

    // TREATS THE IMAGES OF THE PROJECT
    gulp.watch(config_src.images + "/**/*.*", ["imagemin"]);

    // TRANFORMS SASS INTO CSS
    gulp.watch(config_src.sass_path + "/**/*.scss", ["styles"]);
});

//TASKS BASIS
var compile_assets_taks = ["imagemin", "scripts", "styles", "html", "json"];

//TASK DEVELOP
gulp.task("default", ["sync"], function(){
    env = "DEV";
    gulp.start(compile_assets_taks.concat(["browser-sync", "watch"]));
});

//TASK PRODUCTION
gulp.task("prod", ["sync"], function(){
    env = "PROD";
    gulp.start(compile_assets_taks);
});
