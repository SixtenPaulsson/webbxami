console.log("client script");
if(document.querySelector(".deleteButton")){
    document.querySelector(".deleteButton").addEventListener("click",deletehouse);
}


async function deletehouse(ev){
    //ev.preventdefault()
    
    let response = await fetch("/houses",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ev.target.getAttribute("houseid") })
    });
    console.log(response)
}

async function updatehouse(localhost,text){
    let response = await fetch(href,{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text })
    });
    response = await response.json();
    if(response.id) document.getElementById("T:"+response.id).innerText=text


}

