import _ from 'lodash'


const roseFuncCache = {}


export default class Rose {
    static get globalScale()   { return 1.0 }
    static get margin()        { return 25  }

    static getPointSamples(f, center) {
        const maxWH   = Math.max(center[0]*2, center[1]*2)
        const step    = (2*Math.PI) / (100*maxWH)
        const samples = []
        for (let theta = 0; theta <= 2*Math.PI; theta += step) {
            const r = f(theta)
            const x = r * Math.cos(theta)
            const y = r * Math.sin(theta)
            samples.push([x, y])
        }
        return samples
    }

    constructor({n, f, size, color, center}) {
        n      = this.n      = n      || 1
        f      = this.f      = f      || _.identity
        size   = this.size   = size   || 7
        color  = this.color  = color  || randomColor()
        center = this.center = center || [0, 0]

        this.samples = Rose.getPointSamples(f, center)
    }

    update(dt) {
        this.size += dt/7
    }

    draw(ctx) {
        const len = this.samples.length
        const step = Math.floor(this.n*len/this.size/15)
        if (Math.floor(step * 3) > len) { return }
        const xy0 = this.translate(this.samples[0])
        ctx.strokeStyle = this.color
        ctx.lineWidth = Math.max(1, Math.floor(10000/(this.size + 500)))
        ctx.beginPath()
        ctx.moveTo(xy0[0], xy0[0])
        for (let i = step; i < len - (2*step); i += step) {
            const xyA = this.translate(this.samples[i])
            const xyB = this.translate(this.samples[i+step])
            ctx.quadraticCurveTo(
                xyA[0], xyA[1],
                ((xyA[0] + xyB[0]) / 2),
                ((xyA[1] + xyB[1]) / 2)
            )
        }
        const xyY = this.translate(this.samples[len - step])
        const xyZ = this.translate(this.samples[len - 1])
        ctx.quadraticCurveTo(xyY[0], xyY[1], xyZ[0], xyZ[1])
        ctx.stroke()
        ctx.closePath()
    }

    translate(xy) {
        return [
            (this.center[0] + xy[0]*(this.size*Rose.globalScale)),
            (this.center[1] - xy[1]*(this.size*Rose.globalScale))
        ]
    }
}


function randomColor() {
    return '#'+(function recur(s, c) {
        return s[Math.floor(Math.random() * s.length)] + (c && recur(s, c-1))
    })('3456789ABCD', 4)
}

