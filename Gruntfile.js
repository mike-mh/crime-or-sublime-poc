module.exports = function (grunt) {
  grunt.initConfig({
    pug: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
          cwd: 'public/',
          src: '**/*.pug',
          dest: 'public/compiled_app',
          expand: true,
          ext: '.component.html'
        }]
      }
    },
    sass: {
      dist: {
        options: {
        },
        files: [{
          cwd: 'public/app',
          src: '**/*.sass',
          dest: 'public/compiled_app',
          expand: true,
          ext: '.component.css'
        }]
      }
    },
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: 'public/compiled_app',
          src: '**/*.js',
          dest: 'public/compiled_app'
        }]
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['pug', 'sass', 'uglify']);
}
