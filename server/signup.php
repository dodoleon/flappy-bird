<?php
$con = mysql_connect("127.0.0.1","root","abc123");
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("bird", $con);
$name = $_POST["name"];
$pwd = $_POST["password"];
$result = mysql_query("SELECT * FROM user WHERE name = '".$name."'");

if ($row = mysql_fetch_array($result))
{
	header("refresh:3;url=../index.html");
	echo "用户已经存在<br>";
	echo "三秒后自动跳转";
	exit();
} 
else
{
	$sql = "INSERT INTO user (name, pwd) VALUES ('".$name."', '".$pwd."')";
	if (!mysql_query($sql,$con))	
  	{
  		echo mysql_error();
  	}
  	else 
  	{
  		header("refresh:3;url=../index.html");
		echo "注册成功<br>";
		echo "三秒后自动跳转";
		exit();
  	}
}
mysql_close($con);
?>