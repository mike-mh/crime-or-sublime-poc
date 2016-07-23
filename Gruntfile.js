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
          cwd: 'public/app/',
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
    }
  });
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['pug', 'sass']);
}
