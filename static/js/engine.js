const socket = io();
const myName = document.cookie.split(";")[1].split("=")[1];
let p = [];
let CurrentPlayer, local_id;

const creatPlayer = () => {
  color = ["red", "blue", "green", "yellow"];
  for (let index = 0; index < totalPlayer; index++) {
    p.push(new player(color[index], index));
  }
  CurrentPlayer = p[0];
  CurrentPlayer.dice.div.firstChild.style.display = "block";
  if (local_id == 0) {
    CurrentPlayer.dice.div.addEventListener("click", dice_clicked);
  }
};

socket.emit("i-am-joining", myName, totalPlayer, (res) => {
  local_id = res.local_id;
  if (!res.every_one) {
    res.players.forEach((player) => {
      let li = document.createElement("li");
      li.innerHTML = `${player.name} has joined`;
      list.appendChild(li);
    });
  } else {
    main.style.display = "grid";
    waiting.style.display = "none";
    creatPlayer();
  }
});


socket.on("player-joined", (name) => {
  console.log("done");
  let li = document.createElement("li");
  li.innerHTML = `${name} has joined`;
  list.appendChild(li);
});

socket.on("everyone-joined", () => {
  main.style.display = "grid";
  waiting.style.display = "none";
  creatPlayer();
});

socket.on("dice_thrown", (res) => {
  p[res.local_id].dice.throw(res.point);
});

socket.on("Change_Player", () => {
  Change_Player()
});

socket.on("guti-run", (res) => {
  p[res.local_id].guti[res.guti_id].run(res.point);
});

socket.on("guti-kill", (res) => {
  p[res.local_id].guti[res.guti_id].kill();
});

socket.on("new-guti-born", (res) => {
  p[res.local_id].guti[res.guti_id].born(p[res.local_id].start);
});

let point;
let add_shake = [];
let next;

let Change_Player = () => {
  if (CurrentPlayer.id==p[local_id].id) {
    socket.emit("Change_Player")
  }
  CurrentPlayer.dice.div.firstChild.style.display = "none";
  if (CurrentPlayer.id == p[p.length - 1].id) {
    CurrentPlayer = p[0];
  } else {
    let index;
    p.forEach((value, i) => {
      if (CurrentPlayer.id == value.id) index = i;
    });
    CurrentPlayer = p[index + 1];
  }
  CurrentPlayer.dice.div.firstChild.style.display = "block";
  if (CurrentPlayer.id == local_id) {
    CurrentPlayer.dice.div.addEventListener("click", dice_clicked);
  }
};

let remove_shake = () => {
  add_shake.forEach((time) => {
    clearInterval(time);
  });
  add_shake = [];
};

let select_guti = (e) => {
  remove_shake();
  let Guti = CurrentPlayer.guti.filter((element) => {
    element.Getimg().removeEventListener("click", select_guti);
    return element.Getimg() == e.target;
  })[0];
  let Ghor = Guti.run(point);
  socket.emit("run-guti", Guti.pos, point);
  if (Ghor.childNodes.length > 1) {
    let a = Ghor.childNodes[0].src.split("/").reverse()[0].split(".")[0];
    if (a == CurrentPlayer.color) {
      Array.from(Ghor.childNodes).forEach((element) => {
        element.style.height = element.style.width = reduced_image_size;
      });
    } else {
      let guti = p
        .filter((element) => {
          return (
            Ghor.childNodes[0].src.split("/").reverse()[0].split(".")[0] ==
            element.color
          );
        })[0]
        .guti.filter((element) => {
          return Ghor.childNodes[0] == element.image;
        })[0];
      guti.kill();
      socket.emit("kill-guti", guti.pos,guti.owner.id);
    }
  }
  Change_Player();
};

let six = (e) => {
  remove_shake();
  let selected = CurrentPlayer.guti.filter((g) => {
    g.Getimg().removeEventListener("click", six);
    return g.Getimg() == e.target;
  })[0];
  if (selected.death) {
    selected.born(CurrentPlayer.start);
    socket.emit("guti-born", selected.pos);
  } else {
    selected.run(6);
    socket.emit("run-guti", selected.pos, 6);
  }
};

let dice_clicked = (e) => {
  point = CurrentPlayer.dice.throw(null);

  socket.emit("dice_clicked", point);

  if (point == 6) {
    CurrentPlayer.guti.forEach((guti) => {
      if (guti.path <= 50) {
        add_shake.push(shake(guti));
        guti.Getimg().addEventListener("click", six);
      }
    });
  } else {
    CurrentPlayer.dice.div.removeEventListener("click", dice_clicked);

    let alive = CurrentPlayer.guti.filter((element) => {
      return element.death == false;
    });

    if (alive.length == 0) {
      setTimeout(Change_Player, 1000);
    } else if (alive.length == 1) {
      if (alive[0].path < 50 || point < 56 - alive[0].path) {
        alive[0].run(point);
        socket.emit("run-guti", alive[0].pos, point);
      }
      setTimeout(Change_Player, 1000);
    } else {
      alive.forEach((guti) => {
        if (guti.path < 50 || point < 56 - guti.path) {
          add_shake.push(shake(guti));
          guti.Getimg().addEventListener("click", select_guti);
        }
      });
    }
  }
};
