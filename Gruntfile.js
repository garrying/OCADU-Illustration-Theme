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
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'assets/src/js/app.src.js',
      ]
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      strict: {
        options: {
          import: 2
        },
        src: ['assets/dist/stylesheets/*.css']
      }
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
    compass: {
      options: {
        sassDir: 'assets/src/stylesheets',
        cssDir: 'assets/dist/stylesheets',
        generatedImagesDir: 'assets/dist/images',
        imagesDir: 'assets/dist/images',
        httpImagesPath: '/wp-content/themes/ocaduillustration/assets/dist/images',
        relativeAssets: false,
        assetCacheBuster: false
      },
      dist: {
        options: {
          sassDir: 'assets/src/stylesheets',
          cssDir: 'assets/dist/stylesheets'
        }
      },
      server: {
        options: {
          debugInfo: false
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'assets/dist/stylesheets/',
        src: ['*.css'],
        dest: 'assets/dist/stylesheets/',
      }
    },
    imagemin: {
      png: {
        options: {
          optimizationLevel: 7
        },
        files: [{
          expand: true,
          cwd: 'assets/src/images/',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: 'assets/dist/images/'
        }]
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
    rev: {
      dist: {
        files: {
          src: [
            'assets/dist/js/{,*/}*.js',
            'assets/dist/stylesheets/{,*/}*.css',
            'assets/dist/images/{,*/}*.{gif,jpeg,jpg,png,webp,svg}'
          ]
        }
      }
    },
    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['uglify', 'jshint']
      },
      png: {
        files: 'assets/src/images/*.png',
        tasks: ['imagemin']
      },
      css: {
        files: 'assets/src/stylesheets/*.scss',
        tasks: ['compass:server']
      }
    },
    clean: {
      dist: [
        'assets/dist/js/', 'assets/dist/images/', 'assets/dist/stylesheets/'
      ]
    },
    concurrent: {
      server: [
        'compass:server'
      ]
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'uglify',
    'imagemin',
    'svgmin',
    'concurrent:server'
  ]);

  grunt.registerTask('minify', [
    'uglify',
    'cssmin',
    'imagemin',
    'svgmin'
  ]);

  grunt.registerTask('lint', [
    'jshint',
    'csslint'
  ]);

  grunt.registerTask('dev', [
    'default',
    'watch'
  ]);

};