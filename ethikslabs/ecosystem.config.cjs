// PM2 ecosystem config for PRAXIS on EC2
// Env vars injected at deploy time — DATABASE_URL loaded from SSM
module.exports = {
  apps: [{
    name: 'praxis',
    script: '/home/ec2-user/praxis/server/node_modules/tsx/dist/cli.mjs',
    interpreter: 'node',
    args: '/home/ec2-user/praxis/server/src/index.ts',
    cwd: '/home/ec2-user/praxis',
    exec_mode: 'fork',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: '3100',
      NODE_TLS_REJECT_UNAUTHORIZED: '0',
      // DATABASE_URL injected by deploy script from SSM
    },
    restart_delay: 5000,
    max_restarts: 10,
    autorestart: true,
  }]
};
