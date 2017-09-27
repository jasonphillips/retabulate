import {Children} from 'react';

export const callChildSerializers = (children, context) => {
    if (!children) return [];

    const childs = children.map ? children : (children ? [children] : []);
    // call serialize() method of all children
    return Children.toArray(childs).map((child, index) => 
        child.type.serialize(child.props, index, context)
    );
}

const gatherChildConfig = (children, context) => callChildSerializers(children, context).reduce(
    (combined, {query, renderers, labels}) => ({
        // assemble children siblings horizontally
        query: combined.query ? combined.query.push(query) : query,
        // merge renderer maps
        renderers: Object.assign(combined.renderers, renderers),
        // merge label maps
        labels: Object.assign(combined.labels, labels)
    }), {query: null, renderers: {}, labels: {}}
);

export default gatherChildConfig;