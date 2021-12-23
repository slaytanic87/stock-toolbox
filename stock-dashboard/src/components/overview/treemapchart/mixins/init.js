import JUI from 'juijs-chart'
import ClassicTheme from 'juijs-chart/src/theme/classic.js'
import DarkTheme from 'juijs-chart/src/theme/dark.js'
import TitleWidget from 'juijs-chart/src/widget/title.js'
import LegendWidget from 'juijs-chart/src/widget/legend.js'
import TooltipWidget from 'juijs-chart/src/widget/tooltip.js'
import CrossWidget from 'juijs-chart/src/widget/cross.js'

JUI.use(ClassicTheme, DarkTheme, TitleWidget, LegendWidget, TooltipWidget, CrossWidget);

export default {
    beforeMount: function() {
        const ORIENT_MAP = {
            top: 'top',
            middle: 'center',
            bottom: 'bottom'
        };

        const ALIGN_MAP = {
            left: 'start',
            center: 'middle',
            right: 'end'
        }

        this.brushes = [{
            type: 'treemap',
            clip: this.clip,
            colors: this.colors,
            target: [ 'value' ],
            textOrient: ORIENT_MAP[this.textVerticalAlign],
            textAlign: ALIGN_MAP[this.textAlign],
            showText: this.showText,
            titleDepth: this.titleDepth,
            nodeColor: this.nodeColor
        }];
        this.index = this.brushes.length;
    },
    render: function(createElement) {
        return createElement('div', this.$slots.default);
    }
}