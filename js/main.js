var connectionMap = new Map();
var transformed = false;

var last = 1
function genId()
{
    return last++;
}

function createIdeaElement(id, value)
{
    idea = document.createElement("div");
    idea.id = id; 
    idea.classList.add("idea");
    idea.innerHTML = value;
    $(idea).draggable({ scroll: true, cursor: "move"},
    {
        drag: function(event, ui)
        {
            var id = $(this).attr("id");
            if (connectionMap[id] != undefined)
            {
                for (var i = 0 ; i <  connectionMap[id].length ; i++)
                {
                    var otherId = connectionMap[id][i];
                    var lineId = id < otherId ? id+"-"+otherId : otherId+"-"+id;

                    var line = $("#" + lineId);
                    var other = $("#" + otherId);

                    var x1 = $(this).offset().left + $(this).width()/2;
                    var y1 = $(this).offset().top + $(this).height()/2;
                    var x2 = $(other).offset().left + $(other).width()/2;
                    var y2 = $(other).offset().top + $(this).height()/2;

                    var dist = Math.sqrt((x1 - x2)*(x1-x2) + (y1-y2)*(y1-y2));
                    var angle = Math.atan2((y1-y2), (x1-x2)) * (180/Math.PI);
                    if(angle >= 90 && angle < 180)
                    {
                        y1 = y1 - (y1-y2);
                    }
                    else if(angle > 0 && angle < 90)
                    {
                        x1 = x1 - (x1-x2);
                        y1 = y1 - (y1-y2);
                    }
                    else if(angle <= 0 && angle > -90)
                    {
                        x1 = x1 - (x1-x2);
                    }

                    line.css({'transform': 'rotate(' + angle + 'deg)'});
                    line.offset({top: y1, left: x1});
                    line.width(dist);
                }
            }
        }
    });
    return idea;
}

function createLineElement(id1, id2)
{
    var line = document.createElement("div");
    line.id = id1 < id2 ? id1+"-"+id2 : id2+"-"+id1;
    console.log("creating line with id " + line.id);
    line.classList.add("line");
    return line;
}

function addIdea(value)
{
    var id = genId();
    var ideaDiv = createIdeaElement(id, value);
    $("#map").append(ideaDiv);

    var c = []
    for (var key in connectionMap)
    {
        connectionMap[key].push(id);
        c.push(key);
        var lineDiv = createLineElement(id, key);
        $("#map").append(lineDiv);
    }
    connectionMap[id] = c
}

$(document).ready(function()
{
    $("#add").click(function()
    {
        var val = $("#add-value").val();
        if (val.length > 0)
        {
            addIdea(val);
        }
    });

    $("#transform").click(function()
    {
        if (!transformed)
        {
            $(".idea").each(function()
            {
                $(this).css("transform", "translateZ(" + $(this).offset().left + "px)");    
            });
        }
        else
        {
            $(".idea").each(function()
            {
                $(this).css("transform", "");
            });
        }
        transformed = !transformed;
    });

    $("#spin").click(function()
    {
        $("#map").toggleClass("spinMap");
        $(".idea").each(function()
        {
            $(this).toggleClass("spinIdea");
        });
    });
});
