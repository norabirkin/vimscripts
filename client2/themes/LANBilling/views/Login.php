<table cellpadding='5' cellspacing='4'>
    <tr>
        <td align="right"><?php echo $loginLabel; ?></td>
        <td><?php echo $loginInput; ?></td>
        <td rowspan="<?php if ($use_captcha) { ?>3<?php } else { ?>2<?php } ?>" style="vertical-align:middle;"><?php echo $submitButton; ?></td>
    </tr>
    <tr>
        <td align="right"><?php echo $passwordLabel; ?></td>
        <td><?php echo $passwordInput; ?></td>
    </tr>
<?php if ($use_captcha) { ?>
    <tr>
	<td align="right"><?php echo $captchaLabel; ?></td>
	<td><?php echo $captchaInput; ?></td>
    </tr>
    <tr>
	<td></td>
	<td align="left"><?php echo $captchaImg; ?></td>
    </tr>
<?php } ?>
</table>
