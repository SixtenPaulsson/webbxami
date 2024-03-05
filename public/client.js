console.log("client script");
async function deletehouse(href){

    let response = await fetch(href, {
        method:"DELETE",
    });

    response = await response.json();

    if(response.id) document.getElementById(response.id).remove();
 
}

async function updatehouse(href,text){
    let response = await fetch(href,{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: text })
    });
    response = await response.json();
    if(response.id) document.getElementById("T:"+response.id).innerText=text


}

