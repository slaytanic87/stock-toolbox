
import { Pie } from "vue-chartjs";
export default {
  extends: Pie,
  created () {},
  props: {
    propData: {
        required: true
    }
  },
  watch: {
    propData: function (newVal) {
        //console.log(newVal)
        this.renderChart({
            labels: newVal.labels,
            datasets: [
                {
                    backgroundColor: newVal.backgroundColor,
                    data: newVal.data
                }
            ]
      }, 
      {
          responsive: true, 
          maintainAspectRatio: false
      })
    }
  },
  mounted () {
  },
  methods: {
  }
};

