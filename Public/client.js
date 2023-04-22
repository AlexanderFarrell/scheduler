function Toggle(id) {
    let ele = document.getElementById(id)
    if (ele.style.display === "none") {
        ele.style.display = "block";
    } else {
        ele.style.display = "none";
    }
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
}

function Search() {

}