import _ from 'lodash'
import Rose from './rose'


const primes = [2,  3,  5,  7,  11,  13,  17,  19,  23,  29,  31,  37,  41,  43,  47,  53,  59,  61,  67,  71,  73,  79,  83,  89,  97]


view Main {
    <ResizeableCanvas render={(ctx, [width, height]) => {
        const roses = []

        const roseFunc = (n) =>
        ((theta) => (Math.sin(n*theta)))

        const roseFunc2 = (n) =>
        ((theta) => (1 + (n*Math.sin(theta))))

        const center = [
            Math.floor(width/2),
            Math.floor(height/2)
        ]

        const funcs = _.take(_.drop(primes, 1), 25).map((n) => ([n, roseFunc(n)]))
        //const funcs = _.range(100).map(roseFunc2)
        const sizes = _.range(
            Rose.margin,
            ((height/2 - Rose.margin)),
            ((height/2 - Rose.margin) - Rose.margin)/funcs.length
        )

        ;((function() {
            const [n, f] = _.first(funcs)
            roses.push(new Rose({
                size : _.first(sizes),
                center, n, f,
            }))
        })())

        let spawn = true
        const maxRoseSize = (Math.min(height, width) - 2*Rose.margin)/6
        return (time, dt) => {
            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)
            ctx.globalCompositeOperation = 'hard-light'

            if ((_.last(roses).size > maxRoseSize) || (roses.length > 8)) {
                roses.shift()
            }
            if (!spawn && ((roses.length >= funcs.length) || (_.last(roses).size > (maxRoseSize/2)))) {
                spawn = true
            }
            if (spawn && (_.last(roses).size > (2*maxRoseSize/3))) {
                [n, f] = _.sample(funcs),
                roses.push(new Rose({
                    center, n, f,
                }))
                spawn = false
            }

            for (let i = 0; i < roses.length; i++) {
                roses[i].update(dt)
                roses[i].draw(ctx)
            }
        }
    }} />;

    $ = {
        flex : 1,
    }

    $ResizeableCanvas = {
        flex : 1,
    }
}

