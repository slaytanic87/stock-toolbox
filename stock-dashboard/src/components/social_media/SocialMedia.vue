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
          <option class="py-1">
            Reddit
          </option>
          <option class="py-1">
            Twitter
          </option>
        </select>
      </p>
    </div>
  </div>
  <div class="grid lg:grid-cols-2 gap-2 mx-5">
    <tags-input></tags-input>
  </div>
  <div class="flex justify-between container mx-auto px-6 py-8">
    <div class="w-full lg:w-8/12">
      <social-article></social-article>
      <social-article></social-article>
    </div>
    <div class="-mx-8 w-4/12 hidden lg:block">
      <div class="px-14">
        <h1 class="mb-4 text-xl font-bold text-gray-700">Authors</h1>
        <div class="flex flex-col bg-gray-800 max-w-sm px-6 py-4 mx-auto rounded-lg shadow-md">
          <ul class="-mx-4">
            <li class="flex items-center mt-6"><img
                src="https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=333&amp;q=80"
                alt="avatar" class="w-10 h-10 object-cover rounded-full mx-4">
              <p><a href="#" class="font-bold mx-1 hover:underline">Jane Doe</a><span
                  class="text-gray-400 text-sm font-light">Created 52 Posts</span></p>
            </li>
            <li class="flex items-center mt-6"><img
                src="https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=281&amp;q=80"
                alt="avatar" class="w-10 h-10 object-cover rounded-full mx-4">
              <p><a href="#" class="font-bold mx-1 hover:underline">Lisa Way</a><span
                  class="text-gray-400 text-sm font-light">Created 73 Posts</span></p>
            </li>
            <li class="flex items-center mt-6"><img
                src="https://images.unsplash.com/photo-1500757810556-5d600d9b737d?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=735&amp;q=80"
                alt="avatar" class="w-10 h-10 object-cover rounded-full mx-4">
              <p><a href="#" class="font-bold mx-1 hover:underline">Steve Matt</a><span
                  class="text-gray-400 text-sm font-light">Created 245 Posts</span></p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </div>
</div>
</template>

<script>
import Article from "@/components/social_media/Article.vue";
import TagsInput from "@/components/social_media/TagsInput";
// page example https://tailwindcomponents.com/component/blog-page

export default {
  name: "SocialMedia",
  components: {
    "social-article": Article,
    "tags-input": TagsInput
  }
}
</script>

<style scoped>

</style>
