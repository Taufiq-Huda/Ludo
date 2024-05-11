let dice_height = "15vh";

class Dice {
  constructor(color, position) {
    this.color = color;
    this.div = document.createElement("div");
    this.div.style.backgroundColor = this.color;
    this.div.className = "dice";
    this.div.classList.add(`dice_${position}`);
    document.body.appendChild(this.div);
    this.image = document.createElement("img");
    this.image.style.height = dice_height;
    this.image.style.width = dice_height;
    this.image.src = `../../Image/1.jpg`;
    this.image.style.display = "none";
    this.div.appendChild(this.image);
  }

  throw(point) {
    if (point == null) {
      this.point = Math.floor(Math.random() * 6) + 1;
      // this.point = Math.floor(Math.random() * 3) + 4;
    }
    else{
      this.point=point;
    }
    this.div.removeChild(this.div.firstElementChild);
    this.image = document.createElement("img");
    this.image.style.height = dice_height;
    this.image.style.width = dice_height;
    this.image.src = `../../Image/${this.point}.jpg`;
    this.div.appendChild(this.image);
    return this.point;
  }

  kill() {
    console.log("kill");
  }
}
