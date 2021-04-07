<template>
<div class="container w-full mx-auto pt-20">
  <div class="grid lg:grid-cols-2 gap-2 mx-5">
    <div class="focus-within:border-blue-500 focus-within:text-blue-500 transition-all duration-500 rounded p-1">
      <div class="-mt-4 absolute tracking-wider px-1 uppercase text-xs">
        <p>
          <label for="countryCode" class="bg-gray text-white-600 px-1 my-2">Platform</label>
        </p>
      </div>
      <p>
        <select id="countryCode" class="border rounded px-3 py-2 outline-none text-gray-500">
          <option v-for="(option, index) in options" v-bind:key="index" class="py-1">
            {{option}}
          </option>
        </select>
      </p>
    </div>
  </div>
  <div class="grid lg:grid-cols-2 gap-2 mx-5">
    <tags-input @tagsToSocialMedia="fetchEvents"></tags-input>
  </div>
  <div class="flex justify-between container mx-auto px-6 py-8">
    <div class="w-full lg:w-8/12">
      <social-article v-for="(event, index) in events" v-bind:key="index" :event="event"/>
      <div v-if="events.length === 0" class="text-center">
        <font-awesome-icon :icon="['fa', 'search']" class="fa-fw mr-3"/>
        No search result
      </div>
    </div>
    <div class="-mx-8 w-4/12 hidden lg:block">
      <div class="px-14">
        <h1 class="mb-4 text-xl font-bold text-gray-700">Authors</h1>
        <div class="flex flex-col bg-gray-800 max-w-sm px-4 py-4 mx-auto rounded-lg shadow-md">
          <ul class="-mx-4">
            <li v-for="(user, index) in authors" v-bind:key="index" class="flex items-center mt-6">
              <img src="../../assets/reddit_profil.png" alt="avatar" class="w-10 h-10 object-cover rounded-full mx-4">
              <p>
                <a class="font-bold mx-1 hover:underline">{{user.author}}</a>
                <span class="text-gray-400 md:block sm:block lg:inline-block text-sm text-xs font-light">Created {{user.posts}} Posts</span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
</div>
</template>

<script>
import axios from "axios";
import Article from "@/components/social_media/Article.vue";
import TagsInput from "@/components/social_media/TagsInput";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";
// page example https://tailwindcomponents.com/component/blog-page

library.add(faSearch);

export default {
  name: "SocialMedia",
  components: {
    "social-article": Article,
    "tags-input": TagsInput
  },
  data () {
    return {
      events: [],
      options: ["Reddit"],
      authors: []
    }
  },
  watch: {
    events (newEvents) {
      let map = {};
      let results = [];
      newEvents.forEach((event) => {
        if (map[event.author] === undefined) {
          map[event.author] = {
            posts: 1
          }
        } else {
          let posts = map[event.author].posts
          map[event.author].posts = posts + 1
        }
      });

      Object.keys(map).forEach((key) => {
        let value = map[key];
        results.push({
          author: key,
          posts: value.posts
        });
      })
      this.authors = results.sort((a, b) => {
        return b.posts - a.posts;
      });
    }
  },
  methods: {
    async fetchEvents (tags) {
      let url = "/reddit";
      if (process.env.NODE_ENV === "development") {
        url = "http://localhost:9090/reddit";
      }
      axios.post(url, tags).then((response) => {
        this.events = response.data;
      })
    },
  }
}
</script>

<style scoped>

</style>
