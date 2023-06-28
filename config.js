module.exports = {
    port:3000,
    target:[
        {
          url:'http://localhost:17173',
          name:"xx",
          render({port}){
           return `
           sessionStorage.setItem('token','')
           setTimeout(()=>{
           if(window.location.pathname.includes('login')){
               window.location.href = 'http://localhost:${port}'
           }
           },200)`
          }
        }
      ]
}