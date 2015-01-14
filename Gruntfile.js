var fs = require('fs');
var grunt_output_dir = process.env.WERCKER_OUTPUT_DIR || 'public/';
var config_json = process.env.CONFIG_JSON || fs.readFileSync('./config.json-sample', {encoding: 'utf8'});

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
          grunt_output_dir + '/web/**.js',
          grunt_output_dir + '/web/**.html',
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
            dest: grunt_output_dir + '/web',
            ext: '.html'
          }
        ]
      }
    },
    exec: {
      install_composer: {
        cmd: function() {
          var cmd = '';
          if (!fs.existsSync(__dirname + '/composer.phar')) {
            cmd = 'curl -sS https://getcomposer.org/installer | php'
          }
          return cmd;
        }
      }
    },
    composer: {
      options: {
        usePhp: true,
        composerLocation: 'composer.phar'
      },
      main: {}
    },
    copy: {
      jquery: {
        expand: true,
        flatten: true,
        src: [
          'bower_components/jquery/dist/jquery.min.map',
          'bower_components/jquery/dist/jquery.min.js',
        ],
        dest: grunt_output_dir + '/web'
      },
      bootstrap: {
        expand: true,
        flatten: true,
        src: [
          'lib/bootstrap/bootstrap.css',
          'lib/bootstrap/bootstrap.js'
        ],
        dest: grunt_output_dir + '/web'
      },
      fontawesome: {
        expand: true,
        flatten: true,
        src: 'lib/font-awesome/font-awesome.css',
        dest: grunt_output_dir + '/web'
      },
      theme: {
        src: 'bower_components/bootstrap-theme-cirrus/dist/css/bootstrap.min.css',
        dest: grunt_output_dir + '/web/theme.css'
      },
      composer: {
        expand: true,
        src: 'vendor/**',
        dest: grunt_output_dir + '/'
      },
      php: {
        src: 'src/*.php',
        expand: true,
        flatten: true,
        dest: grunt_output_dir + '/web'
      }
    },
    "file-creator": {
      "config": {
        'public/config.json': function(fs, fd, done) {
           fs.writeSync(fd, config_json);
           done();
        }
      }
    },
    watch: {
      default: {
        files: [
          'app/**.js',
          'app/**/*.jade',
          'src/*.php',
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
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-composer');
  grunt.loadNpmTasks('grunt-file-creator');

  grunt.registerTask('default', ['bower', 'exec:install_composer', 'composer:main:install:optimize-autoloader', 'copy', 'file-creator:config', 'jade', 'wiredep']);
};
