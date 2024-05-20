console.log("client script");


//Delete för hus
housesbuttons = document.querySelectorAll('.deleteButton')
housesbuttons.forEach(function(knapp){
  knapp.addEventListener('click', deletehouse)
})
//Delete för tasks
el = document.querySelectorAll('.taskDeleteButton')
el.forEach(function(knapp){
  knapp.addEventListener('click', deletetask)
})
ele = document.querySelectorAll('.userTaskDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteUserTask)
})

ele = document.querySelectorAll('.userHouseDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteUserHouse)
})

ele = document.querySelectorAll('.suggestionDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteSuggestion)
})

upd = document.querySelectorAll('.updTaskbtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updTask)
});
upd = document.querySelectorAll('.updHousebtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updHouse)
})
upd = document.querySelectorAll('.updSuggestionbtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updSuggestion)
});


toggleKnapp = document.querySelectorAll('.toggleButton')
if(toggleKnapp) toggleKnapp.forEach(function(knapp){
    knapp.addEventListener("click",toggleButton)
})
function toggleButton(ev){
    idName = ev.target.getAttribute("toggleTarget")
    let form = document.getElementById(idName);
    form.style.display = form.style.display != "block" ? "block" : "none";  
}


visBtn = document.querySelectorAll('.visButton')
if(visBtn) visBtn.forEach(function(knapp){
    knapp.addEventListener("click",visToggle)
})
function visToggle(ev){
    ev.preventDefault();
    console.log("asdasd")
    ToggleName = ev.target.getAttribute("toggleTarget")
    houseId = ev.target.getAttribute("houseId")
    form1=document.getElementById(houseId+":HouseInfoCon")
    form2=document.getElementById(houseId+":HouseTasksCon")
    form3=document.getElementById(houseId+":HouseSuggestionsCon")

    form1.style.display = ToggleName == ":HouseInfoCon" ? "block" : "none";
    form2.style.display = ToggleName == ":HouseTasksCon" ? "block" : "none";
    form3.style.display = ToggleName == ":HouseSuggestionsCon" ? "block" : "none"; 
}






async function deletehouse(ev){
    houseId=ev.target.getAttribute("houseid")
    let response = await fetch("/houses",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: houseId})
    });
    console.log(response)
    if(response.status==204){
        document.getElementById(houseId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}

async function deleteSuggestion(ev){
    suggestionId=ev.target.getAttribute("suggestionId")
    let response = await fetch("/suggestions",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: suggestionId})
    });
    console.log(response)
    if(response.status==204){
        document.getElementById(suggestionId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}



async function deletetask(ev){
    //ev.preventdefault()

    taskId=ev.target.getAttribute("taskId")
    console.log(taskId)
    let response = await fetch("/tasks",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId})
    });
    console.log(response)
    if(response.status==204){
        document.getElementById(taskId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
    
}




async function deleteUserTask(ev){
    //ev.preventdefault()
    console.log(ev)
    userTaskId=ev.target.getAttribute("userTaskId")
    let response = await fetch("/usertasks",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userTaskId})
    });
    if(response.status==204){
        console.log(userTaskId)
        document.getElementById(userTaskId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}

async function deleteUserHouse(ev){
    //ev.preventdefault()
    console.log(ev)
    userHouseId=ev.target.getAttribute("userHouseId")
    let response = await fetch("/userhouses",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userHouseId})
    });
    if(response.status==204){
        document.getElementById(userHouseId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}


async function updTask(ev){
    ev.preventDefault();
    let form = new FormData(ev.currentTarget)
    let updateinfo = {
        id:ev.target.getAttribute("taskid"),
        procent:form.get("procent"),
        taskName:form.get("taskName")
    }
    if(updateinfo.procent>100) updateinfo.procent=100
    let response = await fetch("/tasks",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateinfo)
    });
    console.log(response)
    if(response.status==202){
        if(updateinfo.taskName!="")document.getElementById(updateinfo.id+":taskName").innerText=updateinfo.taskName
        if(updateinfo.procent!="")document.getElementById(updateinfo.id+":taskProcent").innerText=updateinfo.procent+"-100"
    }




} 
async function updHouse(ev){
    ev.preventDefault();
    let form = new FormData(ev.currentTarget)
    let updateinfo = {
        id:ev.target.getAttribute("houseId"),
        address:form.get("address"),
        description:form.get("description"),
        price:form.get("price")
    }
    let response = await fetch("/houses",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateinfo)
    });
    console.log(response)
    if(response.status==202){
        if(updateinfo.address!="")document.getElementById(updateinfo.id+":houseAddress").innerText="Address: "+updateinfo.address
        if(updateinfo.description!="")document.getElementById(updateinfo.id+":houseDesc").innerText="Description: "+updateinfo.description
        if(updateinfo.price!="")document.getElementById(updateinfo.id+":housePrice").innerText="Pris: "+updateinfo.price
    }
} 


async function updSuggestion(ev){
    ev.preventDefault();
    let form = new FormData(ev.currentTarget)
    let updateinfo = {
        id:ev.target.getAttribute("suggestionId"),
        text:form.get("text"),
        description:form.get("description"),
    }
    let response = await fetch("/suggestions",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateinfo)
    });
    console.log(response)
    if(response.status==202){
        if(updateinfo.text!="")document.getElementById(updateinfo.id+":suggestionText").innerText="Title: "+updateinfo.text
        if(updateinfo.desc!="")document.getElementById(updateinfo.id+":suggestionDesc").innerText="Description: "+updateinfo.description
    }
} 