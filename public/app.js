const app = Vue.createApp({
  data() {
    return {
      url: '',
      slug: '',
      created: null,
      newLink: null,
      errorMsg :null
    };
  },
  methods: {
    async createUrl() {
      console.log(this.url, this.slug);
      try {
        const response = await fetch('/url', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            url: this.url,
            slug: this.slug
          })
        });
      
        if (response.ok) {
          const responseData = await response.json();
          const newLink = window.location.href + responseData.slug;
          this.errorMsg=null;
          this.created = responseData;
          this.newLink = newLink;
        } else {
          const errorResponse = await response.json(); // Parse the error response
          if(errorResponse.message){
            this.errorMsg = errorResponse.message;
            console.log(errorResponse.message); // Log the error response
          }
        }
      } catch (error) {
        console.log("FETCH NETWORK ERROR")
        console.log(error);
      }
      
    },
    readUrlErrors (){

    // Get the query string from the URL
    const queryString = window.location.search;

    // Parse the query string into an object
    const queryParams = new URLSearchParams(queryString);

    // Get the value of the 'error' parameter
    const errorMessage = queryParams
    // console.log({errorMessage})

    
    if(errorMessage.get('error')){
      console.log({errorMessage});
      this.errorMsg = errorMessage.get('error').replaceAll("-", " ");
      console.log(errorMessage); // Log the error response
    }


    }
  },
  created(){
        // Call readUrlErrors when the Vue app is created
        this.readUrlErrors();

  }
});


app.mount('#app');


function copyToClipboard(theButton) {
  // Get the text field
  let copyText = document.getElementById("theLink");

  // Select the text field

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.href);

  theButton.innerHTML = "Link Copied!"
}


// const vue = Vue.createApp({
//   data(){
//     return {
//       message:'Hello world'
//     }
//   }
// }).mount('#app')


