import generateHash from './generateHash';

const makeRenderers = (props, context) => {
    context.iterator++;
    const renderId = `r${context.iterator}`;

    const renderProps = {
        // default: pass through unchanged
        props: (pre) => pre,
        styles: (pre) => pre,
    };

    const renderLabelProps = {
        // default: pass through unchanged
        props: (pre) => pre,
        styles: (pre) => pre,
    }

    if (props.cellProps) {
        if (typeof(props.cellProps)==='function') {
            renderProps.props = (pre) => ({...pre, ...props.cellProps(pre)})
        } else {
            renderProps.props = (pre) => ({...pre, ...props.cellProps})
        }
    }

    if (props.formatter) {
        const inner = renderProps.props;
        renderProps.props = (pre) => ({
            ...inner(pre), 
            value: props.formatter(pre.value)
        }) 
    }

    if (props.cellStyles) {
        if (typeof(props.cellStyles)==='function') {
            renderProps.styles = (pre) => ({...pre, ...props.cellStyles(pre)})
        } else {
            renderProps.styles = (pre) => ({...pre, ...props.cellStyles})
        }
    }

    if (props.cellRenderer) {
        renderProps.cellRenderer = props.cellRenderer;
    }

    // label formatters

    if (props.labelProps) {
        if (typeof(props.labelProps)==='function') {
            renderLabelProps.props = (pre) => ({...pre, ...props.labelProps(pre)})
        } else {
            renderLabelProps.props = (pre) => ({...pre, ...props.labelProps})
        }
    }

    if (props.labelStyles) {
        if (typeof(props.labelStyles)==='function') {
            renderLabelProps.styles = (pre) => ({...pre, ...props.labelStyles(pre)})
        } else {
            renderLabelProps.styles = (pre) => ({...pre, ...props.labelStyles})
        }
    }

    if (props.labelRenderer) {
        renderLabelProps.labelRenderer = props.labelRenderer;
    }

    return {
        renderId, 
        renderers: {
            [renderId]: renderProps,
            [`_${renderId}`]: renderLabelProps,
        },
    };
};

export default makeRenderers;