'use strict';
const _ = require('lodash');

module.exports = class Builder {
    constructor() {
        this.cfg = {
            without: [],
            with: [],
            apply: []
        };
    }

    createBase() {
        return {};
    }

    without(field) {
        this.cfg.without.push(field);
        return this;
    }

    with(path, value) {
        this.cfg.with.push({ path, value });
        return this;
    }

    apply(func) {
        this.cfg.apply.push(func);
        return this;
    }

    build() {
        const { cfg } = this;
        const obj = this.createBase();

        cfg.with.forEach(field => _.set(obj, field.path, field.value));
        cfg.without.forEach(field => _.unset(obj, field));
        cfg.apply.forEach(func => func(obj));

        return obj;
    }

    buildMany(count) {
        const objs = [];

        for (let i = 0; i < count; i++) {
            objs.push(this.build());
        }

        return objs;
    }
};
