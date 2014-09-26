<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="<?php print Yii::app()->getLanguage(); ?>" />
        <meta name="application-url" content="<?php print Yii::app()->request->baseUrl; ?>" />
        <title><?php print $this->getPageTitle(); ?></title>

<?php if(!$this->getError()): ?>
<?php if($this->localizeUrl): ?>
        <script type="text/javascript" src="<?php print $this->localizeUrl ?>"></script>
<?php endif; ?>
        
<?php if($this->licenseUrl): ?>        
        <script type="text/javascript" src="<?php print $this->licenseUrl; ?>"></script>
<?php endif; ?>
        <!-- @build index @ -->
        <!-- @develop -->
<?php if($this->bootStrap): ?>
        <?php print $this->bootStrap; ?>
<?php endif; ?>
        <!-- develop@ -->
<?php endif; ?>

    </head>
    <body>

<?php print $content; ?>
        
    </body>
</html>
