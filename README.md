# Commons API - Rebuild

## CURRENTLY VERY MUCH NOT READY

#### In the process of rebuilding the original Ruby on Rails backend using Node.js, GraphQL and PostgreSQL.

#### Up-to-date information and notifications about bills in progress in Canada's parliament.

![Commons App](./docs/commons-readme.png)

## API Server for the Commons App

Commons aims to provide an easy to access source of information on current bills in session in Canada's federal parliament. The application sources data from various sources and serves it up to users in one easy to use location.

The goal is to provide Canadians with an easy way to keep up to date with the goings on in parliament and engage with their government representatives. The information aggregated by the app is sourced from various public government websites.

Bills are updated daily and sorted by category on the server. Users can select between email and SMS notifications for any bills they wish to follow and will receive daily updates if there are any new events for those bills.

The application also provides an easy way to look up Members of Parliament and retrieve their contact information.

## Behaviour

The server updates once every 24 hours from a variety of government data sources and pulls the latest bill and event data from them, then updates the data via a web based machine learning classification service. It then send notifications on those bills to all subscribed users.

# Stack

- [Node.js 12.16.1](https://nodejs.org/en/)
- [Express 4.17.0](https://expressjs.com/)
- [GraphQL 14.6.0](https://graphql.org/)
- [PostgreSQL 12.2](https://www.postgresql.org/)

## Testing

- [Jest 25.1.0](https://jestjs.io/)

## Cloud Hosting

- [Amazon EC2](https://aws.amazon.com/ec2/)

## Classification

The app uses the uClassify machine learning web service to classify bills.

- [uClassify](https://www.uclassify.com/)

## Notifications

Notifications are sent out using the following web services:

- [Twilio](https://www.twilio.com/)
- [SendGrid](https://sendgrid.com/)

### API Server

#### _The front end of the app is hosted on a separate repo._

#### [Git Repo for the Commons App](https://github.com/fgfl/commons)

### Website URL

### _COMING SOON_

### Team Members

- [Frederick Lee](https://github.com/fgfl/)
- [Mitch Lum](https://github.com/mxmitch)
- [Pascal van Leeuwen](https://github.com/Commoddity/)

### Setup

- install `yarn`
- run `yarn install`
- in psql, create a database and fill the relevant info into a .env file (use .env.example as a template)

### Database Reset

During development it may be necessary to reset the database. If so, run:
yarn run db:reset
