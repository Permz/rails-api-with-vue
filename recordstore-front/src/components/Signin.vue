<template>
  <div class="max-w-sm m-auto my-8">
    <div class="border p-10 border-grey-light shadow rounded">
      <h3 class="text-2xl mb-6 text-grey-darkest">Sign In!</h3>
      <form @submit.prevent="signin">
        <div class="text-red" v-if="error">{{ error }}</div>

        <div class="mb-6">
          <label for="email" class="label">E-mail Address</label>
          <input type="email" v-model="email" class="input" id="email" placeholder="your_address@example.com">
        </div>

        <div class="mb-6">
          <label for="password" class="label">Password</label>
          <input type="password" v-model="password" class="input" id="password">
        </div>

        <button type="submit" class="font-sans font-bold px-4 rounded curser-corner no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center">Sign In</button>

        <div class="my-4">
          <router-link to="/signup" class="link">Sign Up</router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signin',
  data () {
    email: ''
    password: ''
    error: ''
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  metods: {
    signin () {
      this.$http.plain.post('/signin', {email: this.email, password: this.password})
        .then(responce => this.signinSuccessfull(responce))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessfull (responce) {
      if (!responce.data.csrf) {
        this.signinFailed(responce)
        return
      }

      localStorage.csrf = responce.data.csrf
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/records')
    },
    signinFailed (error) {
      this.error = (error.responce && error.responce.data && error.responce.data.error) || ''
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/records')
      }
    }
  }
}
</script>
