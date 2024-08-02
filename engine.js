var win = document.getElementById("screen")

function draw(x, y, c, s) {
    const ctx = win.getContext("2d")

    ctx.fillStyle = c
    ctx.fillRect(x,y,s,s)
}

var particles = []

function random(min, max) {
    return (Math.random() * max) + min / 2
}

function clamp(value, min, max) {
    return Math.max(Math.min(value, max), min)
}

function particle(position, velocity, color) {
    return {"position":position, "velocity":velocity, "color":color}
}

function createparticle(data) {
    particles.push(data)
    return particles[particles.length - 1]
}

function vector2(x, y) {
    return {"x":x, "y":y}
}

function createlot(amount, color, vrand) {
    var group = []

    for (i = 0; i < amount; i++) {
        var part = createparticle(particle(vector2(random(0,win.width), random(0,win.height)), vector2(random(-7, 7), random(-7, 7)), color))
        group.push(part)
    }

    return group
}

function rule(particles1, particles2, g, r) {
    for (i = 0; i < particles1.length; i++) {
        var fx = 0
        var fy = 0

        for (j = 0; j < particles2.length; j++) {
            var a = particles1[i]
            var b = particles2[j]

            var dx = a.position.x - b.position.x
            var dy = a.position.y - b.position.y

            var d = Math.sqrt(dx * dx + dy * dy)

            if (d > r) { continue }
    
            if (d > 0) {
                var f = 1 / d
                fx += (f * dx)
                fy += (f * dy)
            }

            a.velocity.x += fx * g
            a.velocity.y += fy * g

            if (a.position.x <= 0) { a.velocity.x += .5 }
            if (a.position.x >= win.width) { a.velocity.x -= .5 }

            if (a.position.y <= 0) { a.velocity.y += .5 }
            if (a.position.y >= win.width) { a.velocity.y -= .5 }
        }
    }
}

function loop(value, min, max) {
    if (value < min) {
        return max
    }

    if (value > max) {
        return min
    }
}

function screenloop(particle) {
    if (particle.position.x < 0) {
        particle.position.x = win.width
    }

    if (particle.position.x > win.width) {
        particle.position.x = 0
    }

    if (particle.position.y < 0) {
        particle.position.y = win.height
    }

    if (particle.position.y > win.height) {
        particle.position.y = 0
    }
}

const template = prompt("Enter in template. (space, cells, teamwork)", "space")
const scale = prompt("Enter in scale.", 1)

var friction = 0.9

if (template === "teamwork" || template === "cells") {
    win.width *= scale
    win.height *= scale

    var yellow = createlot(200 * scale, "yellow")
    var red = createlot(200 * scale, "red")
    var green = createlot(200 * scale, "green")
}

if (template === "space") {
    win.width = 2000
    win.height = 2000

    win.width *= scale
    win.height *= scale

    var dust = createlot(1000 * scale, "white")
    friction = 1
}

const damp = 25
const maxvel = 5

function update() {
    if (template === "cells") {
        //CELLS

        rule(red, red, -0.1 / (particles.length / damp), 200)
        rule(red, red, 0.15 / (particles.length / damp), 35)
    
        rule(yellow, yellow, 0.5 / (particles.length / damp), 50)
        rule(yellow, red, -0.1 / (particles.length / damp), 100)
    
        rule(yellow, red, 0.13 / (particles.length / damp), 75)

        rule(green, green, 0.5 / (particles.length / damp), 100)
        rule(green, yellow, -0.1 / (particles.length / damp), 150)
    
        rule(green, green, -0.53 / (particles.length / damp), 30)
        rule(green, red, -0.5 / (particles.length / damp), 50)

        rule(red, green, -0.5 / (particles.length / damp), 50)
    }

    if (template === "teamwork") {
        //teamwork

        rule(red, red, -0.125 / (particles.length / damp), 100)
        rule(red, red, 0.14, 5)

        rule(yellow, yellow, -0.125 / (particles.length / damp), 100)
        rule(yellow, yellow, 0.14, 5)

        rule(green, green, -0.125 / (particles.length / damp), 100)
        rule(green, green, 0.14, 5)

        rule(red, green, -0.07 / (particles.length / damp), 100)
        rule(red, green, 0.11 / (particles.length / damp), 30)

        rule(green, yellow, -0.1 / (particles.length / damp), 100)
        rule(green, yellow, 0.14 / (particles.length / damp), 30)

        rule(red, yellow, 0.11 / (particles.length / damp), 30)
    }

    if (template === "space") {
        rule(dust, dust, -0.2 / (particles.length / damp), 75)
        rule(dust, dust, 0.3 / (particles.length / damp), 15)
    }
    

    draw(0,0,"black",win.width)

    for (i = 0; i < particles.length; i++) {
        const object = particles[i]

        object.velocity.x *= friction
        object.velocity.y *= friction

        object.velocity.x = clamp(object.velocity.x, maxvel * -1, maxvel)
        object.velocity.y = clamp(object.velocity.y, maxvel * -1, maxvel)

        object.position.x += object.velocity.x
        object.position.y += object.velocity.y

        //screenloop(object)

        draw(object.position.x, object.position.y, object.color, 5)
    }
}

setInterval(update, 10)