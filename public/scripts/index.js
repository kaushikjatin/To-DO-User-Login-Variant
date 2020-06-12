window.onload=function()
{
    var todo=document.getElementById("todo");
    var done_button=document.getElementById("done_button");
    var edit_form=document.getElementById("edit_form");
    todo.addEventListener('click',function()
    {
        edit_form.style.display="block";
        done_button.style.display="block";
        todo.style.display="none";
    })

    done_button.addEventListener('click',function()
    {
        edit_form.style.display="none";
        done_button.style.display="none";
        todo.style.display="block";
    })
}   