<?php
class CountriesController extends Controller {
    public function actionList() {
        $this->success( Options::getCountries() );
    }
} ?>
