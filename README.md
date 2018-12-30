# Library Management System
***
Provide a user friendly system to track and manage books and their associated information in a library.

Throughout the project the focus has been on presenting information in an easy and intelligible manner. The project is very useful for tracking books in library.

## Feature
***
* Different logins for students and admins.
* Admin can access the following features:
	1. Add and update books.
	2. Generate barcode for books.
	3. Issue and return books.
	4. Calculate and collect fine.
* Users can access the following features:
	1. Search for books and see their availability.
	2. See list of books borrowed and get notified of their due date.
	3. View their profile.
	4. Find out fine to be paid

## Setup
***
Download and extract the project repository. Install all the software requirements.

To import the library database open mysql and use command

    $ mysql -u username -p database_name < library.sql
After importing database create a user “developer” identified by password “password” and grant all permission on library database.

    > CREATE USER ‘developer’@’localhost’ IDENTIFIED BY 'password';
    > GRANT ALL PRIVILEGES ON library.* To ‘developer’@’localhost’;
Install all the packages using command

    $ npm install
Now everything is set and you are ready to go. Run node server by

    $ node server/app.js

## Future
***
These features are yet to be implemented

* Password encription.
* Generate library card for students.
* Locate books in library.

