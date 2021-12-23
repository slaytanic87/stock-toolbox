import init from "./mixins/init.js";
export default {
    name: 'tooltip',
    mixins: [ init ],
    props: {
        names: {
            type: Array,
            required: false
        },
        position: {
            type: String,
            required: false,
            default: 'top' // top, bottom, left, right
        },
        showAnchor: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    watch: {
        names: function(newVal) {
            this.names = newVal;
            this.$parent.chart.render(true);
        }
    },
    beforeMount: function() {
        const self = this;

        this.$parent.widgets.push({
            type: 'tooltip',
            brush: this.brushes,
            orient: this.position,
            anchor: this.showAnchor,
            format: function(data, key) {
                if(self.$parent.$vnode.tag.indexOf('treemap') !== -1) {
                    return {
                        key: data.text,
                        value: this.format(data[key])
                    }
                } else {
                    if(data != null) {
                        return {
                            key: self.names[key],
                            value: this.format(data[key])
                        }
                    } else {
                        return self.names[key];
                    }
                }
            }
        });
    }
}