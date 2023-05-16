function Toggle(...ids) {
    ids.forEach(id => {
        let ele = document.getElementById(id)
        if (ele.style.display === "none") {
            ele.style.display = "block";
        } else {
            ele.style.display = "none";
        }
    })
}

function ToggleClass(...classes) {
    classes.forEach(c => {
        let elements = document.getElementsByClassName(c)
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].style.display === "none") {
                elements[i].style.display = "block";
            } else {
                elements[i].style.display = "none";
            }
        }
    })
}

function CreateTabs(starting_id, ids, tab_ids) {
    let active = document.getElementById(starting_id)

    // Set Up by hiding each id
    for (let i = 0; i < ids.length; i++){
        const id = ids[i];
        let tab = document.getElementById(id[i])
        let element = document.getElementById(tab_ids[i])

        tab.style.display = "none";
        tab.addEventListener('click', () => {
            active.style.display = "none";
            active = element
            active.style.display = "initial"
        })
    }

    // Show the initial ID
    active.style.display = "initial";

    console.log("Set Up Tabs!")
}

async function GetJson(url) {
    let response = await fetch(url);
    return await response.json();
}

async function PostData(url, data) {
    return await fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function Search() {

}

function SetGoal(id, status) {
    console.log(id, status)
    PostData('/planner/update', {
        goal_id: id,
        status: status
    })
}

function SetGoalMax(id, max) {
    console.log(id, max)
    PostData('/planner/update/max', {
        goal_id: id,
        max: max
    })
}

async function DeleteGoal(id) {
    console.log("Deleting: ", id)
    try {
        await PostData('/planner/delete/' + id, {})
        document.getElementById('goal' + id).remove()
    } catch (e) {
        console.log(e)
        document.getElementById('goal' + id).innerHTML +=
            `<div class="error">Could not delete!</div>`
    }
}



