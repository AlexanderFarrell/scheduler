#!/bin/zsh

cd .
echo "Starting Scheduler"
nohup redis-server > log-redis.txt &!
nohup npm start >> log1.txt &!