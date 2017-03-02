<html>
    <head>
        <title><?php echo "$title";?></title>
    </head>
    <body>
    <div><?php echo "$id";?></div>
    <div><?php echo "$name";?></div>
    <div><?php echo "$address";?></div>
    <?php if($tel=='测试号码'){?>
        <div>号码是正确的 </div>
    <?php }else{?>
        <div>号码是错误的</div>
    <?php }?>
    </body>
</html>