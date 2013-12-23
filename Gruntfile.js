'use strict';
module.exports = function(grunt) {

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
      dist: {
        options: {
          sassDir: 'assets/src/stylesheets',
          cssDir: 'assets/dist/stylesheets'
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
        files: [
          {
            expand: true,
            cwd: 'assets/src/images/',
            src: ['*.png'],
            dest: 'assets/dist/images/',
            ext: '.png'
          }
        ]
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
        tasks: ['uglify','jshint']
      },
      css: {
        files: 'assets/src/stylesheets/*.scss',
        tasks: ['compass', 'cssmin']
      },
      png: {
        files: 'assets/src/images/*.png',
        tasks: ['imagemin']
      }
    },
    clean: {
      dist: [
        'assets/dist/js/','assets/dist/images/','assets/dist/stylesheets/'
      ]
    }
  });

  // Load tasks
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-rev');

  // Register tasks
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'uglify',
    'compass',
    'cssmin',
    'imagemin',
    'svgmin'
  ]);

  grunt.registerTask('minify', [
    'uglify',
    'cssmin',
    'imagemin',
    'svgmin'
  ]);

  grunt.registerTask('dev', [
    'default',
    'watch'
  ]);

};