
# Dashboard Marics using Redis

## Requirement

- Shopping store has multiple categories
- Approx 10 million transaction happen on daily basis
- Dashboard components
 > Day wise metrics: Number of transactions
 > Day wise metrics: Number of category wise transactions
 > Day wise metrics: Total amount in sales
 > Day wise metrics: total amount in sales category wise
 > All the above metrics but store wise

## Prerequisite

- Node version 14.x.x
- Postgresql - DB
- Postman to test APIs
- Redis server

## Installation

Install application packages:

```sh
node install
```

To Run Application:
```sh
node server.js
```
- The above command start node server on http://localhost:3000/ 

## Routes list

 - http://localhsot:3000/dashboard/metrics
 - This api url fetch all dashboard matrics.

