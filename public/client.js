console.log("client script");


//Delete för hus
housesbuttons = document.querySelectorAll('.deleteButton')
housesbuttons.forEach(function(knapp){
  knapp.addEventListener('click', deletehouse)
})

async function deletehouse(ev){
    //ev.preventdefault()
    houseId=ev.target.getAttribute("houseid")
    let response = await fetch("/houses",{
        method:"DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: houseId})
    });
    if(response.status==204){
        document.getElementById(houseId).remove()
    }
    else{
        if(response.status) console.log(response.status)
    }
}


//Delete för tasks
el = document.querySelectorAll('.taskDeleteButton')
el.forEach(function(knapp){
  knapp.addEventListener('click', deletetask)
})

async function deletetask(ev){
    //ev.preventdefault()

    taskId=ev.target.getAttribute("taskid")
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



ele = document.querySelectorAll('.taskJoinButton')
ele.forEach(function(knapp){
  knapp.addEventListener('click', jointask)
})

async function jointask(ev){
    //ev.preventdefault()

    taskId=ev.target.getAttribute("taskid")
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