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

function redrawConnections(shapeId)
{
    var idea = ideaLayer.get("#" + shapeId)[0];

    if (idea)
    {
        for (var i = 0 ; i < idea.ideaConnections.length ; i++)
        {
            var otherIdeaId = idea.ideaConnections[i];
            drawConnection(idea.getId(), otherIdeaId);
        }
    }
    else
    {
        alert("Error in redrawing connections: shape with id \"" + shapeId + "\" could not be found");
    }
}

function generateCircle(shapeId, color)
{
    var circle = new Kinetic.Circle({
        id: shapeId,
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        radius: 48,
        fill: color,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });

    circle.on("dragmove", function() { redrawConnections(shapeId); });

    return circle;
}

function generateText(shapeId, textString)
{
    var text = new Kinetic.Text({
        id: shapeId,
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        text: textString,
        textFill: 'black',
        fill: 'white',
        fontFamily: 'Arial',
        fontSize: 24,
        padding: 8,
        cornerRadius: 8,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });

    text.on("dragmove", function() { redrawConnections(shapeId); });
    text.nonRadial = true;

    return text;
}

function drawConnection(shapeId1, shapeId2)
{
    var shape1 = stage.get('#' + shapeId1)[0];
    var shape2 = stage.get('#' + shapeId2)[0];

    var shape1x = shape1.getPosition().x;
    var shape1y = shape1.getPosition().y;

    var shape2x = shape2.getPosition().x;
    var shape2y = shape2.getPosition().y;

    if (shape1.nonRadial)
    {
        shape1x = shape1x + shape1.getWidth()/2;
        shape1y = shape1y + shape1.getHeight()/2;
    }
    if (shape2.nonRadial)
    {
        shape2x = shape2x + shape2.getWidth()/2;
        shape2y = shape2y + shape2.getHeight()/2;
    }

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

    line = new Kinetic.Line({
        id: shapeId1 + "-" + shapeId2,
        points: [shape1x, shape1y, shape2x, shape2y],
        stroke: 'black',
        strokeWidth: 2
    });

    connectionLayer.add(line);
    connectionLayer.draw();
}

function addIdea(title, shape)
{
    ideaLayer.add(shape);
    ideaLayer.draw();

    shape.ideaTitle = title;
    shape.ideaConnections = new Array();
    shape.ideaConnections[0] = shape.getId();

    var allIdeas = ideaLayer.getChildren();
    for (var i = 0 ; i < allIdeas.length ; i++)
    {
        var idea = allIdeas[i];

        idea.ideaConnections[idea.ideaConnections.length] = shape.getId();
        shape.ideaConnections[shape.ideaConnections.length] = idea.getId();

        drawConnection(shape.getId(), idea.getId());
    }
}

addIdea("Jim", generateText("jim", "Jim"));
addIdea("Red Idea", generateCircle('red', 'red'));
addIdea("Green Idea", generateCircle('green', 'green'));
addIdea("Blue Idea", generateCircle('blue', 'blue'));
addIdea("Orange Idea", generateCircle('orange', 'orange'));
addIdea("Purple Idea", generateCircle('purple', 'purple'));
addIdea("White Idea", generateCircle('white', 'white'));
addIdea("Black Idea", generateCircle('black', 'black'));
