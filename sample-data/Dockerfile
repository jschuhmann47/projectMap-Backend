FROM pkosiec/mongo-seeding:latest

WORKDIR /data-import/sample-data

# Copy your project (import data and all dependencies have to be there)
COPY /sample-data/models /data-import/models
COPY /sample-data .
COPY /sample-data/tsconfig.json .

# Install external dependencies
RUN npm install

# Set environmental variables
ENV DB_NAME project
ENV DB_PORT 27016
ENV DROP_DATABASE true
ENV REPLACE_ID true

# Set default workdir to simplify running the image
WORKDIR /data-import/sample-data/data
