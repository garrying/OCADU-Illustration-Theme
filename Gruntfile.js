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
        relativeAssets: true,
        assetCacheBuster: false
      },
      dist: {
        options: {
          generatedImagesDir: 'assets/dist/images'
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
          '<%= jshint.all %>'
        ],
        tasks: ['concat']
      },
      svg: {
        files: 'assets/src/images/*.svg',
        tasks: ['svgmin']
      },
      compass: {
        files: ['assets/src/stylesheets/{,*/}*.{scss,sass}'],
        tasks: ['compass:server']
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
    concurrent: {
      server: [
        'compass:server'
      ]
    }
  });

  // Register tasks
  grunt.registerTask('default', [
    'clean',
    'svgmin',
    'concat',
    'concurrent:server'
  ]);

  grunt.registerTask('build', [
    'clean',
    'uglify',
    'svgmin',
    'compass',
    'cssmin'
  ]);

  grunt.registerTask('dev', [
    'default',
    'watch'
  ]);

};