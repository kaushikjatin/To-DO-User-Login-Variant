window.onload=function()
{
        $('ul').on("click",'#todo',function()
        {
            var childnodes=$(this).children();
            childnodes[0].style.display="none";
            childnodes[1].style.display="block";
        })
        $('ul').on("click",'#edit_button',function()
        {
            var todo=$(this).parent().parent();
            var childnodes=todo.children();
            childnodes[1].style.display="none";
            childnodes[0].style.display="block";
        })
}   