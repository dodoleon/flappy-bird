<?php
session_start();
$con = mysql_connect("127.0.0.1","root","abc123");
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}

mysql_select_db("bird", $con);
$name = $_POST["name"];
$pwd = $_POST["password"];
$result = mysql_query("SELECT * FROM user WHERE name = '".$name."'AND pwd = '".$pwd."'");

if ($row = mysql_fetch_array($result))
{
	header("refresh:3;url=../game.html");
	echo $_SESSION['name'];
	echo "<br>登录成功<br>";
	echo "三秒后自动跳转";
	$_SESSION['name']=$name;

}
else
{
	header("refresh:3;url=../index.html");
	echo "账号密码错误<br>";
	echo "三秒后自动跳转";
}
mysql_close($con);
?>
<html>
<body>

</body>
</html>


