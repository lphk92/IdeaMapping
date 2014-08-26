function generateUniqueId()
{
    return (new Date()).getTime(); 
}

function saveMap(mapName)
{
    /*var ideas = ideaLayer.getChildren();


    var currentMap = new Object();
    currentMap.name = mapName;
    currentMap.ideaAttrs = new Array();
    
    for (var i = 0 ; i < ideas.length ; i++)
    {
        currentMap.ideaAttrs.push(ideas[i].getAttrs());
        currentMap[ideas[i].getId()] = ideas[i].ideaConnections;
    }
    */

    localStorage[mapName] = JSON.stringify(currentMap);
    alert("Map Saved!");
}

function clearMap()
{
    //TODO: Clear map
}

function loadMap(mapName)
{
    if (localStorage[mapName])
    {
        clearMap();
        //TODO: Load map
    }
    else
    {
        alert("Map with name \"" + mapName + "\" could not be found.");
    }
}

function redrawConnections(shapeId)
{
}

function drawConnection(shapeId1, shapeId2)
{    
}

function removeConnection(connectionId)
{
}

function addIdea(shape)
{
}

document.getElementById("saveMap").addEventListener('click', function() {
    saveMap("test");
});
document.getElementById("addIdea").addEventListener('click', function() {
    var text = document.getElementById("ideaText").value;
    var newIdea = generateText(generateUniqueId(), text);
    addIdea(newIdea); 
});

document.getElementById("clearMap").addEventListener('click', function() {
    if(confirm("Are you sure you would like to clear the current map? You will be unable to reverse this operation"))
    {
        clearMap();
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

    for (var i = 0 ; i  < selectedIdeas.length ; i++)
    {
        // Manually fire a double-click to change the shadow on the idea
        selectedIdeas[i].fire("dblclick");
    }
    ideaLayer.draw();
});

document.getElementById("editConnections").addEventListener('click', function() {
    // TODO: Implement editing of connections
    alert("This has yet to be done...");
});

loadMap("test");
