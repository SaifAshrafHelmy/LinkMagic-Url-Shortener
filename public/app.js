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
      let curr = window.location.href;
      let shortCurr;
      if(curr.startsWith('https')){
        shortCurr = curr.slice(8,-1)
      }
      else if(curr.startsWith('http')){
        shortCurr = curr.slice(7,-1)
      }
      else{
        shortCurr = curr;
      }
      newLink= shortCurr + beforeCreated.slug

  
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


function copyToClipboard(theButton) {
  // Get the text field
  let copyText = document.getElementById("theLink");

  // Select the text field

   // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.href);
  
  theButton.innerHTML ="Link Copied!"
}


// const vue = Vue.createApp({
//   data(){
//     return {
//       message:'Hello world'
//     }
//   }
// }).mount('#app')