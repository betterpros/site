module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bower: {
      install: {
      }
    },
    wiredep: {
      target: {
        src: [
          'public/**/*.html'
        ]
      }
    },
    jade: {
      options: {
        data: function(dest, src) {
          return require('./data.json')
        }
      },
      release: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'app/pages/*.jade',
            dest: 'public/',
            ext: '.html'
          }
        ]
      }
    },
    copy: {
      jquery: {
        expand: true,
        flatten: true,
        src: 'bower_components/jquery/dist/jquery.min.map',
        dest: 'public/'
      },
      bootstrap: {
        expand: true,
        flatten: true,
        src: 'bower_components/bootstrap/dist/fonts/**',
        dest: 'public/fonts/'
      }
    },
    watch: {
      default: {
        files: [
          'app/**.js',
          'app/**/*.jade',
          '*.js',
          '*.json',
        ],
        tasks: ['default']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-task');

  grunt.registerTask('default', ['bower', 'copy', 'jade', 'wiredep']);
};
