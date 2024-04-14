module.exports = {
  apps: [
    {
      name: 'blog-serve-nest:3000',
      script: 'dist/main.js',
      // instances: 'max', // 根据需求设置实例数量
      exec_mode: 'cluster',
      autorestart: true,
      watch: true,
      // max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
        // NODE_ENV: 'production',
      },
    },
  ],
};
