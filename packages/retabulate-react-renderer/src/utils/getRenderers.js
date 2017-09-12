export const mergeCellRenderers = (idOrIds, props, renderers, isHeader) => {
    // headers are targeted by label or by renderId key; cells by renderIds array
    const renderIds = (isHeader) ? [idOrIds] : idOrIds;
    // pass through all prop modifier functions
    const mergedProps = renderIds.reduce((builtProps, rid) => 
      renderers[rid] ? renderers[rid].props(builtProps) : builtProps
    , props);
    // pass through style modifiers
    const mergedStyles = renderIds.reduce((styles, rid) => 
      renderers[rid] ? Object.assign(styles, renderers[rid].styles(mergedProps)) : styles
    , {});
  
    delete mergedStyles.value;
    return {...mergedProps, style: mergedStyles};
}

export const getRenderer = (cell, renderers) => {
    // find deepest possible cell renderer
    const cellRenderer = cell.renderIds.reduce(
      (last, next) => (renderers[next] && renderers[next].cellRenderer)
        ? renderers[next].cellRenderer : last, false
    );
    return cellRenderer;
}

export const getLabelRenderer = (id, renderers) => {
    return (renderers[id] && renderers[id].labelRenderer)
      && renderers[id].labelRenderer;
}