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

function generateCircle(shapeId, color)
{
    return generateCircleFromConfig({
        id: shapeId,
        name: "circle",
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        radius: 48,
        fill: color,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
}

function generateText(shapeId, textString)
{
    return generateTextFromConfig({
        id: shapeId,
        name: "text",
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
}

function generateCircleFromConfig(config)
{
    var circle = applyEventHandlers(new Kinetic.Circle(config));
    circle.setShadow(nullGlow);
    return circle;
}

function generateTextFromConfig(config)
{
    var text = applyEventHandlers(new Kinetic.Text(config));
    text.setShadow(nullGlow);
    return text;
}

function generateConnection(shape1, shape2)
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

    var connectionId = shape1.getId() + "-" + shape2.getId();
    var line = new Kinetic.Line({
        id: connectionId,
        points: [shape1x, shape1y, shape2x, shape2y],
        stroke: 'black',
        strokeWidth: 3
    });
    
    line.on("mouseenter", function() { this.setShadow(connectionGlow); connectionLayer.draw(); });
    line.on("mouseleave", function() { this.setShadow(nullGlow); connectionLayer.draw(); });
    
    return line;
}

function applyEventHandlers(shape)
{
    shape.on("dragmove", function() { redrawConnections(this.getId()); });
    shape.on("dragend", function() { saveMap("test"); });
    shape.on("mouseenter", function() { this.setShadow(ideaGlow); ideaLayer.draw(); });
    shape.on("mouseleave", function() { this.setShadow(this.selected ? selectedGlow : nullGlow); ideaLayer.draw(); });    
    shape.on("click", function() {
        shape.selected = !shape.selected;
        shape.setShadow(shape.selected ? selectedGlow : nullGlow);
        });
    
    return shape;
}
