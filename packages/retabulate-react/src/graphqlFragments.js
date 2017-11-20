import React from 'react';
/*
    this is an alternate export, built for creating graphql fragments
    instead of connecting directly to an apollo client, so that you
    may include that manually in your own higher-level queries
*/

import Tabulation from './components/TabulationFragments';
import Expand from './components/Expand';
import Filter from './components/Filter';
import All from './components/All';
import Transpose from './components/Transpose';
import Axis from './components/Axis';
import Variable from './components/Variable';
import Value from './components/Value';
import Statistic from './components/Statistic';

// alias
const Header = All;

// allows grabbing the fragment from a component having a Tabulation as first child
const TableWithFragment = (component) => {
    if (!component.type || !component.type.getFragment) throw new Error('TableWithFragment should have a Tabulation as child');

    const fragment = component.type.getFragment(component.props);
    return {
        fragment,
        Component: (props) => React.cloneElement(component, {...component.props, props}),
    }
}

export {Tabulation, Expand, Filter, Axis, All, Header, Transpose, Variable, Value, Statistic, TableWithFragment};