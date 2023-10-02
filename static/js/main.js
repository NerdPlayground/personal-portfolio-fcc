let CURRENT=null;
const SEQUENCE=[];

Array.prototype.indexOf=function(element){
    for(let i=0; i<this.length; i++)
        if(this[i]===element) return i;
    return -1;
}

function togglePage(event){
    event.preventDefault();
    let selectedPage=event.target.innerText.toLowerCase();
    if(CURRENT===selectedPage) return;
    
    let currentPage=document.getElementById(CURRENT);
    let currentIndex=SEQUENCE.indexOf(CURRENT);
    let nextIndex=SEQUENCE.indexOf(selectedPage);
    let direction=(currentIndex-nextIndex>0)? -1 : 1;

    currentPage.style.left=`${-1*direction*100}%`;
    for(let i=currentIndex+direction;;i+=direction){
        let thisPage=document.getElementById(SEQUENCE[i]);
        thisPage.style.opacity="1";
        thisPage.style.left="0";
        if(SEQUENCE[i]===selectedPage) break;
        thisPage.style.opacity="0";
        thisPage.style.left=`${-1*direction*100}%`;
    }
}

document.addEventListener("DOMContentLoaded",function(){
    let socials=document.getElementById("socials");
    let welcomeSections=document.getElementById("welcome-section");
    welcomeSections.style.minHeight=`calc(100% - 25px - ${socials.offsetHeight}px)`;

    let navBar=document.getElementById("navbar");
    let contentSection=document.getElementById("content-section");
    contentSection.style.minHeight=`calc(100% - 25px - ${navBar.offsetHeight}px)`;

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

    let observer=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>CURRENT=(entry.isIntersecting)?entry.target.id:CURRENT);
    },{threshold:1.0});

    let contentContainers=Array.from(document.getElementsByClassName("content-container"));
    contentContainers.forEach(container=>{
        observer.observe(container); SEQUENCE.push(container.id);
    });
});