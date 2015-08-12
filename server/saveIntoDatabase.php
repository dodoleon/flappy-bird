<?php
$con = mysql_connect("127.0.0.1","root","abc123");
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("bird", $con);
$name = $_GET["name"];
$score = $_GET["score"];

$result = mysql_query("SELECT * FROM bestscore WHERE name = '".$name."'");

if ($row = mysql_fetch_array($result))
{
	if ($row['score'] >= $score)
	{
		echo $row['score'];
	}
	else
	{
		$sql = "UPDATE bestscore
				SET score = ".$score."
				WHERE name = '".$name."'";
		if (!mysql_query($sql,$con))	
  		{
  			die('Error: ' . mysql_error());
  		}
		echo $score;
	}
}
else 
{
	$sql = "INSERT INTO bestscore (name, score) 
			VALUES ('".$name."', ".$score.")";
	if (!mysql_query($sql,$con))	 
  	{
  		die('Error: ' . mysql_error());
  	}
  	echo 0;
}
mysql_close($con);
?>
