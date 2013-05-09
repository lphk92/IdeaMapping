var stage = new Kinetic.Stage({
    height: 600,
    width: 800,
    container: 'map'
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
}

function clearMap()
{
    ideaLayer.removeChildren();
    ideaLayer.clear();

    connectionLayer.removeChildren();
    connectionLayer.clear();
}

function loadMap(mapName)
{
    if (localStorage[mapName])
    {
        clearMap();

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
            else if (type == "polygon")
            {
                idea = generatePolygonFromConfig(map.ideaAttrs[i]);
            }
            else if (type == "star")
            {
                idea = generateStarFromConfig(map.ideaAttrs[i]);
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

    line.on("dblclick", function() { removeConnection(this.getId()); saveMap("test"); });

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
    shape.selected = false;

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
                idea.ideaConnections.push(shape.getId());
                shape.ideaConnections.push(idea.getId());

                drawConnection(shape.getId(), idea.getId());
            }
        }
    }

    saveMap("test");
}

document.getElementById("addIdea").addEventListener('click', function() {
    var text = document.getElementById("ideaText").value;
    var newIdea = generateText(generateUniqueId(), text);
    addIdea(newIdea); 
});

document.getElementById("addShape").addEventListener('click', function() {
    var shapeType = document.getElementById("shape").value;
    var color = document.getElementById("shapeColor").value;

    var newShape;
    if (shapeType == 0)
    {
        newShape = generateCircle(generateUniqueId(), color);
    }
    else if (shapeType < 10)
    {
        newShape = generatePolygon(generateUniqueId(), color, shapeType);
    }
    else if (shapeType > 10)
    {
        newShape = generateStar(generateUniqueId(), color, shapeType%10);
    }

    addIdea(newShape);
});

document.getElementById("clearMap").addEventListener('click', function() {
    if(confirm("Are you sure you would like to clear the current map? You will be unable to reverse this operation"))
    {
        clearMap();
        saveMap("test");
    }
});

document.getElementById("connectIdeas").addEventListener('click', function() {
    var ideas = ideaLayer.getChildren();
    var selectedIdeas = new Array();
    for (var i = 0 ; i  < ideas.length ; i++)
    {
        if (ideas[i].selected)
        {
            selectedIdeas.push(ideas[i]);
        }
    }
    
    for (var i = 0 ; i < selectedIdeas.length ; i++)
    {
        for(var j = 0 ; j < selectedIdeas.length ; j++)
        {
            if (i != j && selectedIdeas[i].ideaConnections.indexOf(selectedIdeas[j].getId()) < 0)
            {
                selectedIdeas[i].ideaConnections.push(selectedIdeas[j].getId());
            }
        }

        redrawConnections(selectedIdeas[i].getId());
    }

    saveMap("test");
});

loadMap("test");
