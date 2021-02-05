<template>
  <div class="p-4 md:w-1/3 md:mb-0 mb-6 flex flex-col justify-center items-center max-w-sm mx-auto">
    <div class="bg-gray-300 h-56 w-full rounded-lg shadow-md bg-cover bg-center" v-bind:style="`background-image: url(${bg})`"></div>

    <div class=" w-70 bg-indigo-700 -mt-10 shadow-lg rounded-lg overflow-hidden p-5">
      <div class="header-content inline-flex ">
        <div v-bind:class="`category-badge flex-1  h-4 w-4 m rounded-full m-1 bg-${color}-100`">
          <div v-bind:class="`h-2 w-2 rounded-full m-1 bg-${color}-500`"></div>
        </div>
        <div class="category-title flex-1 text-sm">{{propDay}}</div>
      </div>
      <div class="title-post font-medium text-sm">{{propEvent}}</div>
      <div class="summary-post text-base  pt-5">
        <table class="table-auto text-xs">
          <thead>
            <tr>
              <th v-for="(country, index) in propCountries" :key="index">{{country}}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td v-for="(status, index) in propStatus" :key="index">
                <div v-bind:class="`category-badge flex-1  h-4 w-4 m rounded-full m-1`">
                  <div :class="`rounded bg-${status}-700`">
                    <font-awesome-icon v-if="status==='red'" :icon="['fa', 'ban']" class="fa-fw mr-3 justify-center"/>
                    <font-awesome-icon v-else-if="status==='yellow'" :icon="['fa', 'clock']" class="fa-fw mr-3 justify-center"/>
                    <font-awesome-icon v-else-if="status==='green'" :icon="['fa', 'check-circle']" class="fa-fw mr-3 justify-center"/>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import img4 from "../../assets/4.jpg";
import img5 from "../../assets/5.jpg";
import img6 from "../../assets/6.jpg";
import img7 from "../../assets/7.jpg";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBan,
  faCheckCircle,
  faClock
} from "@fortawesome/free-solid-svg-icons";
library.add(faBan, faCheckCircle, faClock);


export default {
  name: "Day",
  created () {
  },
  data () {
    return {

    }
  },
  props: {
    propDay: {
      required: true
    },
    propEvent: {
      required: true
    },
    propCountries: {
      required: true
    },
    propStatus: {
      required: true
    }
  },
  computed: {
    color: function () {
      switch (Math.floor(Math.random() * 3) + 1) {
        case 1: return "purple";
        case 2: return "yellow";
        default: return "blue";
      }
    },
    bg: function () {
      switch (Math.floor(Math.random() * 7) + 1) {
        case 1: return img1;
        case 2: return img2;
        case 3: return img3;
        case 4: return img4;
        case 5: return img5;
        case 6: return img6;
        default:
          return img7;
      }
    }
  }
}
</script>

<style scoped>
.w-70 {
  width: 20rem;
}
</style>
