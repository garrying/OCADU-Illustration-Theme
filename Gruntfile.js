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
        'assets/js/*.js',
        '!assets/js/app.min.js'
      ]
    },
    uglify: {
      dist: {
        files: {
          'assets/js/app.min.js': [
            'assets/js/lib/*.js',
            'assets/js/app.src.js'
          ]
        }
      }
    },
    compass: {
      dist: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'assets/stylesheets'
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'assets/stylesheets/',
        src: ['*.css'],
        dest: 'assets/stylesheets/',
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
            cwd: 'assets/images/',
            src: ['*.png'],
            dest: 'assets/images/',
            ext: '.png'
          }
        ]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'assets/images/',
          src: '{,*/}*.svg',
          dest: 'assets/images/'
        }]
      }
    },
    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['uglify']
      },
      css: {
        files: 'assets/sass/*.scss',
        tasks: ['compass', 'cssmin']
      },
      png: {
        files: 'assets/images/*.png',
        tasks: ['imagemin']
      }
    },
    clean: {
      dist: [
        'assets/js/app.min.js'
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

  // Register tasks
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'uglify',
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
    'watch'
  ]);

};