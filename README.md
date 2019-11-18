# Expiration date manager

The easy, intuitive and efficient way to manage a shared food inventory - WIP

[![Build Status](https://travis-ci.com/Bernd-L/exDateMan.svg?branch=master)](https://travis-ci.com/Bernd-L/exDateMan) ![Dependencies](https://img.shields.io/librariesio/github/Bernd-L/exDateMan.svg) [![Coverage](https://img.shields.io/codeclimate/coverage/Bernd-L/exDateMan.svg)](https://coveralls.io/repos/github/Bernd-L/exDateMan/badge.svg?branch=master) [![Maintainability](https://api.codeclimate.com/v1/badges/31fda3a4f5da42590f46/maintainability)](https://codeclimate.com/github/Bernd-L/exDateMan/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/31fda3a4f5da42590f46/test_coverage)](https://codeclimate.com/github/Bernd-L/exDateMan/test_coverage) ![Badges Count](https://img.shields.io/badge/badges-not%20enough-orange.svg)

## Contents

- [Expiration date manager](#expiration-date-manager)
  - [Contents](#contents)
  - [Description](#description)
  - [Features](#features)
  - [Technologies used](#technologies-used)
  - [License](#license)

## Description

ExDateMan (short for "Expiration date manager") is a offline-capable, installable [PWA](https://developers.google.com/web/progressive-web-apps).

It's goal is to provide a simple and intuitive way for people to manage their shared food inventories, allowing them to give read or write access to their inventories.

The items in such an inventory are referred to as "Things", of which each inventory can have multiple. However, they themselves don't actually represent the presence of them in the inventory. Instead, "Stocks" represent the individual instances of the Things in an inventory. They each have an expiration date and get removed from the inventory, after they are removed from the physical inventory.

Designed to be deployed in a [cloud-native](https://github.com/cncf/toc/blob/master/DEFINITION.md) environment, it uses a Postgres database to store its data in an event-sourced fashion, meaning it simply stores events, and only derives the current state form that. This allows one to retroactively view the state of the data from some time ago. This is often also referred to as [CQS](https://en.wikipedia.org/wiki/Command%E2%80%93query_separation).

A Docker image will be available in the future.

## Features

- Offline capable
- PWA compliant
- Synchronization
- Multi-user capable
- Rights management
- Event sourced data store (CQS)
- Support for occasionally connected devices
- Access management per inventory
- "Things" can be defined in inventories
- Categories can be defined for things
- Every physical item has its expression date stored

## Technologies used

The application consists of a Frontend and a Backend.

The frontend is implemented in [Angular](https://angular.io)

## License

Licensed under the GNU AGPL version 3 license.

Copyright (c) 2018-2019 Bernd-L.
All rights reserved.
