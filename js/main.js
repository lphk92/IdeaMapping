$(document).ready(function()
{
    var connectionMap = {};
    connectionMap['1'] = ['2', '3'];
    connectionMap['2'] = ['1'];
    connectionMap['3'] = ['1'];

    $(".idea").draggable({ scroll: true, cursor: "move"},
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

                    line.offset({top: y1, left: x1});
                    line.width(dist);
                    line.css({'transform': 'rotate(' + angle + 'deg)'});
                }
            }
        }
    });
});
