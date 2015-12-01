import _ from 'lodash'


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
    const render    = view.props.render   || _.noop


    const rerender = _.debounce((canvas) => {
        render(canvas.getContext('2d'), [width, height])
    }, debounceT)

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
}

