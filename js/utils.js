var last = 1
function genId()
{
    return last++;
}

function removeItem(map, item)
{
    var index = map.indexOf(item);
    if (index >= 0)
    {
        map.splice(index, 1);
    }
}

function applyTransform(selector, name, value)
{
    t = $(selector).css("transform")
    i = t.indexOf(name)
    newT = ""
    if (i >= 0)
    {
        front = t.substring(0, i);
        back = t.substring(i+1);
        newT = front + " " + back;
    }
    newT += name + "(" + value + ")";
    $(selector).css("transform", newT);
}
