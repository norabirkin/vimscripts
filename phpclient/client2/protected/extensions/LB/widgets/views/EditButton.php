<?php echo $this->script; ?>
<a 
    title="<?php echo $this->title; ?>" 
    href="" 
    id="popup-edit-form-link-<?php echo $this->id; ?>" 
    class="popup-edit-form-link"
>
    <?php echo $this->image; ?>
</a>

<script type="text/javascript">new edit_form(
        "<?php echo $this->id; ?>",
        <?php echo $this->data; ?>,
        "<?php echo $this->route; ?>",
        "<?php echo $this->html; ?>",
        "<?php echo $this->hint; ?>");
</script>
