
class Point {
    constructor(points, name) {
        this.x = points[0]
        this.y = points[1]
        this.name = name
    }
}

class Shape {
    constructor(points) {
        if (this.constructor === Shape) {
            throw new Error(`You can't make new instance`)
        }
        this.pointDict = ['a', 'b', 'c', 'd']
        this.points = [...points]
        for (let i = 0, p = 0; p < this.points.length; i++ , p += 2) {
            this[this.pointDict[i]] = new Point(this.points.slice(p, p + 2), this.pointDict[i])
        }
    }

    area() {
    }

    getSide(firstPoint, secondPoint) {
        return Math.abs(Math.sqrt((secondPoint.x - firstPoint.x) ** 2 + (secondPoint.y - firstPoint.y) ** 2))
    }

    getPerimeter(sides = [this.A, this.B, this.C, this.D]) {
        return sides.reduce((accum, side) => accum + side, 0)
    }

    getType() {
        switch (this.constructor) {
            case Circle: return 'Circle'
            case Triangle: return 'Triangle'
            case Fourangle: return 'Fourangle'
        }
    }
}

class Circle extends Shape {
    constructor(points, r) {
        super(points)
        this.radius = r;
    }

    getType() {
        return 'Circle'
    }
    area() {
        return Math.PI * this.radius ** 2;
    }
}

class Triangle extends Shape {
    constructor(points) {
        super(points)
        this.sortedSides = [
            this.getSide(this.a, this.b), 
            this.getSide(this.b, this.c), 
            this.getSide(this.c, this.a)
        ].sort((a, b) => a - b)
        this.A = this.getSide(this.a, this.b)
        this.B = this.getSide(this.b, this.c)
        this.C = this.getSide(this.c, this.a)
    }

    area() {}
    getType() {
        if (this.A == this.B == this.C) return Equilateral
        else if (this.A == this.B || this.A == this.C || this.B == this.C) return Right
        else if (this.A ** 2 + this.B ** 2 == this.C ** 2) return Isosceles
    }
}

class Equilateral extends Triangle {
    constructor(points) {
        super(points)
    }
    area() {
        return ((this.A ** 2) * Math.sqrt(3)) / 4
    }
}

class Right extends Triangle {
    constructor(points) {
        super(points)
    }
    area() {
        return (this.sortedSides[0] * this.sortedSides[1]) / 2
    }
}

class Isosceles extends Triangle {
    constructor(points) {
        super(points)
    }
    area() {
        return (this.C * Math.sqrt((this.sortedSides[0] ** 2) - ((this.sortedSides[2] ** 2) / 4))) / 2
    }
}

class Fourangle extends Shape {
    constructor(points) {
        super(points)
        this.A = this.getSide(this.a, this.b)
        this.B = this.getSide(this.b, this.c)
        this.C = this.getSide(this.c, this.d)
        this.D = this.getSide(this.d, this.a)
        this.p = this.getSide(this.a, this.c)
        this.q = this.getSide(this.b, this.d)
    }
    getType() {
        if (this.A == this.B == this.C == this.D && this.p !== this.q) return Rhombus
        else if (this.A == this.B === this.C == this.D) return Square
        else if (this.A == this.C && this.B == this.D) return Rectangle
    }
}

class Square extends Fourangle {
    constructor(points) {
        super(points)
    }
    area() {
        return this.A ** 2
    }
}

class Rectangle extends Fourangle {
    constructor(points) {
        super(points)
    }
    area() {
        return this.A * this.C
    }
}

class Rhombus extends Fourangle {
    constructor(points) {
        super(points)
    }
    area() {
        return this.p * this.q / 2
    }
}

const fabric = function (points, r) {
    switch (points.length) {
        case 6:
            const triangleType = new Triangle(points).getType()
            return new triangleType(points)
        case 8:
            const fourangleType = new Fourangle(points).getType()
            return new fourangleType(points)
        case 2:
            return new Circle(points, r)
    }
}
