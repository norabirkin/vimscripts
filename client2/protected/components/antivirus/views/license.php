<br/>
<div><?php 
$titleFromThemeConfig = MainTemplateHelper::GetInstance()->GetTheme()->getAntivirusModuleParams();
echo CHtml::link(yii::t('antivirus', $titleFromThemeConfig['license']), $url, array(
    'target' => '_blank'
)); 
?></div>
<div style="line-height: 18px;">
    <?php echo yii::t('main', 'I agree with terms'); ?>
    <input id="lbantivirus_confirm_agreecheckbox" type="checkbox" />
</div>
<br/>
