var fs = require('fs');
var grunt_output_dir = process.env.WERCKER_OUTPUT_DIR || 'public/';

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
          grunt_output_dir + '/public_html/**.js',
          grunt_output_dir + '/public_html/**.html',
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
            dest: grunt_output_dir + '/public_html',
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
        dest: grunt_output_dir + '/public_html'
      },
      bootstrap: {
        expand: true,
        flatten: true,
        src: [
          'lib/bootstrap/bootstrap.css',
          'lib/bootstrap/bootstrap.js'
        ],
        dest: grunt_output_dir + '/public_html'
      },
      fontawesome: {
        expand: true,
        flatten: true,
        src: 'lib/font-awesome/font-awesome.css',
        dest: grunt_output_dir + '/public_html'
      },
      theme: {
        src: 'bower_components/bootstrap-theme-cirrus/dist/css/bootstrap.min.css',
        dest: grunt_output_dir + '/public_html/theme.css'
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
        dest: grunt_output_dir + '/public_html'
      }
    },
    execute: {
      create_config: {
        call: function(grunt, options, done) {
          if (process.env.CONFIG_JSON) {
            grunt.log.writeln("Using config from CONFIG_JSON env");
            var config_json = process.env.CONFIG_JSON;
          } else {
            grunt.log.writeln("Using config config.json-sample");
            var config_json = fs.readFileSync('./config.json-sample', {encoding: 'utf8'});
          }
          fs.writeFile(grunt_output_dir + '/config.json', config_json, {}, done);
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
  grunt.loadNpmTasks('grunt-execute');

  grunt.registerTask('default', ['bower', 'exec:install_composer', 'composer:main:install:optimize-autoloader', 'copy', 'execute:create_config', 'jade', 'wiredep']);
};
