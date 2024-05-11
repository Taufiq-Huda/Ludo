join.addEventListener("click", (event) => {
  if (typecodeX.value != "") {
    let url = `/ludo/join/${typecodeX.value}`;
    let p = fetch(url);
    p.then((response) => {
      return response.json();
    }).then((response) => {
      if (response.permited) {
        //   document.cookie = `user_id : ${response.userid}`;
        //console.log(response.key);
        console.log(`/ludo/play/${response.key}`);
        window.location.replace(`/ludo/play/${response.key}` );
      } else {
        w_table.classList.remove("d-none");
        w_table.classList.add("d-block");
        // console.log("email");
        // console.log("Password", w_pass.classList);
      }
    });
  }
});

host.addEventListener("click", (event) => {
  let cookiearray = decodeURIComponent(document.cookie).split("; ").filter((Element)=>{
    return (Element.split('=')[0]=="user_id")
  })
  if(cookiearray.length!=0){
    window.location.replace("/ludo/host");
    console.log("user loged in");
  }
  else{
    window.location.replace("/signin");
  }
});
