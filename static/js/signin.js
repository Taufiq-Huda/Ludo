signin.addEventListener("click", (event) => {
  if ((typeEmailX.value != "") & (typePasswordX.value != "")) {
    let url = `/authenticate/${typeEmailX.value}&${typePasswordX.value}`;
    let p = fetch(url);
    p.then((response) => {
      return response.json();
    }).then((response) => {
      if (response.authenticated) {
        console.log(response.name)
        document.cookie = `user_id = ${response.userid}`;
        document.cookie = `name = ${response.name}`;
        window.location.replace("/");
      } else if (response.error == "Email") {
        w_email.classList.remove("d-none");
        w_email.classList.add("d-block");
        console.log("email");
        console.log("Password", w_pass.classList);
      } else if (response.error == "Password") {
        w_pass.classList.remove("d-none");
        w_pass.classList.add("d-block");
      }
    });
  }
});

typePasswordX.addEventListener("keyup", (e) => {
  if (w_pass.classList.contains("d-block")) {
    w_pass.classList.remove("d-block");
    w_pass.classList.add("d-none");
  }
});

typeEmailX.addEventListener("keyup", (e) => {
  if (w_email.classList.contains("d-block")) {
    w_email.classList.remove("d-block");
    w_email.classList.add("d-none");
  }
});
