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

upd = document.querySelectorAll('.updTaskbtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updTask)
});
upd = document.querySelectorAll('.updHousebtn')
upd.forEach(function(knapp){
    knapp.addEventListener('submit', updHouse)
})


toggleKnapp = document.querySelectorAll('.toggleButton')
if(toggleKnapp) toggleKnapp.forEach(function(knapp){
    knapp.addEventListener("click",toggleButton)
})
function toggleButton(ev){
    idName = ev.target.getAttribute("toggleTarget")
    let form = document.getElementById(idName);
    form.style.display = form.style.display != "block" ? "block" : "none";  
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

async function deletetask(ev){
    //ev.preventdefault()

    taskId=ev.target.getAttribute("taskId")
    console.log(taskId)
    let response = await fetch("/tasks",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId})
    });
    console.log("hej")
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
        document.getElementById(userTaskId).remove()
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
        if(updateinfo.address!="")document.getElementById(updateinfo.id+":houseAddress").innerText=updateinfo.address
        if(updateinfo.description!="")document.getElementById(updateinfo.id+":houseDesc").innerText=updateinfo.description
        if(updateinfo.price!="")document.getElementById(updateinfo.id+":housePrice").innerText="Pris: "+updateinfo.price
    }
} 