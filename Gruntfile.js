module.exports = function(grunt){
	grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
		concat : {
            'dist/Jingle.debug.js' : ['src/js/Jingle.Core.js','src/js/router/*.js','src/js/*.js','src/element/*.js','src/plugin/*.js'],
            'dist/Jingle.css' : 'src/css/*.css'
		},
        uglify : {
            target : {
                files : {
                    'dist/Jingle.min.js': 'dist/Jingle.debug.js'
                }
            }
        },
        cssmin : {
            target : {
                files : {
                    'dist/Jingle.min.css': 'dist/Jingle.css'
                }
            }
        },
        copy : {
            target : {
                files : [
                    {expand: true,cwd: 'dist/',src: ['Jingle.min.js'],dest: 'sample/js/lib/'},
                    {expand: true,cwd: 'dist/',src: ['Jingle.min.css'],dest: 'sample/css/'}
                ]
            }
        }

	});
  	grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

  	grunt.registerTask('default', ['concat','uglify','cssmin','copy']);
}