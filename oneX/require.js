let lastbuys = [];
let count=0;
let invested = true;


const add = (buys) => {
     count += 1;
    lastbuys.push(buys);
    invested = false;   
 
   console.log(lastbuys[count-2]);
   
}

const get = () => {
  console.log(count);
  console.log(count);
  if(lastbuys[count-2]=== "10"){
   console.log("it is 10");
  }
   console.log(lastbuys[count-2])
  return lastbuys[count-2] 


  
}


module.exports = {add,get}