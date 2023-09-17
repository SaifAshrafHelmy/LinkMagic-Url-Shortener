const app = Vue.createApp({
  data() {
    return {
      url: '',
      slug: '',
      created: null
    };
  },
  methods: {
    async createUrl() {
      console.log(this.url, this.slug);
      const response = await fetch('/url', {
        method:'POST',
        headers:{
          'content-type':'application/json'
        },
        body:JSON.stringify({
          url:this.url,
          slug:this.slug
        })
      })
      this.created = await response.json()
    }
  }
});


app.mount('#app');


// const vue = Vue.createApp({
//   data(){
//     return {
//       message:'Hello world'
//     }
//   }
// }).mount('#app')