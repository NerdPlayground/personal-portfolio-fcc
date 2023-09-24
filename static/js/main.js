document.addEventListener("DOMContentLoaded",function(){
    let name=Array.from("GEORGE MOBISA");
    let nameContainer=document.getElementById("name");
    let counter=0;
    setTimeout(()=>{
        let writeName=setInterval(()=>{
            nameContainer.textContent+=name[counter++];
            if(counter>=name.length){
                clearInterval(writeName);
                setTimeout(()=>nameContainer.nextElementSibling.remove(),1000);
            }
        },250);
    },1000);
});