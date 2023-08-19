<p align="center">
  <img src="https://cdn.iconscout.com/icon/free/png-256/free-meteor-3273589-2741632.png" width="150" alt="Mrteor" />
</p>
# Meteor App Server

## Description
This is the backend to support the Meteor App UI.

## Table of Contents
- [Design Decisions](#design-decisions)
  - [Assumptions](#assumptions)
  - [Caching](#caching)
  - [Data Storage](#data-storage)
  - [Pagination](#pagination)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Testing](#test)

## Design Decisions

### Assumptions
1. Data set is finite and small, containing only 1000 records.

### Caching
For caching, we utilized the `cache-manager` library to naively cache each HTTP call using the URL as the key. This decision was made for simplicity and ease of implementation.

However, a more advanced caching system could be beneficial for larger scenarios. Systems like Redis or other in-memory caching solutions could provide better performance. They would permit caching of query results and introduce more optimization opportunities.

### Data Storage
The dataset, being small and finite, is stored as a JSON data structure for demonstration purposes. In more scalable scenarios, a relational DB would be more appropriate. A potential SQL data model might be:

```sql
CREATE TABLE meteorites (
    meteorite_id INT PRIMARY KEY,
    name VARCHAR(255),
    nametype VARCHAR(255),
    recclass VARCHAR(255),
    mass FLOAT,
    fall VARCHAR(255),
    year DATETIME
);
```

Using a relational database would provide benefits like caching, offsetting, relationships, and lookups. Still, given our dataset's size, the JSON structure should perform adequately.

### Pagination
Given our primary assumption and the choice against a relational DB, pagination is straightforward. We slice the dataset and offset results based on the requested page.

## Installation

```bash
$ npm install
```

## Running the App Locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Running the App Docker

```bash
# build the container
$ docker build -t meteor-server .

# run the container
$ docker run -p 3001:3001 meteor-server
```

## Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```