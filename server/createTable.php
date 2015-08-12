<?php
$con = mysql_connect("127.0.0.1","root","abc123");
if (!$con)
  {
  die('Could not connect: ' . mysql_error());
  }

// Create database
if (mysql_query("CREATE DATABASE bird",$con))
  {
  echo "Database created";
  }
else
  {
  echo "Error creating database: " . mysql_error();
  }

// Create table in my_db database
mysql_select_db("bird", $con);
$sql = "CREATE TABLE bestscore
(
name varchar(15) PRIMARY KEY,
score int DEFAULT 0
)";
if (!mysql_query($sql,$con))
{
	echo mysql_error();
}
	

$sql = "CREATE TABLE user
(
name varchar(15) PRIMARY KEY,
pwd varchar(15) NOT NULL
)";
if(mysql_query($sql,$con))
{
	echo mysql_error();
}


mysql_close($con);
?>