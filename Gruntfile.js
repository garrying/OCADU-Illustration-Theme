'use strict';
module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true,
        reporter: require('jshint-stylish')
      },
      all: [
        'assets/src/js/app.src.js'
      ]
    },
    
    uglify: {
      dist: {
        files: {
          'assets/dist/js/app.min.js': [
            'assets/src/js/lib/*.js',
            'assets/src/js/app.src.js'
          ]
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true
        },
      dist: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'assets/src/stylesheets',
          src: ['*.{scss,sass}'],
          dest: 'assets/dist/stylesheets',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: 'assets/src/stylesheets',
          src: ['*.{scss,sass}'],
          dest: 'assets/dist/stylesheets',
          ext: '.css'
        }]
      }
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/dist/stylesheets/',
          src: '{,*/}*.css',
          dest: 'assets/dist/stylesheets/'
        }]
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0
      },
      minify: {
        expand: true,
        cwd: 'assets/dist/stylesheets/',
        src: ['*.css'],
        dest: 'assets/dist/stylesheets/',
      }
    },
    
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/src/images/',
          src: '{,*/}*.svg',
          dest: 'assets/dist/images/'
        }]
      }
    },
        
    usemin: {
      options: {
        dirs: ['assets/dist'],
        assetsDirs: ['assets/dist','assets/dist/images','assets/dist/js','assets/dist/stylesheets'],
        patterns: {
          html: [[/(app.min\.js)/, 'Replacing reference to app javascript'],[/(main\.css)/, 'Replacing reference to stylesheet']]
        }
      },
      html: ['functions.php'],
      css: ['assets/dist/stylesheets/{,*/}*.css']
    },

    imagemin: {
       static: {
         options: {
           optimizationLevel: 3
         },
         files: {
           'assets/dist/images/loader.gif': 'assets/src/images/loader.gif'
         }
       }
     },
    
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['assets/src/js/lib/*.js','assets/src/js/app.src.js'],
        dest: 'assets/dist/js/app.min.js',
      },
    },
    
    watch: {
      js: {
        files: [
          '<%= jshint.all %>', 'assets/src/js/lib/*.js'
        ],
        tasks: ['jshint','concat']
      },
      svg: {
        files: 'assets/src/images/*.svg',
        tasks: ['svgmin']
      },
      sass: {
        files: ['assets/src/stylesheets/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer'],
        options: {
          livereload: true,
        },
      },
    },
    
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            'assets/dist/*',
            '!assets/dist/.git*'
          ]
        }]
      }
    },

    copy: {
      main: {
        flatten: true,
        expand: true,
        cwd: 'assets/src/fonts/',
        src: '**',
        dest: 'assets/dist/fonts/'
      },
    },

    parker: {
      options: {},
      src: [
        'assets/dist/stylesheets/{,*/}*.css'
      ],
    },
    
    concurrent: {
      server: [
        'sass:server'
      ]
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'copy',
    'svgmin',
    'imagemin',
    'concat',
    'concurrent:server',
    'autoprefixer'
  ]);

  grunt.registerTask('build', [
    'clean',
    'copy',
    'uglify',
    'svgmin',
    'imagemin',
    'sass:dist',
    'autoprefixer',
    'cssmin'
  ]);

  grunt.registerTask('dev', [
    'default',
    'watch'
  ]);

};