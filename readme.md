# Scheduler 1

Scheduler is the first version of the planner, wiki and portfolio tool I personally use. It runs as a full stack application, and supports docker!

![Projects](Dev/Screenshots/project.jpg)

# Get Started

Scheduler 1 can be configured by:

- Running in Docker
- Running manually

## Running in Docker

A [docker-compose.yml](./Dev/docker-compose.yml) file is available for deploying automatically in Docker Compose or Swarm.

To deploy:

```bash
cd Dev

# If you haven't already initialized docker swarm
docker swarm init 

# Deploy the stack
docker stack deploy -c docker-compose.yml scheduler1
```

This docker-compose file runs the frontend on port 16789. If you were running locally, you can reach at http://localhost:16789

## Manual Setup

Manual set up involves the following:

1. Setting up a Redis Server for Session Management
2. Setting up a postgres database, seeding it with Data/init.sql
3. Running the application with npm start

Scripts for ease of starting and stopping the Redis server have been included in end.sh, start.sh and restart.sh

# Screenshots

Planner
![Planner](Dev/Screenshots/planner.jpg)

Portfolios
![Portfolio Screenshot](Dev/Screenshots/portfolio.jpg)

Wiki and Projects
![Wiki and Projects](Dev/Screenshots/project_documents.jpg)

Personal wiki hooked up to projects
![Personal Wiki](Dev/Screenshots/wiki.jpg)

# Disclaimer

Zealot Source Code is made available on GitHub and is Copyright 2023-2025 by Alexander Farrell. While this code is made avaiable here on GitHub, I must say that by using or deploying, you agree that you do so at your own risk. 

This application is not intended to give business or financial advise of any kind. While it contains modules for such, this was at one point for my own personal use, and you are responsible for any damages with using them. 

At some point, this might be made open source. But this is an older project that I'd like to share the code from.