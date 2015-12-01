import _ from 'lodash'
import Rose from './rose'


// helpers
const randomColor = () => ('#'+(function recur(s, c) {
    return s[Math.floor(Math.random() * s.length)] + (c && recur(s, c-1))
})('23456789AB', 4))

const primes = [2,  3,  5,  7,  11,  13,  17,  19,  23,  29,  31,  37,  41,  43,  47,  53,  59,  61,  67,  71,  73,  79,  83,  89,  97]

window.requestAnimFrame = (function() {
    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           ((cb) => (window.setTimeout(cb, 1000 / 60)))
})()


view Main {
    <ResizeableCanvas render={renderCanvas} />;
    //<h1>(r, θ) = (sin(nθ), θ)</h1>;

    $ = {
        flex : 1,
    }

    $ResizeableCanvas = {
        flex : 1,
    }

    $h1 = {
        textAlign : 'center',
    }

    // render animation func
    const renderCanvas = (ctx, [width, height]) => {
        const roseFunc = (n) => function(theta) {
            return Math.sin(n*theta)
        }

        const roseFunc2 = (n) => function(theta) {
            return 1 + (n*Math.sin(theta))
        }

        const center = [
            Math.floor(width/2),
            Math.floor(height/2)
        ]

        const funcs = _.take(_.drop(primes, 2), 10).map(roseFunc)
        //const funcs = _.range(100).map(roseFunc2)
        const sizes = _.range(
            Rose.margin,
            ((height/2 - Rose.margin)),
            ((height/2 - Rose.margin) - Rose.margin)/funcs.length
        )

        const roses = [
            new Rose({
                f     : _.first(funcs),
                size  : _.first(sizes),
                color : randomColor(),
                center,
            })
        ]

        let i = 1
        ;(function animLoop() {
            window.requestAnimFrame(animLoop)

            ctx.clearRect(0, 0, width, height)
            ctx.fillStyle = 'white'
            ctx.fillRect(0, 0, width, height)
            ctx.globalCompositeOperation = 'hard-light'

            if (roses.length === funcs.length) {
                roses.shift()
            }
            if (_.last(roses).size > (Math.min(height, width) - 2*Rose.margin)/7) {
                roses.push(new Rose({
                    f     : _.sample(funcs),
                    color : randomColor(),
                    center,
                }))
            }

            for (let r of roses) {
                r.draw(ctx, center, i)
                r.update(i)
            }
            i = (i % funcs.length) + 1
        })()
    }
}

