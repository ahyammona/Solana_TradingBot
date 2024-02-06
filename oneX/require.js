
let lastbuys = [];
let count=0;
let invested = true;


const add = (buys) => {
     count += 1;
    lastbuys.push(buys);

    if(lastbuys[count-2] == buys){
      console.log("duplicaet");
    }else{   
   console.log(lastbuys[count-2]);
    }  
}
const get = () => {
  return lastbuys;
}

module.exports = {add,get}