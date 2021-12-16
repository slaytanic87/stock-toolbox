<template>
  <div class="max-w-lg m-1">
      <div class="relative">
        <input v-model="textInput"
               v-on:keyup.enter="addTag()"
               @keyup="search()"
               class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
               placeholder="Enter some tags">
        <div :class="open ? 'block' : 'hidden'">
          <div class="absolute z-40 left-0 mt-2 w-full">
            <div class="py-1 text-black bg-white rounded shadow-lg border border-gray-300">
              <a class="block py-1 px-5 cursor-pointer hover:bg-indigo-600 hover:text-white">
                Hit enter "<span class="font-semibold">{{textInput}}</span>"
              </a>
            </div>
          </div>
        </div>
        <!-- selections -->
          <div v-for="(tag, index) in tags" v-bind:key="tag" class="bg-purple-600 inline-flex items-center text-sm rounded mt-2 mr-1">
            <div class="tag">
              <span class="ml-2 mr-1 leading-relaxed truncate max-w-xs text-gray-200"
                    @click="selectTag(tag)">{{tag}}
              </span>
            </div>
            <button @click="removeTag(index)" class="w-6 h-8 inline-block align-middle text-gray-500 hover:text-gray-600 focus:outline-none">
              <font-awesome-icon :icon="['fa', 'times']" class="mr-2 fa-inverse"/>
            </button>
          </div>
        <!-- end selection -->
      </div>
  </div>
</template>

<script>
import axios from "axios";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTimes
} from "@fortawesome/free-solid-svg-icons";
library.add(faTimes);

export default {
  name: "TagsInput",
  props: {
    propTags: {
      required: false
    }
  },
  created () {
    this.fetchTags();
  },
  data () {
    return {
      open: false,
      tags: [],
      textInput: ""
    }
  },
  watch: {
  },
  methods: {
    addTag () {
      this.textInput = this.textInput.trim();
      if (!this.textInput || 0 === this.textInput.length) {
        return;
      }
      if (this.textInput.includes(",")) {
        this.textInput.split(",").forEach(function (val) {
          this.tags.push(val);
        }, this);
      } else {
        this.tags.push(this.textInput);
      }
      this.clearSearch();
    },
    removeTag (index) {
      this.tags.splice(index, 1);
    },
    search () {
      this.toggleSearch();
    },
    clearSearch () {
      this.textInput = "";
      this.toggleSearch();
    },
    toggleSearch () {
      this.open = this.textInput !== ''
    },
    async fetchTags() {
      let url = "/tags";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/tags";
      }
      let user = this.$cookies.get("credentials");
      axios.post(url, user).then((res) => {
        this.tags = res.data;
        if (this.tags.length > 0) {
          this.selectTag(this.tags[0]);
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    selectTag (tag) {
      this.$emit("tagsToSocialMedia", [tag]);
    }
  }
}
</script>

<style scoped>
.tag {
  cursor: pointer;
}
</style>