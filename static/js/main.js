let CURRENT=null; // hold the name of the current page
const SEQUENCE=[]; // holds the names of all available pages
const PORTFOLIO_OWNER_EMAIL="studytime023@gmail.com"

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

/** 
 * controls the loading animation
*/
function setupLoading(form){
    let submitButton=form.getElementsByClassName("button")[0];
    submitButton.value="Sending...";
    submitButton.disabled=true;
    submitButton.classList.add("disabled-button");
}

/** 
 * displays server response
 * disables the loading animation
*/
function cleanUpLoading(form,content){
    let submitButton=form.getElementsByClassName("button")[0];
    submitButton.value=content.message;
    submitButton.classList.add((content.error)?"error-message":"success-message")
    setTimeout(()=>{
        if(content.error) submitButton.classList.remove("error-message");
        else submitButton.classList.remove("success-message");
        submitButton.classList.remove("disabled-button");
        submitButton.disabled=false;
        submitButton.value="Send Message";
    },6000);
}

/**
 * sends the user's message to the portfolio owner
 */
const contactForm=document.getElementById("contact").getElementsByTagName("form")[0];
contactForm.addEventListener("submit",function(e){
    e.preventDefault();
    setupLoading(contactForm);
    let formdata=new FormData(contactForm);
    let data={
        "name":formdata.get("username"),
        "sender":formdata.get("email"),
        "receiver":PORTFOLIO_OWNER_EMAIL,
        "message":formdata.get("message"),
    }
    url="https://portfolio-api-vwdg.onrender.com/portfolio-api/v1/contact-user/"
    fetch(url,{
        method: "POST",
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data),
    })
    .then(response =>{
        if(!response.ok) throw new Error();
        return response.json();
    })
    .then(content => {
        cleanUpLoading(contactForm,{
            "error":false,
            "message":"Your message has been sent",
        });
        contactForm.reset();
    })
    .catch(error => cleanUpLoading(contactForm,
        {"message":"Your message has not been sent","error":true}
    ));
});

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