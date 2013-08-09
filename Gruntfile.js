module.exports = function(grunt){
	grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
		concat : {
            'dist/Jingle.debug.js' :
                ['src/js/lib/*.js','src/js/Jingle.js','src/js/module/*.js','src/js/plugin/*.js'],
            'dist/Jingle.css' : ['src/css/base.css','src/css/module/*.css']
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
                    {expand: true,cwd: 'dist/',src: ['Jingle.debug.js'],dest: 'sample/js/lib/'},
                    {expand: true,cwd: 'dist/',src: ['Jingle.css'],dest: 'sample/css/'},
                    {expand: true,cwd: 'dist/',src: ['Jingle.debug.js'],dest: 'demo/js/lib/'},
                    {expand: true,cwd: 'dist/',src: ['Jingle.css'],dest: 'demo/css/'}
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