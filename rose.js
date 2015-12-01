import _ from 'lodash'


export default class Rose {
    static get globalScale()   { return 1.0 }
    static get margin()        { return 25  }

    static getPointSamples(f, center) {
        const step    = (2*Math.PI) / (100*Math.max(center[0]*2, center[1]*2))
        const samples = []
        for (let theta = 0; theta <= 2*Math.PI; theta += step) {
            const r = f(theta)
            const x = r * Math.cos(theta)
            const y = r * Math.sin(theta)
            samples.push([x, y])
        }
        return samples
    }

    constructor({f, size, color, center}) {
        f      = this.f      = f      || _.identity
        size   = this.size   = size   || 7
        color  = this.color  = color  || 'gray'
        center = this.center = center || [0, 0]

        this.samples = Rose.getPointSamples(f, center)
    }

    update(dt) {
        this.size += 3
    }

    draw(ctx, center, dt) {
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.size/15
        const [x0, y0] = this.translatePosition(_.first(this.samples))
        ctx.moveTo(x0, y0)
        for (let i = 0; i < this.samples.length; i += this.samples.length/this.size) {
            const xy = this.samples[Math.floor(i)]
            const [x, y] = this.translatePosition(xy)
            ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.closePath()
    }

    translatePosition([x, y]) {
        return [
            (this.center[0] + x*(this.size*Rose.globalScale)),
            (this.center[1] - y*(this.size*Rose.globalScale))
        ]
    }
}


