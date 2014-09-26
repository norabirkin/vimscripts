<style>
    .page-error {
        width: auto;
        margin: 0 10px 0 10px;
        font-family: Arial, Helvetica, sans-serif;
    }
    
    .page-error .code {
        font-size: 28px;
        font-weight: bold;
        border-bottom: solid 1px black;
    }
    
    .page-error .message {
        margin-top: 24px;
    }
</style>

    <div class="page-error">
        <div class="page-error code"><?php print $t["code"]; ?>: <?php print $code; ?></div>
        <div class="page-error message"><?php print $message; ?></div>
    </div>
