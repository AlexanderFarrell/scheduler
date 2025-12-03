FROM postgres:17

RUN mkdir /docker-entrypoint-initdb.d/core
RUN mkdir /docker-entrypoint-initdb.d/planner
RUN mkdir /docker-entrypoint-initdb.d/project
RUN mkdir /docker-entrypoint-initdb.d/project/resources

COPY ./*.sql /docker-entrypoint-initdb.d/
COPY ./core/*.sql /docker-entrypoint-initdb.d/core
COPY ./planner/*.sql /docker-entrypoint-initdb.d/planner
COPY ./project/*.sql /docker-entrypoint-initdb.d/project
COPY ./project/resources/*.sql /docker-entrypoint-initdb.d/project/resources

RUN chown -R postgres:postgres /docker-entrypoint-initdb.d