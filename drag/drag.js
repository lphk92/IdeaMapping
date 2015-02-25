var out = document.getElementById("out");

var draggable = document.getElementById("flower");
if (draggable.addEventListener) 
{
    draggable.addEventListener("mousedown", drag, false);
} 

function drag(e) 
{
    if (!e) var e = window.event;
    var dragObj = e.target;

    offX = e.offsetX;
    offY = e.offsetY;
    e.returnValue = false;
    e.preventDefault();

    document.body.onmousemove = function(e) 
    {
        if (!e) 
            var e = window.event;

        dragObj.style.left = (e.clientX - offX) + "px";
        dragObj.style.top = (e.clientY - offY) + "px";
    }

    document.onmouseup = function() 
    {
        document.body.onmousemove = null;
        document.body.onselectstart = null;
    }
}
