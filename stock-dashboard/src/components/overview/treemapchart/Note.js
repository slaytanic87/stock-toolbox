import init from "./mixins/init.js";

const ORIENT_MAP = {
    top: 'top',
    middle: 'center',
    bottom: 'bottom'
};

const ALIGN_MAP = {
    left: 'start',
    center: 'middle',
    right: 'end'
};

export default {
    name: 'note',
    mixins: [ init ],
    props: {
        text: {
            type: String,
            required: true,
            default: ''
        },
        align: {
            type: String,
            required: false,
            default: 'center' // center, left, right
        },
        verticalAlign: {
            typ: String,
            required: false,
            default: 'top' // top, bottom, middle
        },
        dx: {
            type: Number,
            required: false,
            default: 0
        },
        dy: {
            type: Number,
            required: false,
            default: 0
        },
        size: {
            type: Number,
            required: false
        },
        color: {
            type: String,
            required: false
        }
    },
    watch: {
        text: function(newVal) {
            this.$parent.chart.updateWidget(this.index, {
                text: newVal
            });

            this.$parent.chart.render(true)
        },
        align: function(newVal, oldVal) {
            if(newVal === oldVal || (newVal !== "left" && newVal !== "center" && newVal !== "right"))
                return;

            this.$parent.chart.updateWidget(this.index, {
                align: ALIGN_MAP[newVal]
            });

            this.$parent.chart.render(true)
        },
        verticalAlign: function(newVal, oldVal) {
            if(newVal === oldVal || (newVal !== "top" && newVal !== "middle" && newVal !== "bottom"))
                return;

            this.$parent.chart.updateWidget(this.index, {
                orient: ORIENT_MAP[newVal]
            });

            this.$parent.chart.render(true)
        }
    },
    beforeMount: function() {
        this.$parent.widgets.push({
            type: 'title',
            text: this.text,
            orient: ORIENT_MAP[this.verticalAlign],
            align: ALIGN_MAP[this.align],
            dx: this.dx,
            dy: this.dy,
            size: this.size,
            color: this.color
        });
    }
}