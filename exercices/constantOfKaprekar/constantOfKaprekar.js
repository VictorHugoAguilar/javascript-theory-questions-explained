
const getNumerOfItertions = (numberToCheck) => {

    if (numberToCheck == 0) {
        throw "error not found input number";
    }

    if (String(numberToCheck).length > 4) {
        throw "fail number contain more of fourth digit";
    }

    var itinerations = 0;
    var numberNormalizer = normalizerNumber(numberToCheck);

    if (checkDuplicates(String(numberToCheck).split(''))) {
        return itinerations;
    }

    while(numberNormalizer != 6174){
        numberNormalizer = normalizerNumber(numberNormalizer);

        const originArrays = String(numberNormalizer).split('').sort();
        const reverseArrays = String(numberNormalizer).split('').sort().reverse();

        numberNormalizer = Number(reverseArrays.join('')) - Number(originArrays.join(''));

        itinerations += 1;

        if(itinerations > 7){
            numberNormalizer= 6174
        }
    }

    return itinerations;

}

const normalizerNumber = (number) => {
    if (String(number).length < 4) {
        String.prototype.pad = function (String, len) {
            var str = this;
            while (str.length < len)
                str = String + str;
            return str;
        }
        return String(number).pad("0", 4);
    } else {
        return number;
    }
}


const checkDuplicates = (listNumber) => {
    var duplicates = 0;
    for (let i = 0; i < listNumber.length; i++) {
        const numberToCheck = listNumber[i];
        if (listNumber.filter(n => n == numberToCheck).length > 1) {
            duplicates += 1
        }
    }
    return duplicates == 4;
}

module.exports = getNumerOfItertions; 