<template>
  <div>
    <div v-if="showDialog" class="overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none justify-center items-center flex">
      <div class="relative w-auto my-6 mx-auto max-w-6xl">
        <div class="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-gray-600 text-purple-50 outline-none focus:outline-none">
          <div class="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t">
            <h3 class="text-3xl font-semibold">Add Stock</h3>
          </div>
          <div class="relative p-6 flex-auto">

            <div class="grid lg:grid-cols-2 gap-6">
                  <div class="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                        <p>
                          <label for="symbol" class="bg-white text-blue-600 px-1">Symbol</label>
                        </p>
                      </div>
                      <p>
                        <input id="symbol" v-model="symbol" autocomplete="false" tabindex="0" type="text" class="py-1 px-1 text-gray-500 outline-none block h-full w-full">
                      </p>
                  </div>
                  <div class="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                        <p>
                          <label for="stockName" class="bg-white text-blue-600 px-1">Stock name</label>
                        </p>
                      </div>
                      <p>
                        <input id="stockName" v-model="stockName" autocomplete="false" tabindex="0" type="text" class="py-1 text-gray-500 px-1 outline-none block h-full w-full">
                      </p>
                  </div>
                  <div class="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                        <p>
                          <label for="entryPrice" class="bg-white text-blue-600 px-1">Entry price</label>
                        </p>
                      </div>
                      <p>
                        <input id="entryPrice" v-model="entryPrice" autocomplete="false" tabindex="0" type="number" class="py-1 px-1 text-gray-500 outline-none block h-full w-full">
                      </p>
                  </div>
                  <div class="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                        <p>
                          <label for="quantity" class="bg-white text-blue-600 px-1">Quantity</label>
                        </p>
                      </div>
                      <p>
                        <input id="quantity" v-model="quantity" autocomplete="false" tabindex="0" type="number" class="py-1 px-1 text-gray-500 outline-none block h-full w-full">
                      </p>
                  </div>
                  <div class="border focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
                        <p>
                          <label for="currency" class="bg-white text-blue-600 px-1">Currency</label>
                        </p>
                      </div>
                      <p>
                        <input id="currency" v-model="currency" autocomplete="false" tabindex="0" type="text" class="py-1 px-1 text-gray-500 outline-none block h-full w-full">
                      </p>
                  </div>
                  <div class="focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 relative rounded p-1">
                    <label class="inline-flex items-center">
                      <input v-model="observeOnly" type="checkbox" class="form-checkbox text-indigo-600" checked>
                      <span class="ml-2">
                        Observe
                        <font-awesome-icon :icon="['fas', 'eye']" class="fa-fw"/>
                      </span>
                    </label>
                  </div>
              </div>

          </div>
          <div class="flex items-center justify-end p-3 border-t border-solid border-gray-300 rounded-b">
            <button @click="addStock()" class="px-4 mr-2 bg-transparent text-white px-4 py-2 border rounded-md hover:bg-indigo hover:border-indigo-500 hover:text-indigo">
              Add
            </button>
            <button @click="closeModal()" class="px-4 bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-white hover:border-indigo-500 hover:text-black">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEye
} from "@fortawesome/free-solid-svg-icons";
library.add(faEye);

export default {
  name: "StockAddModal",
  created() {},
  components: {
  },
  updated() {},
  mounted() {
  },
  beforeDestroy() {
  },
  data() {
    return {
        symbol: "",
        entryPrice: 0,
        stockName: "",
        currency: "",
        quantity: 0,
        observeOnly: true
    };
  },
  methods: {
      addStock() {
        if (!this.symbol || !this.stockName ||
            !this.currency || !this.quantity || this.currency < 0 || this.quantity < 0 ||
            !this.entryPrice) {
            return;
        }

        let body = {
            name: this.symbol,
            companyName: this.stockName,
            entryPrice: this.entryPrice,
            currency: this.currency,
            observeOnly: this.observeOnly,
            quantity: Math.floor(this.quantity)
        }
        let url = "/addStock";
        if (process.env.NODE_ENV === "development") {
            url = "http://localhost:9090/addStock";
        }
        axios.post(url, body).then((res) => {
            console.log(res.status);
        }).catch((error) => {
            console.log(error);
        });
      },
      closeModal() {
        this.showDialog = false;
        this.$emit("addChartModalToDashMessage", this.showDialog);
      }
  },
  props: {
      showDialog: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style>

</style>
