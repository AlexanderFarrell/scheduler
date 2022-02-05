function Center(str, length, fill='.') {
    let borderLength = length - str.length;

    if (borderLength > 0) {
        let half = Math.floor(borderLength/2);
        let otherHalf = borderLength - half;

        let retVal = '';

        for (let i = 0; i < otherHalf; i++) {
            retVal += fill;
        }

        retVal += str;

        for (let i = 0; i < otherHalf; i++) {
            retVal += fill;
        }

        return retVal;
    } else {
        return str;
    }
}

const Print = console.log;


Print(Center('Hey!', 8));
Print(Center('Hey!', 16));
Print(Center('Hey!', 38, '-'));
Print(Center('Hey!', 38, '?'));