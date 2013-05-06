module.exports = function(grunt){
	grunt.initConfig({
		concat : {
			option:{},
			dist : {
				src:[
					'src/js/*.js'],
				dest:'dist/Jingle.debug.js'
			}
		}

	});
  	grunt.loadNpmTasks('grunt-contrib-concat');

  	grunt.registerTask('default', ['concat']);
}