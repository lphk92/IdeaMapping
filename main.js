var stage = new Kinetic.Stage({
    container: 'map',
    height: 600,
    width: 800
});

var ideaLayer = new Kinetic.Layer();
var connectionLayer = new Kinetic.Layer();

stage.add(ideaLayer);
stage.add(connectionLayer);

connectionLayer.moveToBottom();

function generateUniqueId()
{
    return (new Date()).getTime(); 
}

function saveMap(mapName)
{
    var ideas = ideaLayer.getChildren();

    var currentMap = new Object();
    currentMap.name = mapName;
    currentMap.ideaAttrs = new Array();
    
    for (var i = 0 ; i < ideas.length ; i++)
    {
        currentMap.ideaAttrs.push(ideas[i].getAttrs());
        currentMap[ideas[i].getId()] = ideas[i].ideaConnections;
    }

    localStorage[mapName] = JSON.stringify(currentMap);
    alert("Save Successful");
}

function loadMap(mapName)
{
    if (localStorage[mapName])
    {
        ideaLayer.removeChildren();
        ideaLayer.clear();

        connectionLayer.removeChildren();
        connectionLayer.clear();

        var map = JSON.parse(localStorage[mapName]);
        for (var i = 0 ; i < map.ideaAttrs.length ; i++)
        {
            var idea;
            var type = map.ideaAttrs[i].name;
            if (type == "circle")
            {
                idea = generateCircleFromConfig(map.ideaAttrs[i]); 
            }
            else if (type == "text")
            {
                idea = generateTextFromConfig(map.ideaAttrs[i]); 
            }

            idea.ideaConnections = map[idea.getId()];
            addIdea(idea);
        }
        
        ideaLayer.draw();

        var ideas = ideaLayer.getChildren();
        for (var i = 0 ; i < ideas.length ; i++)
        {
            redrawConnections(ideas[i].getId());
        }
    }
    else
    {
        alert("Map with name \"" + mapName + "\" could not be found.");
    }
}

function redrawConnections(shapeId)
{
    var idea = ideaLayer.get("#" + shapeId)[0];

    if (idea)
    {
        if (idea.ideaConnections)
        {
            for (var i = 0 ; i < idea.ideaConnections.length ; i++)
            {
                var otherIdeaId = idea.ideaConnections[i];
                drawConnection(idea.getId(), otherIdeaId);
            }
        }
    }
    else
    {
        alert("Error in redrawing connections: shape with id \"" + shapeId + "\" could not be found");
    }
}

function drawConnection(shapeId1, shapeId2)
{    
    var shape1 = stage.get('#' + shapeId1)[0];
    var shape2 = stage.get('#' + shapeId2)[0];

    var line = stage.get('#' + shapeId1 + "-" + shapeId2)[0];
    if (line)
    {
        line.remove();
    }
    else
    {
        line = stage.get('#' + shapeId2 + "-" + shapeId1)[0];
        if (line)
        {
            line.remove();
        }
    }    
    
    line = generateConnection(shape1, shape2);

    line.on("dblclick", function() { removeConnection(this.getId()); });

    connectionLayer.add(line);
    connectionLayer.draw();
}

function removeConnection(connectionId)
{
    var ideaId1 = connectionId.split('-')[0];
    var ideaId2 = connectionId.split('-')[1];

    var idea1 = ideaLayer.get('#' + ideaId1)[0];
    var idea2 = ideaLayer.get('#' + ideaId2)[0];

    for (var i = 0 ; i < idea1.ideaConnections.length ; i++)
    {
        if (idea1.ideaConnections[i] == ideaId2)
        {
            idea1.ideaConnections.splice(i, 1);
            break;
        }
    }

    for (var i = 0 ; i < idea2.ideaConnections.length ; i++)
    {
        if (idea2.ideaConnections[i] == ideaId1)
        {
            idea2.ideaConnections.splice(i, i);
            break;
        }
    }

    connectionLayer.get('#' + connectionId)[0].remove();
    connectionLayer.draw();
}

function addIdea(shape)
{
    ideaLayer.add(shape);
    ideaLayer.draw();

    if (!shape.ideaConnections)
    {
        shape.ideaConnections = new Array();

        var allIdeas = ideaLayer.getChildren();
        for (var i = 0 ; i < allIdeas.length ; i++)
        {
            var idea = allIdeas[i];

            if (idea.getId() != shape.getId())
            {
                idea.ideaConnections[idea.ideaConnections.length] = shape.getId();
                shape.ideaConnections[shape.ideaConnections.length] = idea.getId();

                drawConnection(shape.getId(), idea.getId());
            }
        }
    }
}

loadMap("test");

document.getElementById("addIdea").addEventListener('click', function() {
    var text = document.getElementById("ideaText").value;
    var newIdea = generateText(generateUniqueId(), text);
    addIdea(newIdea); 
});

document.getElementById("addCircle").addEventListener('click', function() {
    var color = document.getElementById("circleColor").value;
    var newCircle = generateCircle(generateUniqueId(), color);
    addIdea(newCircle);
});

document.getElementById("clearMap").addEventListener('click', function() {
    //TODO: Write function for clearing the map
});

document.getElementById("saveMap").addEventListener('click', function() {
    saveMap("test");
});
