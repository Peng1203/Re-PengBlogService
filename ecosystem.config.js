module.exports = {
  apps: [
    {
      name: 'blog_serve',
      script: 'pnpm',
      args: 'run start:prod',
      // instances: 'max', // 根据需求设置实例数量
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      // max_memory_restart: '1G',
      env: {
        // NODE_ENV: 'development',
        NODE_ENV: 'production',
      },
    },
  ],
};
