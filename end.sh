#!/bin/zsh

cd .
echo "Ending Scheduler"
kill -9 $(lsof -ti:8750)