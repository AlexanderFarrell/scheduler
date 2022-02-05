let s = "1";
let number_of_zeros = 3003;

for (let i = 0; i < number_of_zeros; i += 3) {
    s += ",000";
}

console.log(s);