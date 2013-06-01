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
    var shape1x = shape1.getPosition().x;
    var shape1y = shape1.getPosition().y;

    var shape2x = shape2.getPosition().x;
    var shape2y = shape2.getPosition().y;

    if (!shape1.attrs.radius)
    {
        shape1x = shape1x + shape1.getWidth()/2;
        shape1y = shape1y + shape1.getHeight()/2;
    }
    if (!shape2.attrs.radius)
    {
        shape2x = shape2x + shape2.getWidth()/2;
        shape2y = shape2y + shape2.getHeight()/2;
    }

    //NOTE: We are giving the connection the id's of the two ideas
    //      that is connected to, for removing the connection later
    var line = new Kinetic.Line({
        id: uniqueId,
        idea1: shape1.getId(),
        idea2: shape2.getId(),
        points: [shape1x, shape1y, shape2x, shape2y],
        stroke: 'black',
        strokeWidth: 5 
    });
    
    line.on("mouseenter", function() { setShadow(this, connectionGlow); connectionLayer.draw(); });
    line.on("mouseleave", function() { setShadow(this, nullGlow); connectionLayer.draw(); });
    
    return line;
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
