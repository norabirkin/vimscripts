<div id="welcome">
    <div>
        <p>
            <?php echo $description; ?>
            <br/>
        </p>
        <h4 style="margin-top: 15px;">
            <?php echo Yii::t('main', 'License Agreement'); ?>
        </h4>
        <fieldset>
            <div style="height: 120px; overflow: scroll; overflow-x:hidden; border: 1px solid gray; padding: 5px;">
                <pre><?php echo $copyright; ?></pre>
            </div>
        </fieldset>
        <br/>
        <div style="line-height: 18px;">
            <?php echo yii::t('main', 'I agree with terms'); ?>
            <input id="lbantivirus_confirm_agreecheckbox" type="checkbox" />
        </div>
        <br/>
        <?php echo $form; ?>
    </div>
</div>
