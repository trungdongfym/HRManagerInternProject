module.exports = {
  apps: [{
    name: 'HRManagement',
    script: "./src/app.ts",
    exec_mode: "cluster",
    env_dev: {
      NODE_ENV: "dev"
    }
  }],
  deploy: {
    develop: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/main',
      repo: 'https://github.com/trungdongfym/HRManagerInternProject.git',
      path: 'DESTINATION_PATH',
      env_dev: {
        NODE_ENV: 'dev',
      },
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
