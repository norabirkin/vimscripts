<div class="partition">
    <?php foreach ($items as $item) { ?>
            <h2>
            <?php if ($item['link']) { echo $item['link']; } else { ?>
                <a href="<?php echo $item['url']; ?>"><?php echo $item['title']; ?></a>
            <?php } ?>
            </h2>
            <?php if ($item['description']) { ?>
            <p><?php echo yii::t('main', $item['description']); ?></p>
            <?php } ?>
    <?php } ?>
</div>
