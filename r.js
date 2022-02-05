function PrintAllThisStuff(...stuff) {
    stuff.forEach(thing => {
        console.log(thing);
    })
}






PrintAllThisStuff("Hey")
PrintAllThisStuff("Hey", 7)
PrintAllThisStuff("Hey", 7, 15)


PrintAllThisStuff("Hahaha", 5, 1, 7.0, console.log);