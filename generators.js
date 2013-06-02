var ideaGlow = {
        color: 'blue',
        blur: 40,
        offset: [0, 0],
        opacity: 1.0
        };

var selectedGlow = {
        color: 'orange',
        blur: 40,
        offset: [0, 0],
        opacity: 1.0
        };

var connectionGlow = {
        color: 'red',
        blur: 20,
        offset: [0, 0],
        opacity: 1.0
        };

var nullGlow = {
        color: 'black',
        blur: 0,
        offset: [0, 0],
        opacity: 0.01
        };

function setShadow(shape, shadow)
{
    shape.setShadowColor(shadow.color);
    shape.setShadowBlur(shadow.blur);
    shape.setShadowOffset(shadow.offset);
    shape.setShadowOpacity(shadow.opacity);
}

function generateText(shapeId, textString)
{
    return generateTextFromConfig({
        id: shapeId,
        name: "text",
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        text: textString,
        fill: 'white',
        fontFamily: 'Arial',
        fontSize: 40,
        fontStyle: 'bold',
        stroke: 'black',
        strokeWidth: 1,
        draggable: true
    });
}

function generateTextFromConfig(config)
{
    var text = applyShadowHandlers(new Kinetic.Text(config));
    setShadow(text, nullGlow);
    return text;
}

function generateConnection(uniqueId, shape1, shape2)
{
    var coords1 = findMiddle(shape1);
    var coords2 = findMiddle(shape2);

    var line = new Kinetic.Line({
        id: uniqueId,
        points: coords1.concat(coords2),
        stroke: 'black',
        strokeWidth: 8 
    });

    //NOTE: We are giving the connection the id's of the two ideas
    //      that is connected to, for removing the connection later
    line.idea1 = shape1.getId();
    line.idea2 = shape2.getId();
    
    line.on("mouseenter", function() { setShadow(this, connectionGlow); connectionLayer.draw(); });
    line.on("mouseleave", function() { setShadow(this, nullGlow); connectionLayer.draw(); });
    
    return line;
}

function updateConnection(connection, shape1, shape2)
{
    connection.points = findMiddle(shape1).concat(findMiddle(shape2)); 
}

function findMiddle(shape)
{
    var shapex = shape.getPosition().x;
    var shapey = shape.getPosition().y;

    shapex = shapex + shape.getWidth()/2;
    shapey = shapey + shape.getHeight()/2;
    
    return [shapex, shapey];
}

function applyShadowHandlers(shape)
{
    shape.on("mouseenter", function() { setShadow(this, ideaGlow); ideaLayer.draw(); });
    shape.on("mouseleave", function() { setShadow(this, this.selected ? selectedGlow : nullGlow); ideaLayer.draw(); });    
    shape.on("dblclick", function() {
        shape.selected = !shape.selected;
        setShadow(shape, shape.selected ? selectedGlow : nullGlow);
        });
    
    return shape;
}
