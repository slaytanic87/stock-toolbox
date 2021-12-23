import JUI from "juijs-chart";
import TreemapBrush from "juijs-chart/src/brush/treemap.js";
import props from "./mixins/props.js";
import created from "./mixins/created.js";
import methods from "./mixins/methods.js";
import mounted from "./mixins/mounted.js";
import watch from "./mixins/watch.js";
import init from "./mixins/init.js";

JUI.use(TreemapBrush);

export default {
    name: 'treemap',
    mixins: [init, props, created, methods, mounted, watch],
    props: {
        textAlign: {
            type: String,
            required: false,
            default: 'center' // center, left, right
        },
        textVerticalAlign: {
            typ: String,
            required: false,
            default: 'top' // top, bottom, middle
        },
        showText: {
            type: Boolean,
            required: false,
            default: false
        },
        titleDepth: {
            type: Number,
            required: false,
            default: 1
        },
        nodeColor: {
            type: Function,
            required: false,
            default: null
        }
    },
    methods: {
        convertToData: function (values) {
            let util = JUI.include('util.base');
            let rows = [];

            for (let i = 0; i < values.length; i++) {
                let val = values[i];
                if (util.typeCheck('array', val)) {
                    let row = { index: val[0], text: val[1] };
                    if(val.length === 3 && val[2] > 0) {
                        row['value'] = val[2];
                    }

                    rows.push(row);
                }
            }
            return rows;
        },
        initGraphAxes: function() {
            return {
                data : this.convertToData(this.values)
            }
        }
    },
    beforeMount () {
    }
}