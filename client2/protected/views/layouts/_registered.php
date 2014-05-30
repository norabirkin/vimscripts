<div class="content-wrapper">
    <span class="cwmg c15">
        <span class="ctl"></span>
        <span class="ctr"></span>
        <!--<span class="cbl"></span>-->
        <span class="cbr"></span>
    </span>
    <div class="sidebar">
        <?php echo $BeforeUserMenu; ?>
        <?php echo LBUserMenu::getInstance()->output(); ?>
        <?php if ($serviceFunctionWidgets) { ?>
        <div class="content-aside-plain">
            <?php echo $serviceFunctionWidgets; ?>
        </div>
        <?php } ?>
    </div>
    <?php echo $BeforeContent; ?>
    <div class="content">
        <?php echo $ContentBegining; ?>
        <div class="content-aside-wrap">
            <?php echo $clientInfo; ?>
            
        </div>
        <?php $this->widget('LB.widgets.BootAlert'); ?>
        <?php if ($this->getTitle()) { ?>
        <h1><?php echo $this->getTitle(); ?></h1>
        <?php } ?>
        <?php if ($this->getDescription()) { ?>
            <em><?php echo $this->getDescription(); ?></em>
            <br/>
            <br/>
        <?php } ?>
        <?php echo $content; ?>
        <span class="clg2w c15">
            <span class="ctl"></span>
            <span class="ctr"></span>
            <span class="cbl"></span>
            <span class="cbr"></span>
        </span>
        <div class="loading-screen">
            <div class="loader-icon">
                <img src="<?php echo Yii::app()->theme->baseUrl;?>/i/ajax-loader.gif" alt="">
            </div>
            <span class="clg2w c15">
                <span class="ctl"></span>
                <span class="ctr"></span>
                <span class="cbl"></span>
                <span class="cbr"></span>
            </span>
        </div>
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
