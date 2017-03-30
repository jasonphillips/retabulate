class QueryClosure {
    constructor(type, key, label) {
        this.type = type;
        this.label = label;
        this.key = key;
        this.child = null;
        this.siblings = [];

        if (type=='aggregation') {
            this.arguments = {method: key};
        } else {
            this.arguments = {key};
        }

        return this;
    }

    setArgument(key, arg) {
        this.arguments[key] = arg;
        return this;
    }

    toString() {
        const args = Object.keys(this.arguments).map((key) => 
            `${key}:"${this.arguments[key]}"`
        )

        const descendent = this.child
            ? this.child.toString()
            : ' node {leaf} ';

        const props = (this.type=='aggregation' || this.type=='variable') ? '' : ' label ';

        let fragment = `${this.label}: ${this.type}(${args}) { ${props} ${descendent} } `;
        this.siblings.forEach((sibling) => { fragment += sibling.toString() });
        return fragment;
    }

    inject(childClosure) {
        const closure = childClosure.clone();

        if (!this.child) this.child = closure;
        else this.child.inject(closure);

        this.siblings.forEach((sibling) => sibling.inject(closure));
        return this;
    }

    push(closure) {
        this.siblings.push(closure);
        return this;
    }

    clone() {
        const copy = new QueryClosure(this.type, this.key || this.method, this.label);
        if (this.arguments) {
            Object.keys(this.arguments).forEach(key => copy.setArgument(key, this.arguments[key]));
        }
        if (this.child) copy.inject(this.child.clone());
        if (this.siblings) this.siblings.forEach((sibling) => copy.push(sibling.clone()));
        return copy;
    }

}

export default QueryClosure;