#!/bin/bash
# PRAXIS startup script for EC2
# Sources .env from repo root (written by deploy with DATABASE_URL from SSM)
set -a
source /home/ec2-user/praxis/.env
set +a
exec node /home/ec2-user/praxis/server/node_modules/tsx/dist/cli.mjs \
  /home/ec2-user/praxis/server/src/index.ts
