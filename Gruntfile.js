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

  // Register tasks
  grunt.registerTask('default', [
    'jshint',
    'clean',
    'uglify',
    'cssmin'
  ]);
  grunt.registerTask('dev', [
    'watch'
  ]);

};