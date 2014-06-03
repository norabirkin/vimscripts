<div id="popup-edit-form-<?php echo $this->id; ?>" class="popup-edit-form">
    <div class="edit-form-top">
        <span id="edit-form-popup-close-<?php echo $this->id; ?>" class="edit-form-popup-close">закрыть</span>
    </div>
    <div class="edit-form">
         <div class="input_wrapper">
             <div class="wrapped_input_right"></div>
             <input 
                    id="<?php echo $this->getInputId(); ?>"
                    type="text" 
                    size="14" 
                    class="wrapped_input" />
         </div>
         <button class="edit-form-button" type="submit" name="" id="edit-form-button-<?php echo $this->id; ?>">
                <span class="button_inner_wrp">
                    <span class="button_inner">Сохранить</span>
                </span>
         </button>
         <div class="clr"></div>
    </div>
    <div class="edit-form-bottom">&nbsp;</div>
</div>

