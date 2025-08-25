# Appium Test Automation with NestJS

This project is an API built with NestJS for automating tests on mobile devices using Appium. It provides endpoints to run tests on specified devices with customizable parameters.

## Table of Contents

- [Features](#features)

- [Technologies Used](#technologies-used)

- [Installation](#installation)

- [Environment Variables](#environment-variables)

- [Running the Application](#running-the-application)

- [API Documentation](#api-documentation)

- [Example Request](#example-request)

- [License](#license)

---

## Features

- JWT and API Key-based authentication for secure access.

- Run Appium test scripts on specific devices and ports.

- Supports inline and file-based scripts.

- Conditional validation for flexible request parameters.

## Technologies Used

- **NestJS** - A progressive Node.js framework.

- **Appium** - For cross-platform mobile test automation.

- **Swagger** - API documentation and testing.

- **JWT Authentication** - Secures endpoints with bearer tokens.

- **Class-validator** - For validating request DTOs.

---

## Installation

### Prerequisites

- **Node.js** and **npm**: Make sure you have Node.js installed. You can download it from [Node.js website](https://nodejs.org/).

- **adb**: Required to get the list of android devices connected.
- **libimobiledevice**: Required to get the list of ios devices connected.
- **JRE**: Required Java Runtime Environment (JRE) installed on your system for generating allure report.

- **Appium Server**: Ensure you have an Appium installed via npm globally:

```bash

npm install -g appium

appium driver install uiautomator2
appium driver install xcuitest

npm install -g allure-commandline

```

### Steps

## Clone the repository:

```bash

git  clone  <repository-url>

cd  appium-node

```

## Install dependencies:

```bash

npm  install

```

---

### Environment Variables

```bash

Create  an  .env  file  at  the  project  root  and  configure  your  environment  variables  from  the  resources  folder.

```

---

### Running the Application

```bash

npm  run  start

```

### Running in Development Mode

```bash

npm  run  start:dev

```

---

### API Documentation

The API documentation is available at http://localhost:3000/docs. It provides detailed information on each endpoint, including required parameters, example requests, and responses.

## Authentication

1. JWT: Pass the token in the Authorization header as Bearer <token>.

2. API Key: Pass the API key in the X-API-KEY header.
