<template>
  <div class="flex justify-center pt-10">
    <div class="container w-full max-w-lg">
      <div class="pb-5 flex items-center justify-center text-center">
        <img class="h-28 w-auto"
             src="../assets/sign-up.png"/>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-first-name">
            First Name
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                 id="grid-first-name" type="text" placeholder="Johnnie" v-model="firstName">
          <p class="text-red-500 text-xs italic" v-if="isValueEmpty(firstName)">Please fill out this field.</p>
        </div>
        <div class="w-full md:w-1/2 px-3">
          <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-last-name">
            Last Name
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 id="grid-last-name" type="text" placeholder="Walker" v-model="name">
          <p class="text-red-500 text-xs italic" v-if="isValueEmpty(name)">Please fill out this field.</p>
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-password">
            E-Mail / Username
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 type="email" placeholder="example@mail.com" v-model="eMail">
          <p class="text-red-500 text-xs italic" v-if="isValueEmpty(eMail)">Please fill out this field.</p>
          <p class="text-gray-400 text-xs italic" v-else>Login E-Mail</p>
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-password">
            Password
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 id="grid-password" type="password" placeholder="******************" v-model="password">
          <p class="text-red-500 text-xs italic" v-if="isValueEmpty(password)">Please fill out this field.</p>
          <p class="text-gray-400 text-xs italic" v-else>Make it as long and as crazy as you'd like</p>
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-6">
        <div class="w-full px-3">
          <label class="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" for="grid-password">
            Confirm Password
          </label>
          <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                 id="grid-password" type="password" placeholder="******************" v-model="confirmedPassword">
          <p class="text-red-500 text-xs italic" v-if="isValueEmpty(eMail)">Please fill out this field.</p>
          <p class="text-red-500 text-xs italic" v-else-if="!isPasswordMatched">Confirmed password does not match with the password</p>
          <p class="text-gray-400 text-xs italic" v-else>Repeat your password</p>
        </div>
      </div>
      <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/2 px-3 md:mb-0">
          <button @click="signUp()"
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline rounded"
                  type="button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignUpPage",
  data () {
    return {
      name: null,
      firstName: null,
      eMail: null,
      password: null,
      confirmedPassword: null,
      isSubmit: false,
      isPasswordMatched: true
    }
  },
  methods: {
    isValueEmpty (value) {
      return this.isSubmit && (value === null || value.length === 0);
    },
    changeView (viewName) {
      this.$store.commit("account/setView", viewName);
    },
    checkInput () {
      this.isSubmit = true;
      if (this.password === null || this.password.length === 0) {
        return false;
      }
      if (this.password !== this.confirmedPassword) {
        this.isPasswordMatched = false;
        return false;
      }
      return !this.isValueEmpty(this.name) && !this.isValueEmpty(this.firstName) && !this.isValueEmpty(this.eMail);
    },
    signUp () {
      if (!this.checkInput()) {
        return;
      }
      let url = "/user/create";
      if (process.env.NODE_ENV === "development") {
        url = `http://localhost:9090${url}`;
      }
      axios.post(url, {
        username: this.eMail,
        password: this.password,
        firstName: this.firstName,
        name: this.name
      }).then((resp) => {
        if (resp.status !== 200) {
          console.debug(`backend responses with ${resp.status}`);
          return;
        }
        let authenticatedUser = resp.data;
        this.$cookies.set("credentials", authenticatedUser, "24h");
        this.changeView("MainPage");
      }).catch((err) => {
        console.error(err);
      });
    }
  }
}
</script>

<style scoped>
</style>