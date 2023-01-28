# Microblog

A RESTful API for microbloging app using ASP.NET Core with SQL Server as database and JWT token for authentication.

<p align="center">
  <img src="https://i.imgur.com/p05RHJY.png" alt="Microblog API Diagram">
</p>

## Built With

* Visual Studio - IDE with .NET 7.0 runtime package
* ASP.NET Core Web API - Template for creating controller-based RESTful HTTP service.
* Dapper - ORM for .NET mapping an object-oriented domain model to database
* SQL Server - Relational database ...

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Install following program to local machine

* Visual Studio
* Microsoft SQL Server Management Studio

### Setup 

1. Open microblog.sln with Visual Studio.
2. Publish microblogDB project to SQL Server.
3. Setup microblogAPI user secret with following properties:
  ```json
  {
    "ConnectionStrings": {
      "Default": "<local database connection string>"

    },
      "SecretKey": "<16-digit secret key for token encryption",
      "Issuer": "<local server issuing token>",
      "Audience": "microblog"
  }
  ```
4. Run project and test with provided client app or other API platform

### HTTP Methods

|Methods |Endpoints|Functions| 
|-----|--------|------|
|POST|/api/login|User login|
|POST  |/api/register |User sign up|
|GET |/api/post|Get all post|
|GET |/api/post/user|Get all post from current user|
|POST |/api/post |Add new post|
|PUT |/api/post/{postid} |Update post|
|POST |/api/post/{postid}/like | Like post|
|DELETE |/api/post/{postid} | Delete post|

## Demo

Current demo deployed on Azure with <a href="https://azure.microsoft.com/en-us/products/app-service/">Azure App Service</a> to host API, <a href="https://azure.microsoft.com/en-us/products/azure-sql/">Azure SQL</a> for database, and <a href="https://azure.microsoft.com/en-us/products/storage/blobs">Azure Storage Account</a> for client static website. All user secrets stored in Azure App Service application setting with connection string type SQL Server connect to Azure SQL.

<a href="https://mushiemicroblog.z29.web.core.windows.net/"><strong>Launch demo »</strong></a>

<p align="center">
  <img src="https://i.imgur.com/8VfUZHO.png" alt="Microblog UI" max-width="480">
</p>

