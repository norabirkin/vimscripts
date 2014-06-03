<form<?php if ($action) {
?> action="<?php echo $action; ?>"<?php }
?><?php if ($method) {
?> method="<?php echo $method; ?>"<?php }
?><?php if ($id) {
?> id="<?php echo $id; ?>"<?php }
?><?php if ($file) {
?> enctype="multipart/form-data"
<?php } ?>>
<?php if ($items) {?>
<table >
<?php echo $items; ?>
</table>
<?php } ?>
<?php echo $hidden; ?>
</form>
