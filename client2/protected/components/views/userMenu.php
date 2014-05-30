<div class="sidebar-nav">
    <div class="sidebar-nav-title"><strong><?php echo Yii::t('menu', 'ClientAccount') ?></strong></div>
    <ul class="sidebar-nav-menu">
        <li class="nav-menu-item">
            <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/account/index')?>">
                <?php echo Yii::t('menu', 'MyAccounts') ?>
            </a>
        </li>

        <?php if(Yii::app()->params['menu_services']): ?>
            <!--<li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php //echo Yii::app()->createUrl('/services/index')?>">
                    <?php //echo Yii::t('Menu', 'Tarifs and services') ?>
                </a>
            </li>-->

            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/services')?>">
                    <?php echo Yii::t('menu', 'TarifsAndServices') ?>
                </a>
            </li> 

        <?php endif;?>

        <?php if(Yii::app()->params['menu_promo']): ?>
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/promo')?>">
                   <?php echo Yii::t('menu', 'Promo') ?>
                </a>
            </li>
        <?php endif;?>

        <?php if(Yii::app()->params['menu_payments']): ?>
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/payment')?>">
                    <?php echo Yii::t('menu', 'Payments') ?>
                </a>
            </li>
        <?php endif;?>

        <?php if(Yii::app()->params['menu_documents']): ?>
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/documents');?>">
                    <?php echo Yii::t('menu', 'Documents') ?>
                </a>
            </li>
        <?php endif;?>

        <?php if(Yii::app()->params['menu_statistic']): ?>
            <!--<li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/history')?>">
                    <?php echo Yii::t('Menu', 'Statistics') ?>
                </a>
            </li>-->
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/statistics')?>">
                    <?php echo Yii::t('menu', 'Statistics') ?>
                </a>
            </li>
        <?php endif;?>
	<?php if( yii::app()->params["shared_posts_history"] ) { ?>
	<li class="nav-menu-item">
		<a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('account/sharedposts');?>">
			<?php echo yii::t( 'account', 'SharedPostsHistory' ); ?>
		</a>
	</li>
	<?php } ?>
        <?php if(Yii::app()->params['menu_helpdesk']): ?>
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/support')?>">
                    <?php echo Yii::t('menu', 'Support') ?>
                </a>
            </li>
        <?php endif;?>
        
        <?php if ($rentSoftAvailable) { ?>
        <li class="nav-menu-item">
                    <a class="nav-menu-link" href="<?php echo yii::app()->createUrl('RentSoft/default/index'); ?>"><?php echo yii::t('menu','RentSoft'); ?></a>         
        </li>
        <?php } ?>
        <?php if (yii::app()->params['menu_zkh']) { ?>
        <li class="nav-menu-item">
                    <a class="nav-menu-link" href="<?php echo yii::app()->createUrl('zkh/index'); ?>"><?php echo yii::t('ZKH','Header'); ?></a>         
        </li>
		<?php } ?>
        <?php if(Yii::app()->params['menu_television']): ?>
        <?php if(count($links) > 0) { ?>
                <li class="nav-menu-item">
                    <a class="nav-menu-link normal-cursor"><?php echo yii::t('menu','Television'); ?></a>
                    <ul class="sidebar-nav-submenu">
                    <?php foreach ($links as $link) {
                        print '<li class="nav-submenu-item">' . $link . '</li>';
                    } ?>
		    	<li class="nav-submenu-item"><?php echo CHtml::link(yii::t('tariffs_and_services','AdditionalServices'), array('/DTV/Additional')); ?></li>
                    </ul>
                </li>
        <?php } else { ?>
        		<li class="nav-menu-item">
                    <a class="nav-menu-link" href="#"><?php echo yii::t('menu','Television'); ?></a>
                    <ul class="sidebar-nav-submenu">
        				<li class="nav-submenu-item"><?php  echo CHtml::link(yii::t('menu','TVConnection'),array('/DTV/')); ?></li>
		    			<li class="nav-submenu-item"><?php echo CHtml::link(yii::t('tariffs_and_services','AdditionalServices'), array('/DTV/Additional')); ?></li>
        			</ul>
                </li>
        <?php } ?>
        <?php endif; ?>

        <?php if(Yii::app()->params['menu_settings']): ?>
            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/account/settings');?>">
                    <?php echo Yii::t('menu', 'Settings') ?>
                </a>
            </li>
        <?php endif;?>
        
        <?php if(Yii::app()->params['menu_antivirus']): ?>
       	 	<li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/Antivirus/default/index');?>">
                    <?php echo Yii::t(Antivirus::getLocalizeFileName(), 'Antivirus') ?>
                </a>
            </li>
        <?php endif;?>

            <li class="nav-menu-item">
                <a class="nav-menu-link" href="<?php echo Yii::app()->createUrl('/site/logout');?>">
                    <?php echo Yii::t('menu', 'Logout') ?>
                </a>
            </li>
    </ul>
    <span class="cwrgw c15"><span class="cbl"></span><span class="cbr"></span></span>
</div>
