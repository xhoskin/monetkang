module.exports = function(grunt) {
 
    grunt.registerTask('watch', [ 'watch' ]);
    grunt.registerTask('lite', [ 'watch:js', 'watch:images', 'watch:css', 'watch:jade' ]);
    grunt.registerTask('jade', [ 'watch:jade' ]);
    grunt.registerTask('clean', [ 'clean' ]);
    grunt.registerTask('push', ['concat:js', 'sprite:all', 'less:style', 'jade:compile', 'jade:all', 'sync:img', 'sync:js', 'prettify:all']);

    grunt.initConfig({
        concat: {
            js: {
                options: {
                    separator: ''
                },
                src: [
                    'source/javascript/*.js'
                ],
                dest: 'web/js/main.js'
            },
        },
        uglify: {
            options: {
                mangle: false
            },
            js: {
                files: {
                    'web/js/main.js': ['web/js/main.js']
                }
            }
        },
        sprite: {
            all: {
                src: ['source/images/sprites/*.png'],
                destImg: 'web/images/sprite.png',
                destCSS: 'source/less/_sprites.less',
                imgPath: '../images/sprite.png',
                algorithm: 'alt-diagonal',
                padding: 2,
                cssFormat: 'less',
                cssVarMap: function (sprite) {
                    sprite.name = sprite.name;
                },
                algorithmOpts: {
                    sort: false
                },
                engineOpts: {
                    imagemagick: true
                },
                imgOpts: {
                    format: 'png',
                    quality: 90,
                    timeout: 10000
                },
                cssOpts: {
                    functions: false,
                    cssClass: function (item) {
                        return item.name;
                    }
                }
            }
        },
        less: {
            style: {
                options: {
                    sourceMap:true,
                    compress: true,
                    cleancss: true
                },
                files: {
                    "web/css/style.css": "source/less/style.less"
                }
            }
        },
        prettify: {
            options: {
                indent: 4,
                indent_char: ' ',
                wrap_line_length: 78,
                brace_style: 'expand',
                unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u']
            },
            all: {
                expand: true,
                cwd: 'web/',
                ext: '.html',
                src: ['*.html'],
                dest: 'web/'
            }
        },
        jade: {
            compile: {
                options: {
                    client: false,
                    pretty: false,
                    data: function(dest, src) {
                        return { "img": "/images/", "js": "/js/", "css": "/css/" }
                    }
                },
                files: [ {
                    expand: true,
                    flatten: true,
                    src: "source/*.jade",
                    dest: "web/templates/",
                    ext: ".html"
                } ]
            },
            all: {
                options: {
                    client: false,
                    pretty: true,
                    data: function(dest, src) {
                        var fs = require("fs"),
                            pages = {},
                            design = {};

                        var files = fs.readdirSync('./source/');
                        for(var i in files){
                            if (!files.hasOwnProperty(i)) continue;
                            if (fs.statSync('./source/'+files[i]).isFile() && /jade/.test(files[i])) {
                                var data = fs.readFileSync('./source/'+files[i],'utf8').split('\n'),
                                    page = [];
                                if (/\/\//.test(data[0])) {
                                    pages[files[i].replace('.jade','')] = data[0].replace('//','');
                                } else {
                                    pages[files[i].replace('.jade','')] = 'Укажите название страницы в комментарии';
                                }
                                if (/\/\//.test(data[1])) {
                                    design[files[i].replace('.jade','')] = data[1].replace('//','');
                                } else {
                                    design[files[i].replace('.jade','')] = 'Укажите название макета в комментарии';
                                }
                            }
                        }
                        
                        return { "pages": pages, "design": design, "img": "/images/", "js": "/js/", "css": "/css/" };
                    }
                },
                files: {
                    'web/index.html': ['source/jade/all.jade']
                }
            }
        },
        sync: {
            img: {
                files: [
                    {expand: true, flatten: true, src: ['source/images/*.{jpg,gif,png,ico}'], dest: 'web/images/', filter: 'isFile'}
                ],
                verbose: true
            },
            js: {
                files: [
                    {expand: true, flatten: true, src: ['source/javascript/lib/*.js'], dest: 'web/js/lib/', filter: 'isFile'}
                ],
                verbose: true
            }
        },
        imagemin: {
            dynamic: {
              files: [{
                expand: true,
                cwd: 'web/images/',
                src: ['**/*.{png,jpg,gif}'],
                dest: 'web/images/'
              }]
            }
        },
        clean: {
            svn: ["**//.svn"]
        },
        watch: {
            js: {
                files: ['source/javascript/*.js'],
                tasks: ['concat:js'],
                options: {
                    livereload: true,
                }
            },
            images: {
                files: ['source/images/sprites/*.png'],
                tasks: ['sprite:all']
            },
            css: {
                files: ['source/less/*.less'],
                tasks: ['less:style'],
                options: {
                    livereload: true,
                }
            },
            jade: {
                files: ['source/*.jade'],
                tasks: ['jade:compile']
            },
            sync_img: {
                files: ['source/images/*.{png,jpg,gif}'],
                tasks: ['sync:img']
            },
            sync_js: {
                files: ['source/javascript/lib/*.js'],
                tasks: ['sync:js']
            },
            prettify: {
                files: ['web/templates/*.html'],
                tasks: ['prettify:all']
            }
        }
    });
 
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-spritesmith');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-contrib-jade');
    grunt.loadNpmTasks('grunt-sync');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
};