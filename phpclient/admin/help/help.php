<?PHP
/**
 * Отображение вспомогательной информации по работе АСР
 * HELP DOCUMENTATION
 *
 */

// Настройка уровня отладки
ini_set("display_errors", false);
error_reporting(E_ALL^E_NOTICE); 

// Загрузка необходимых функций и локализаций
include_once('../localize.php');

// Доступ только по авторизации
session_start();
if(!isset($_SESSION['auth'])) die("<h3 style='text-align: center; font-size: 12pt; color: red;'>Authorization required!</h3>");

// Проверка GET параметров
if(!isset($_GET['dvsn']) || empty($_GET['dvsn']) || !isset($_GET['ID']) || empty($_GET['ID'])) die("<h3 style='text-align: center; font-size: 12pt; color: red;'>Empty query!</h3>");

$_GET['dvsn'] = preg_replace("/[\s\|\/\*\D\&]+/e","",$_GET['dvsn']);
$_GET['ID'] = preg_replace("/[\s\|\/\*\&]+/e","",$_GET['ID']);

readfile("../help/".$_GET['dvsn']."/".$_GET['ID'].".html") || die("<h3 style='text-align: center; font-size: 12pt; color: red;'>No data found!</h3>");

/**
 * Отладка массивов
 *
 */
function debug(&$_arr)
{
      echo "<pre>";
      print_r($_arr);
      echo "</pre>";
}

?>