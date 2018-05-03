---
description: 'Talking about the framework, the story behind it and the philosophy.'
---

# Introduction

Idylle is a thin layer on top of two majors micro frameworks. [Express](http://expressjs.com/fr/) for the REST \| HTTP  part and [Socket.io](https://socket.io/) for the realtime.

Since few years, Javascript has become one of the major language for both front and backend applications. Lot's of server-side frameworks came in the market, [Loopback](http://loopback.io/), [Sails](https://sailsjs.com/), [Feathers](https://feathersjs.com/), [Nest](https://nestjs.com/), each of them with their philosophy, some focusing on developer productivity, others on the [Programming Paradigm](https://en.wikipedia.org/wiki/Programming_paradigm), other on the [Architecture](https://en.wikipedia.org/wiki/Software_architecture). 

Idylle wants to stay a micro framework by its lack of bundled functionality like :

* [Accounts](https://en.wikipedia.org/wiki/User_account), authentication, authorization, roles, etc.
* Database abstraction 
* Input validation and input sanitation.
* [Web template](https://en.wikipedia.org/wiki/Web_template) engine.

Not providing those feature out of the box doesn't mean you cannot find open source modules/tools avoiding you to redesign the wheel. It just means we think providing a framework doing everything is like having a 'God Class'. It could work, for a time, but the more you progress the less it becomes clear, ending with a black box that no one understand and no one wants to touch.

## The Story

This framework has been designed in 2016 because of the lack of choices in terms of lightweight frameworks. For sure there was [Express](http://expressjs.com/fr/), [Hapi](https://hapijs.com/), [Total.js](https://www.totaljs.com/) and all sorts of micro frameworks, but none of them where fitting with our expectations in terms of **Architecture**.

Mainly developed by one person \(so far\), it has been used by teams from different backgrounds, server-side developers, junior/seniors Web Front developers, seniors Android / iOS Developers. The main feedback is the "Steep learning curve". As long as you have the core concept of [Asynchronous programming](https://en.wikipedia.org/wiki/Asynchrony_%28computer_programming%29), [Javascript Promises](https://en.wikipedia.org/wiki/Futures_and_promises) and [Multitier architecture](https://en.wikipedia.org/wiki/Multitier_architecture), you are good to go! Everything else will seem really simple.

## The Philosophy

### Model Oriented \| Designed for Microservices

When Idylle has been designed it was after a major shift in our server side architecture. Even if we adopted CI/CD, and N-tier architecture, we wasn't really aware of more granular concepts like [Microservices](https://martinfowler.com/microservices/).

At the time we tried few frameworks \([Loopback.io](http://loopback.io/) and [Sails.js](https://sailsjs.com/)\) and even if we loved the concepts behind each, we felt like making a choice without a full commitment. 

When we designed Idylle it was \(and still is\) with the goal of providing the best tools for micro-services architectures.



