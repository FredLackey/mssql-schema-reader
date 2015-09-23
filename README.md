# Microsoft SQL Server Schema Reader (mssql-schema-reader)
Retrieves schema layout from Microsoft SQL Server (aka "MSSQL") and persists to either JSON or file (or both).  LocalDb is not currently supported.

# Author & Usage #

Having written code for the Microsoft platform since the 80's, and deeply planted in the .NET world, I prefer the design tool provided by SQL Server Management Studio.  However, these days, more and more of my work in on NodeJS and the MEAN Stack.  The **Microsoft SQL Server Schema Reader** is just one more tool to help me bridge the gap.  This will eventually be at the heart of code generator focused on allowing me to *design* on the Microsoft platform but develop on any.  When the day comes in which another data modeling tool works as well as SQL Server's, I may completely jump ship.

Thanx,  
Fred Lackey  
[fred.lackey@gmail.com](mailto:fred.lackey@gmail.com "fred.lackey@gmail.com")

----

# Requirements #

This module has been tested with Microsoft SQL Server 2014.  According to the documentation of the underlying drivers, this module *should* work with Microsoft SQL Server 2000 and above.  Please drop me a quick email with your results if you choose to use it with any version *other than 2014*:  [fred.lackey@gmail.com](mailto:fred.lackey@gmail.com "fred.lackey@gmail.com")

# Limitations #

LocalDb is currently **not** supported.  The underlying driver uses the TDS Protocol which does not currently support LocalDb.  I will be happily enhance the project if you find a driver that *does* support LocalDb.  Just shoot me an email and let me know what you found.


# Installation #

The target platform is NodeJS, therefore the install command shall be...

    npm install --save mssql-schema-reader

# Files & Folders #

The contents of the project are as follows:

	/
	|--/lib							The "guts" of the module, of course.
	|--/samples						Sample files for your pleasure:
       |-- config.json.js			Config file used by the TDS driver.      
       |-- schema-info.json			Raw content pulled down from the server.      
       |-- schema-pretty.json		Schema file rendered from saved "info" file.
	   |-- TestDatabase20150922.sql	Script file used to create sample database.        
	|--/tests
	   |-- saveInfo.js				Simple test method used during development.        
	|--index.js						Main entry point of module.

# Usage & Limitations #


## Raw Data (Info Commands) ##

Several queries are executed against the SQL Server database to learn about the database schema.  This raw information is used by the schema parser, to create your pretty schema document, and may be stored for later offline use.  You should never have to look at these, but they are there if you would like to use them.

## Pretty Data (Schema Commands) ##

The raw data (from the info commands) are passed to the Schema Parser to create the schema object.  These are generally the commands you want to work with.

## Commands ##

**createConfig**  
Convenience method to help build a simple config object needed by the connection.  

> See the following page for more info on the Config object:  
> [www.npmjs.com/package/mssql#connection](http://www.npmjs.com/package/mssql#connection "www.npmjs.com/package/mssql#connection")

**info.fromServer** or **schema.fromServer**  
Retrieves the needed data from the server.  This data is *not* saved to disk.  The `info.` version will return raw data.  The `schema.` version will retrieve the hierarchical schema object.

**info.fromServerToDisk** or **schema.fromServerToDisk**  
Same as the `fromServer` commands, however the data *is* written to disk.  **The file at the target path will be overwritten.**

**info.fromDisk** or **schema.fromDisk**  
Retrieves the needed data from the disk.  The server is not contacted.

----

Last updated: 9/23/2015 6:05:00 PM   
