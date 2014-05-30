<?php $this->widget('LB.widgets.BootAlert'); ?>

<div class="main-content">
    <h1 class="step_title"><?php echo $title; ?></h1>
    <div class="image steps step-<?php echo $step; ?>-of-5" title="Шаг <?php echo $step; ?> из 4"></div>
    <?php if($description) { ?><div class="description_steps"><?php echo $description; ?></div><?php } ?>
    <?php if($header) { ?><h4><?php echo $header; ?></h4><?php } ?>
    <?php echo $content; ?>
</div>
