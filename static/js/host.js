let key
host.addEventListener("click", (event) => {
  if ((typenumX.value != "") & (Number(typenumX.value) <= 4)) {
    let url = `/ludo/host/${typenumX.value}`;
    let p = fetch(url);
    p.then((response) => {
      return response.json();
    }).then((response) => {
      if (response.tablecreated) {
        code.innerHTML=response.code
        EnterTable.classList.remove("d-none")
        EnterTable.classList.add("d-block")
        HostTable.classList.add("d-none")
        HostTable.classList.remove("d-block")
        key=response.key;
      } else {
        console.error("table not initiated")
      }
    });
  }
});

enter.addEventListener("click", (event) => {
  window.location.replace(`/ludo/play/${key}`);
});

typenumX.addEventListener("keyup", (e) => {
  if (typenumX.value>4) {
    w_player.classList.add("d-block");
    w_player.classList.remove("d-none");
  }
  else{
    w_player.classList.remove("d-block");
    w_player.classList.add("d-none");
  }
});

