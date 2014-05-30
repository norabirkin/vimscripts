<!doctype html>
<!--[if lt IE 7]> <html class="no-js ie6 ie67 ie" lang="ru"> <![endif]-->
<!--[if IE 7]> <html class="no-js ie7 ie67 ie" lang="ru"> <![endif]-->
<!--[if IE 8]> <html class="no-js ie8 ie" lang="ru"> <![endif]-->
<!--[if IE 9]> <html class="no-js ie9 ie" lang="ru"> <![endif]-->
<!--[if gt IE 9]><!--> <html class="no-js" lang="ru"> <!--<![endif]-->
    <head>

        <?php foreach (LB_Google_Analitics::getInstance()->meta() as $k => $v) { ?>
        <meta name="<?php echo $k; ?>" content='<?php echo $v; ?>' />
        <?php } ?>
        <?php foreach (LB_Google_Analitics::getInstance()->head() as $v) { ?>
        <script type="text/javascript" src="<?php echo $v; ?>"></script>
        <?php } ?>

        <meta charset="utf-8">
        <meta name="application-url" content="<?php echo Yii::app()->baseUrl; ?>" />
        <title><?php echo $this->pageTitle ?></title>
        <script>document.documentElement.className=document.documentElement.className.replace('no-js','js');</script>
        <?php
            $rendered = MainTemplateHelper::Render($content);
            ClientScriptRegistration::run();
        ?>
        <?php $this->renderPartial('application.views.layouts.mainjs'); ?>
        <script src="<?php echo Yii::app()->baseUrl; ?>/js/edit-form.js" type="text/javascript"></script>
    </head>
    <body class="<?php if (Yii::app()->user->isGuest) { echo "guest"; } ?>">

    <?php foreach (LB_Google_Analitics::getInstance()->body() as $v) { ?>
        <script type="text/javascript" src="<?php echo $v; ?>"></script>
    <?php } ?>

    <div class="_cpage">
        <?php echo MainTemplateHelper::GetInstance()->GetPositionContent('PageHeader'); ?>
        <?php echo $rendered; ?>
    </div>
    <?php echo yii::app()->controller->getHTMLBeforeEnd(); ?>
</body>
</html>
