<div class="<?php echo $boxClass; ?>">
    <table>
        <tbody>
            <tr>
                <td>
                    <?php echo yii::t('main', 'Description'); ?>:&nbsp;
                </td>
                <td>
                    <input type="text" name="<?php echo $name; ?>" value="<?php echo $value; ?>" class="input-text" />
                </td>
            </tr>
            <tr>
                <td>
                    <?php echo yii::t('main', 'File'); ?>:&nbsp;
                </td>
                <td>
                    <input type="file" name="<?php echo $fileName; ?>" />
                </td>
            </tr>
        </tbody>
    </table>
</div>
