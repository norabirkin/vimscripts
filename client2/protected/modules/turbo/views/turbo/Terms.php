<?php
    $this->pageTitle = Yii::app()->name.' - '.Yii::t('TurboModule.Turbo', 'Turbo terms and conditions');
    $next = true;
    
    ?>
<div id="welcome">
    <?php echo CHtml::beginForm($this->createUrl("turbo/Step1")); ?>
        <fieldset>
        <h2><?php echo Yii::t('TurboModule.Turbo', 'Turbo terms and conditions');?></h2>
        <div>
            <p>
                <?php
                 $us_description = $this->module->basePath.'/description.txt';
            		if (file_exists($us_description))
						echo CHtml::encode(file_get_contents($us_description));
                ?><br>
            </p>

            <?php
            $copyright = $this->module->basePath.'/'.$copyright_file_name.'.txt';
            if (file_exists($copyright)):
            ?>
            <h3 style="margin-top: 15px;"><?php echo Yii::t('TurboModule.Turbo', 'License Agreement'); ?></h3>
                <fieldset>
                    <div style="height: 120px; overflow: scroll; overflow-x:hidden; border: 1px solid gray; padding: 5px;">
                        <?php echo '<pre>'.CHtml::encode(file_get_contents($copyright)).'</pre>';?>
                    </div>

                <?php if ($next === true) : ?>
                <div class="note" style="text-align: center;"><?php echo Yii::t('TurboModule.Turbo', 'By clicking Start, you agree to the terms stated in the License Agreement above.'); ?></div>
                <?php endif; ?>
                </fieldset>
            <?php endif;?>

            <?php if ($next === true) : ?>
            <?php echo CHtml::hiddenField('license', 1);?>
            <?php echo CHtml::submitButton(Yii::t('TurboModule.Turbo', 'Start'),array('tabindex'=>1)); ?>&nbsp;&nbsp;
            <?php endif; ?>
            <a href="<?php echo $this->createUrl('/account/index');?>"><?php echo Yii::t('TurboModule.Turbo', 'Return to the main page') ?></a>


        </div>
        </fieldset>
    <?php echo CHtml::endForm(); ?>
</div>