<dt>
    <?php echo $method; ?> 
    <strong><?php echo $route; ?></strong> - 
    <em><?php echo $descr; ?></em>
</dt>
<dd>
<?php
if ($params) {
?>
    <p><strong>Параметры:</strong></p>
    <ul>
<?php
foreach ($params as $param) {
?>
        <li><?php echo $param; ?></li>
<?php
}
?>
    </ul>
<?php
}
?>
    <p>
        <strong>Метод: </strong>
        <?php echo $actionmethod; ?>
    </p>
</dd>
