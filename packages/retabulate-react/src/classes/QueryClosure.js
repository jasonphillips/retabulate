class QueryClosure {
    constructor(type, key, label, renderId, args) {
        this.type = type;
        this.label = label;
        this.key = key;
        this.renderId = renderId;

        this.child = null;
        this.siblings = [];

        if (type=='statistic') {
            this.arguments = {method: key};
        } else if (key.map) {
            this.arguments = {keys: key};
        } else {
            this.arguments = {key};
        }

        Object.keys(args || {}).map((k) => typeof(args[k])!=='undefined' && this.setArgument(k, args[k]));
        return this;
    }

    setArgument(key, arg) {
        this.arguments[key] = arg;
        return this;
    }

    toString() {
        const args = Object.keys(this.arguments).map((key) => 
            `${key}: ${JSON.stringify(this.arguments[key])}`
        )

        if (this.renderId) args.push(`renderId:"${this.renderId}"`)

        const descendent = this.child
            ? this.child.toString()
            : ' node {leaf} ';

        let props = 'renderId renderIds';
        if (this.type=='classes' || this.type=='transpose') props += ' label';

        let fragment = `_${this.label}: ${this.type}(${args}) { ${props} ${descendent} } `;
        this.siblings.forEach((sibling) => { fragment += sibling.toString() });
        return fragment;
    }

    inject(childClosure) {
        if (!this.child) this.child = childClosure;
        else this.child.inject(childClosure);

        this.siblings.forEach((sibling) => sibling.inject(childClosure));
        return this;
    }

    push(closure) {
        this.siblings.push(closure);
        return this;
    }

}

export default QueryClosure;