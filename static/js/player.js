let start=[
  0, 39, 26,13 
]
class player {
  constructor(color,id) {
    this.color=color
    this.id=id
    this.guti = [
      new Ghuti(color,this,0),
      new Ghuti(color,this,1),
      new Ghuti(color,this,2),
      new Ghuti(color,this,3),
    ];
    this.dice= new Dice(color,id);
    this.start=start[id]
  }
}
