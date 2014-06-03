<?PHP
/**
 * ����������� ��������������� ���������� �� ������ ���
 * HELP DOCUMENTATION
 *
 */

// ��������� ������ �������
ini_set("display_errors", false);
error_reporting(E_ALL^E_NOTICE); 

// �������� ����������� ������� � �����������
include_once('../localize.php');

// ������ ������ �� �����������
session_start();
if(!isset($_SESSION['auth'])) die("<h3 style='text-align: center; font-size: 12pt; color: red;'>Authorization required!</h3>");

// �������� GET ����������
if(!isset($_GET['dvsn']) || empty($_GET['dvsn']) || !isset($_GET['ID']) || empty($_GET['ID'])) die("<h3 style='text-align: center; font-size: 12pt; color: red;'>Empty query!</h3>");

$_GET['dvsn'] = preg_replace("/[\s\|\/\*\D\&]+/e","",$_GET['dvsn']);
$_GET['ID'] = preg_replace("/[\s\|\/\*\&]+/e","",$_GET['ID']);

readfile("../help/".$_GET['dvsn']."/".$_GET['ID'].".html") || die("<h3 style='text-align: center; font-size: 12pt; color: red;'>No data found!</h3>");

/**
 * ������� ��������
 *
 */
function debug(&$_arr)
{
      echo "<pre>";
      print_r($_arr);
      echo "</pre>";
}

?>