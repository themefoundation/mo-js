/*global module:false*/
module.exports = function(grunt) {
	grunt.initConfig({

		sass: {
	        options: {
	            style: 'expanded'
	        },
	        dist: {
	            files: {
	                'css/mo.css': 'sass/demo.scss'
	            }
	        }
		},

		watch: {
			// grunt: { files: ['Gruntfile.js'] },

			sass: {
				files: 'sass/*.scss',
				tasks: ['sass']
			}
		},

	});

	// grunt.registerTask( 'default', ['watch'] );
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('default', ['watch']);


	// grunt.registerTask("default", ["jshint"]);
};