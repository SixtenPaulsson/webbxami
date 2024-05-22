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
ele = document.querySelectorAll('.workerTaskDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteWorkerTask)
})

ele = document.querySelectorAll('.workerHouseDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteWorkerHouse)
})

ele = document.querySelectorAll('.suggestionDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteSuggestion)
})

ele = document.querySelectorAll('.commentDeleteButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', deleteComment)
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

upd = document.querySelectorAll('.updCommentsbtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updComment)
});



toggleKnapp = document.querySelectorAll('.toggleButton')
if(toggleKnapp) toggleKnapp.forEach(function(knapp){
    knapp.addEventListener("click",toggleButton)
})
function toggleButton(ev){
    idName = ev.target.getAttribute("toggleTarget")
    let form = document.getElementById(idName);
    elementVisi = form.style.display != "block" ? "block" : "none";

    //Hides all other elements
    let elements = document.querySelectorAll(".toggleList")  
    if(elements) elements.forEach(function(knapp){
        knapp.style.display = "none"
    });
    form.style.display = elementVisi
}


visBtn = document.querySelectorAll('.visButton')
if(visBtn) visBtn.forEach(function(knapp){
    knapp.addEventListener("click",visToggle)
})
function visToggle(ev){
    ev.preventDefault();    
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

async function deleteComment(ev){
    commentId=ev.target.getAttribute("commentId")
    console.log(commentId)
    let response = await fetch("/comments",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: commentId})
    });
    console.log(response)
    if(response.status==204){
        document.getElementById(commentId).remove()
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




async function deleteWorkerTask(ev){
    //ev.preventdefault()
    console.log(ev)
    workerTaskId=ev.target.getAttribute("workerTaskId")
    let response = await fetch("/workertasks",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: workerTaskId})
    });
    if(response.status==204){
        console.log(workerTaskId)
        document.getElementById(workerTaskId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}

async function deleteWorkerHouse(ev){
    //ev.preventdefault()
    console.log(ev)
    workerHouseId=ev.target.getAttribute("workerHouseId")
    let response = await fetch("/workerhouses",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: workerHouseId})
    });
    if(response.status==204){
        document.getElementById(workerHouseId).remove()
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
        console.log(updateinfo)
        if(updateinfo.taskName)document.getElementById(updateinfo.id+":taskName").innerText="Title: "+updateinfo.taskName
        if(updateinfo.procent)document.getElementById(updateinfo.id+":taskProcent").innerText="Task status: "+updateinfo.procent
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
        if(updateinfo.address)document.getElementById(updateinfo.id+":houseAddress").innerText="Address: "+updateinfo.address
        if(updateinfo.description)document.getElementById(updateinfo.id+":houseDesc").innerText="Description: "+updateinfo.description
        if(updateinfo.price)document.getElementById(updateinfo.id+":housePrice").innerText="Pris: "+updateinfo.price
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
        if(updateinfo.text)document.getElementById(updateinfo.id+":suggestionText").innerText="Title: "+updateinfo.text
        if(updateinfo.desc)document.getElementById(updateinfo.id+":suggestionDesc").innerText="Description: "+updateinfo.description
    }
} 

async function updComment(ev){

    
    ev.preventDefault();
    console.log("asd")
    let form = new FormData(ev.currentTarget)
    let updateinfo = {
        id:ev.target.getAttribute("commentId"),
        text:form.get("text"),
        description:form.get("description"),
    }
    let response = await fetch("/comments",{
        method:"PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateinfo)
    });
    console.log(response)
    if(response.status==202){
        if(updateinfo.text)document.getElementById(updateinfo.id+":commentText").innerText="Title: "+updateinfo.text
        if(updateinfo.desc)document.getElementById(updateinfo.id+":commentDesc").innerText="Description: "+updateinfo.description
    }
} 