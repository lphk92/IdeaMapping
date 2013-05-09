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

function generatePolygon(shapeId, color, sides)
{
    return generatePolygonFromConfig({
        id: shapeId,
        name: "polygon",
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        radius: 48,
        rotationDeg: sides == 4 ? 45 : 0,
        sides: sides,
        fill: color,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
}

function generateStar(shapeId, color, points)
{
    return generateStarFromConfig({
        id: shapeId,
        name: "star",
        x: Math.random() * 700 + 50,
        y: Math.random() * 500 + 50,
        outerRadius: 48,
        innerRadius: 25,
        numPoints: points,
        fill: color,
        stroke: 'black',
        strokeWidth: 2,
        draggable: true
    });
}

function generateCircleFromConfig(config)
{
    var circle = applyEventHandlers(new Kinetic.Circle(config));
    setShadow(circle, nullGlow);
    return circle;
}

function generateTextFromConfig(config)
{
    var text = applyEventHandlers(new Kinetic.Text(config));
    setShadow(text, nullGlow);
    return text;
}

function generatePolygonFromConfig(config)
{
    var polygon = applyEventHandlers(new Kinetic.RegularPolygon(config));
    setShadow(polygon, nullGlow);
    return polygon;
}

function generateStarFromConfig(config)
{
    var star = applyEventHandlers(new Kinetic.Star(config));
    setShadow(star, nullGlow);
    return star;
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
        strokeWidth: 5
    });
    
    line.on("mouseenter", function() { setShadow(this, connectionGlow); connectionLayer.draw(); });
    line.on("mouseleave", function() { setShadow(this, nullGlow); connectionLayer.draw(); });
    
    return line;
}

function applyEventHandlers(shape)
{
    shape.on("dragmove", function() { redrawConnections(this.getId()); });
    shape.on("dragend", function() { saveMap("test"); });
    shape.on("mouseenter", function() { setShadow(this, ideaGlow); ideaLayer.draw(); });
    shape.on("mouseleave", function() { setShadow(this, this.selected ? selectedGlow : nullGlow); ideaLayer.draw(); });    
    shape.on("dblclick", function() {
        shape.selected = !shape.selected;
        setShadow(shape, shape.selected ? selectedGlow : nullGlow);
        });
    
    return shape;
}
