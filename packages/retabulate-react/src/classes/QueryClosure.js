// serialize obj {"key": "value", "another": "value"} to gql {key: "value", another: "value"}
// -- quotes around keys (normal JSON stringify) are rejected in gql args
export const toGqlObjectArg = (obj) => 
    '{' + Object.keys(obj).map(k => `${k}: ${JSON.stringify(obj[k])}`)  + '}'
;

class QueryClosure {
    constructor(type, key, label, renderId, args) {
        this.type = type;
        this.label = label;
        this.key = key;
        this.renderId = renderId;

        this.child = null;
        this.siblings = [];

        if (type=='statistic') {
            this.arguments = {method: JSON.stringify(key)};
        } else if (key && key.map) {
            this.arguments = {keys: JSON.stringify(key)};
        } else if (type=='all') {
            this.arguments = {label: JSON.stringify(key)};
        } else {
            this.arguments = {key: JSON.stringify(key)};
        }

        Object.keys(args || {}).map((k) => typeof(args[k])!=='undefined' && this.setArgument(k, args[k]));
        return this;
    }

    setArgument(key, arg) {
        if (key==='mapping') {
            this.arguments[key] = `[ ${arg.map(a => toGqlObjectArg(a))} ]`
            return this;
        }
        this.arguments[key] = JSON.stringify(arg);
        return this;
    }

    toString() {
        const args = Object.keys(this.arguments).map((key) => 
            `${key}: ${this.arguments[key]}`
        )

        if (this.renderId) args.push(`renderId:"${this.renderId}"`)

        const descendent = this.child
            ? this.child.toString()
            : ' node {leaf} ';

        let props = 'renderId renderIds';
        if (this.type=='classes' || this.type=='transpose' || this.type=='all') props += ' label';

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