let CURRENT=null; // hold the name of the current page
const SEQUENCE=[]; // holds the names of all available pages

/**
 * gets index of an element in an Array
 */
Array.prototype.indexOf=function(element){
    for(let i=0; i<this.length; i++)
        if(this[i]===element) return i;
    return -1;
}

/**
 * toggles navigation pane
 */
function toggleNavPane(event){
    let navPane=document.getElementById("nav-pane");
    navPane.style.right=(
        navPane.style.right===""? "0px" :
        navPane.style.right==="-250px"? "0px" :
        navPane.style.right==="0px"? "-250px" : "-1"
    );
}

/**
 * brings selected page into view
 */
function togglePage(event){
    let display=getComputedStyle(document.body).getPropertyValue("--display");
    /**
     * normal link functionality is used
     * when the webpage is viewed on smaller devices
     */
    if(display==='"normal"'){
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
            // unhides the hidden pages
            thisPage.style.opacity="1";
            thisPage.style.left="0";
            if(SEQUENCE[i]===selectedPage) break;
            /**
             * hides the pages between current page and selected page
             * thus removing the overlapping effect
             */
            thisPage.style.opacity="0";
            thisPage.style.left=`${-1*direction*100}%`;
        }
    }
}

document.addEventListener("DOMContentLoaded",function(){
    // enables the main content to occupy the rest of the available screen space
    let navBar=document.getElementById("navbar");
    let mainContent=document.getElementById("main-content");
    mainContent.style.minHeight=`calc(100% - ${navBar.offsetHeight}px)`;
    
    // controls the typing effect of the name GEORGE MOBISA
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

    // sets tracking on all the available content pages
    let observer=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>CURRENT=(entry.isIntersecting)?entry.target.id:CURRENT);
    },{threshold:1.0});

    let contentContainers=Array.from(document.getElementsByClassName("content-container"));
    contentContainers.forEach(container=>{
        observer.observe(container); SEQUENCE.push(container.id);
    });
});