<?php

class RequiredValidator extends CRequiredValidator {
    protected function addError($object,$attribute,$message,$params=array()) {
        parent::addError($object,$attribute,$message,$params);
        $errors = $object->getErrors();
        $index = count($errors) - 1;
        $object->setRequiredError($attribute, $index);
    }
}

?>
