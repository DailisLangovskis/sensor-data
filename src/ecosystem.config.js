module.exports = {
  apps: [{
    name: 'main',
    script: process.env.NODE_ENV == 'development' ?
      'node_modules/.bin/webpack-dev-server' :
      'node_modules/http-server/bin/http-server',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: process.env.NODE_ENV == 'development' ?
      '--config src/webpack.dev.js' :
      `./static -p ${process.env.HTTP_PORT}`,
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  },
  {
    name: 'proxy',
    script: 'src/proxy.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
