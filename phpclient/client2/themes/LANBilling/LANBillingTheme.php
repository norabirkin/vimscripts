<?php class LANBillingTheme extends Theme {
    public function ContentBegining($params) {
        return $this->breadcrumbs('breadcrumb');
    }
} ?>
