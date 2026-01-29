module.exports = {
  apps: [
    {
      name: 'lelanation-backend',
      script: 'npm',
      args: 'run start',
      cwd: '/home/ubuntu/prod/Lelanation/backend',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3500
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3500
      },
      // Configuration de redémarrage
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s',
      
      // Logs
      log_file: '/home/ubuntu/prod/Lelanation/backend/logs/combined.log',
      out_file: '/home/ubuntu/prod/Lelanation/backend/logs/out.log',
      error_file: '/home/ubuntu/prod/Lelanation/backend/logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Monitoring
      monitoring: true,
      
      // Configuration avancée
      kill_timeout: 5000,
      listen_timeout: 3000,
      wait_ready: true,
      
      // Variables d'environnement spécifiques
      env_production: {
        NODE_ENV: 'production',
        PORT: 3500
      }
    }
  ],

  // Configuration de déploiement (optionnel)
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/lelanation.git',
      path: '/home/ubuntu/prod/Lelanation',
      'post-deploy': 'cd backend && npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
}
