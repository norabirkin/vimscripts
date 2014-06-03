<div id="wrap-wrap-all">
    <div id="wrap-all">
        <div id="left-col">
            <?php echo $BeforeUserMenu; ?>
            <?php echo LBUserMenu::getInstance()->output(); ?>
            <?php if ($serviceFunctionWidgets) { ?>
            <div>
                <?php echo $serviceFunctionWidgets; ?>
            </div>
            <?php } ?>
        </div>
        <div id="wrap-right">
            <div id="right-col">
                <?php echo $clientInfo; ?>
            </div>
            <div id="content-center">
                <?php echo $BeforeContent; ?>
                <?php echo $ContentBegining; ?>
                <?php $this->widget('LB.widgets.BootAlert'); ?>
                <?php echo yii::app()->controller->HTMLBeforeTitle(); ?>
                <?php if ($this->getTitle()) { ?>
                <h1 class="page-title"><?php echo $this->getTitle(); ?></h1>
                <?php } ?>
                <?php if ($this->getDescription()) { ?>
                    <em><?php echo $this->getDescription(); ?></em>
                    <br/>
                    <br/>
                <?php } ?>
                <?php echo $content; ?>
            </div>
            <div class="clear-fix"></div>
        </div>
        <div class="clear-fix"></div>
    </div>
</div>
<div class="footer">
    <ul class="footer-menu">
<?php if( Yii::app()->params['menu_helpdesk'] ):?>
        <li class="footer-menu-item">
            <a class="footer-menu-link" href="<?php echo $this->createUrl('/support/index')?>">
                <?php echo Yii::t('main', 'Support') ?>
            </a>
        </li>
<?php endif;?>
<?php if( Yii::app()->params['menu_knowledges'] ):?>
        <li class="footer-menu-item">
            <a class="footer-menu-link" href="<?php echo $this->createUrl('/site/kb');?>">
                <?php echo Yii::t('main', 'KnowledgeBase') ?>
            </a>
        </li>
<?php endif;?>
    </ul>
    <div class="footer-copy">
        <br/>
        <?php echo Yii::app()->params['companyInfo']; ?>
        <?php $this->widget('UsageInfo'); ?>
    </div>
</div>
<div class="clear-fix"></div>
