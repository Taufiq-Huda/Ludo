signup.addEventListener("submit", (event) => {
  console.log("hi1");
  event.preventDefault();

  if (signup.checkValidity()) {
    console.log("vvv", signup.checkValidity());
    event.stopPropagation();
    if (password.value == repeatpassword.value) {
      let url = `http://localhost:3000/register/${Name.value}&${email.value}&${password.value}`;
      let p = fetch(url);
      p.then((response) => {
        return response.json();
      }).then((response) => {
        console.log(response);
      });
    } else {
      console.log("not valid");
    }
  }

  signup.classList.add("was-validated");
});

password.addEventListener("keyup", (e) => {
  let regex = /&/g;
  let warning = Array.from(
    e.target.parentElement.getElementsByClassName("invalid-feedback")
  );
  if (password.value.length < 6) {
    warning[0].classList.add("d-block");
    warning[0].classList.remove("d-none");
  } else {
    warning[0].classList.remove("d-block");
    warning[0].classList.add("d-none");
  }
  if (regex.test(password.value)) {
    warning[1].classList.add("d-block");
    warning[1].classList.remove("d-none");
    password.className = "form-control invalid";
  } else {
    warning[1].classList.remove("d-block");
    warning[1].classList.add("d-none");
    password.className = "form-control valid";
  }
});

repeatpassword.addEventListener("keyup", (e) => {
  let warning = Array.from(
    e.target.parentElement.getElementsByClassName("invalid-feedback")
  )[0];
  if (!(password.value == repeatpassword.value)) {
    warning.classList.remove("d-none");
    warning.classList.add("d-block");
  } else {
    warning.classList.remove("d-block");
    warning.classList.add("d-none");
  }
});

