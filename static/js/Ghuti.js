let image_size = `6vh`;
let reduced_image_size = `3vh`;
let int;
// const end = new Map();
// end.set(0, 50);
// end.set(39, 37);
// end.set(26, 24);
// end.set(13, 11);

class Ghuti {
  constructor(color, player, pos) {
    this.image = document.createElement("img");
    this.image.src = `../../Image/${color}.png`;
    this.death = true;
    this.pos = pos;
    this.pos_div = document.getElementById(
      `home_${player.id}`
    ).children[0].children[this.pos];
    this.pos_div.appendChild(this.image);
    this.owner = player;
    this.path = -1;
  }

  born(start) {
    this.death = false;
    this.house = start;
    this.path = 0;
    // this.protected = false;
    // this.end=end.get(start)
    this.pos_div.removeChild(this.image);
    this.pos_div = document.getElementById(`Ghor_${start}`);
    this.image.style.height = this.image.style.width = image_size;
    this.pos_div.appendChild(this.image);
  }

  run(step) {
    this.house += step;
    this.path += step;
    if (this.path > 50) {
      // this.pos_div.style.backgroundColor = ;
      this.pos_div = document.getElementById(
        `${this.owner.id}_${this.path - 51}`
      );
      console.log(this.pos_div)
      this.pos_div.style.backgroundColor = "white";
      this.pos_div.appendChild(this.image);
    } else {
      if (this.house > 51) {
        this.house -= 52;
      }
      this.pos_div = document.getElementById("Ghor_" + this.house);
      this.pos_div.appendChild(this.image);
    }
    return this.pos_div
  }
  Getimg() {
    return this.image;
  }
  kill(){
    this.death=true;
    this.path=-1;
    this.pos_div = document.getElementById(
      `home_${this.owner.id}`
    ).children[0].children[this.pos];
    this.pos_div.appendChild(this.image);
    console.log("killing",this.death,this)
  }
}
const kill=(image,color)=>{
  p.
  console.log(image,"ujgfu")
}

const shake = (Ghuti) => {
  return setInterval(function () {
    Ghuti.image.style.display = "none";
    setTimeout(function () {
      Ghuti.image.style.display = "block";
    }, 20);
  }, 200);

  // clearInterval()
};


console.log("hjufgyuwg")