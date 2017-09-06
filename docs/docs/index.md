# Introduction
[![Build Status](https://travis-ci.org/Digipolitan/idylle.svg?branch=master)](https://travis-ci.org/Digipolitan/idylle)
[![npm version](https://badge.fury.io/js/idylle.svg)](https://badge.fury.io/js/idylle)
[![dependencies status](https://david-dm.org/julien-sarazin/Idylle.svg)](https://david-dm.org/julien-sarazin/Idylle.svg)
[![Test Coverage](https://codeclimate.com/github/Digipolitan/idylle/badges/coverage.svg)](https://codeclimate.com/github/Digipolitan/idylle/coverage)

### Why another framework ?
Original team members behind Idylle come from different backgrounds like Front-End developers, Native Mobile Developers (iOS/Android), NodeJS lovers, PhP, J2EE, ...
We had different experiences with web framework like RoR, Spring Boot, Loopback, Sails, Meteor, Express..

So far we found that the choices were limited in two directions :  

  - either you choose a pretty big one like sails or loopback, which both have really intresting features but comes with a learning cost, meaning as soon as you want to do something specific that doesn't fit with their philosophy, you will need to have a full understanding of all concepts related to the framework you chose.

  - either you choose a small one, routing based, like express, hapi, restify, which are extremly fexible, where you can do pretty much anything you want, the way you want, but comes with a low productivity ratio since you will have to write much more boilerplate code.

Our Goal is to offer to the community a flexible micro framework that have a minimal learning curve with a great productivity ratio.
Meaning you can do a lot within only few hours and the more you will use it, the more you will be able to do things, do it quickly, **in your way**.

We want the framework to be accessible for junior developers.
Actually we have interns with less than 6 months of javascript development that work with Idylle every day to develop micro services with reasonable business logic
and we are constantly asking for feedbacks to bring the most flexible architecture without increasing the usage complexity.

### Roadmap

* [x] Make the `CriteriaBuilder` injectable.
* [x] Make the `ErrorHandler` injectable.
* [x] Make the `CacheHandler` injectable.
* [x] Make the `ResponseHandler' injectable.
* [ ] Update the cache system.
    * [ ] Update the 'Tag' system with something more powerfull (regex?)
    * [ ] Add cache meta information on data used by the system
* [ ] Add a Puggable Messaging system
    * [ ] Provide default connectors
        * [ ] AMQP
        * [ ] MQTT
    * [ ] Add a messaging router
* [ ] Add a command line interface to ease redudant tasks
    * [x] create a project
    * [ ] generate CRUD for a given Model
