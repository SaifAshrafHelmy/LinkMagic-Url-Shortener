const app = Vue.createApp({
  data() {
    return {
      url: '',
      slug: '',
      created: null,
      newLink:null
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
      let beforeCreated = await response.json();
      console.log({beforeCreated})
      console.log(window.location.href);
      newLink= window.location.href + beforeCreated.slug

  
      // console.log("num 2", {beforeCreated})

      // console.log("test")
      // console.log({beforeCreated})
      this.created = beforeCreated;
      this.newLink = newLink;
      // this.created = JSON.stringify(this.created, null, 2)
      
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