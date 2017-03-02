<html>
    <head>
        <title>{$title}</title>
    </head>
    <body>
    <div>{$id}</div>
    <div>{$name}</div>
    <div>{$address}</div>
    {if $tel=='测试号码'}
        <div>号码是正确的 </div>
    {else}
        <div>号码是错误的</div>
    {/if}
    </body>
</html>