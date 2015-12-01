import _ from 'lodash'
import AnimationFrame from 'animation-frame'


const animFrame = new AnimationFrame(30)
let frameId;

// A view with a canvas that always fills it up.
view ResizeableCanvas {
    <canvas ref="canvas"
        width={width}
        height={height}>
    </canvas>;


    // sane defaults for props
    let width       = view.props.width    || 600
    let height      = view.props.height   || 480

    const debounceT = view.props.debounce || 350 // milliseconds

    const render    = view.props.render   || () => _.noop

    const rerender = _.debounce((canvas) => {
        const _render = render(canvas.getContext('2d'), [width, height])
        animFrame.cancel(frameId)
        let then = Date.now()
        ;(function __rerender() {
            frameId = animFrame.request(function _rerender(time) {
                const now = Date.now()
                const dt = now - then
                then = now
                _render(time, dt)
                __rerender()
            })
        })()
    }, debounceT/3)

    const resize = (canvas) => {
        canvas.width  = width  = canvas.parentNode.offsetWidth
        canvas.height = height = canvas.parentNode.offsetHeight
    }

    on.mount(() => {
        const canvas = view.refs.canvas
        on.delay(debounceT*2, () => {
            resize(canvas)
            // reflow hack - http://stackoverflow.com/a/3485654/672346
            canvas.style.display = 'none'
            canvas.offsetHeight
            canvas.style.display = ''
            rerender(canvas)
        })
    })

    on.resize(window, _.debounce(() => {
        resize(view.refs.canvas)
        rerender(view.refs.canvas)
    }, debounceT))

    on.click(window, () => {
        resize(view.refs.canvas)
        rerender(view.refs.canvas)
    })
}

