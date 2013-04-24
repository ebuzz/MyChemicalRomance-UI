function transformNumbers(symbol) {
    var numbersRegex = RegExp("[\-\+0-9]+");
    var lettersRegex = RegExp("[A-z]+");

    var symbols = symbol.split(numbersRegex);
    var numbers = symbol.split(lettersRegex);

    if (numbers[0] == '') {
        for (var i=1; i<numbers.length; i++) {
            numbers[i-1] = convertToSubOrSup(numbers[i]);
        }
        numbers[numbers.length-1] = "";
    } else {
        for (var i=0; i<numbers.length; i++) {
            numbers[i] = convertToSubOrSup(numbers[i]);
        }
    }


    var convertedSymbol = "";
    for (var i=0; i<symbols.length; i++) {
        convertedSymbol += symbols[i];
        if (numbers[i] !== undefined) {
            convertedSymbol += numbers[i];
        }
    }
    return convertedSymbol;
}

function convertToSubOrSup(number) {
    var convertedNumber = "";
    var numberIsSuper = false;
    for (var i=0; i < number.length; i++) {
        switch(number[i])
        {
            case '1':
                convertedNumber += numberIsSuper ? "\u2071" : "\u2081";
                numberIsSuper = false;
                break;
            case '2':
                convertedNumber += numberIsSuper ? "\u00B2" : "\u2082";
                numberIsSuper = false;
                break;
            case '3':
                convertedNumber += numberIsSuper ? "\u00B3" : "\u2083";
                numberIsSuper = false;
                break;
            case '4':
                convertedNumber += numberIsSuper ? "\u2074" : "\u2084";
                numberIsSuper = false;
                break;
            case '5':
                convertedNumber += numberIsSuper ? "\u2075" : "\u2085";
                numberIsSuper = false;
                break;
            case '6':
                convertedNumber += numberIsSuper ? "\u2076" : "\u2086";
                numberIsSuper = false;
                break;
            case '7':
                convertedNumber += numberIsSuper ? "\u2077" : "\u2087";;
                numberIsSuper = false;
                break;
            case '8':
                convertedNumber += numberIsSuper ? "\u2078" : "\u2088";
                numberIsSuper = false;
                break;
            case '9':
                convertedNumber += numberIsSuper ? "\u2079" : "\u2089";
                numberIsSuper = false;
                break;
            case '0':
                convertedNumber += numberIsSuper ? "\u2070" : "\u2080";
                numberIsSuper = false;
                break;
            case '+':
                numberIsSuper = true;
                convertedNumber += numberIsSuper ? "\u207A" : "\u208A";
                break;
            case '-':
                numberIsSuper = true;
                convertedNumber += numberIsSuper ? "\u207B" : "\u208B";
                break;
        }
    }
    var constructedNumber = "";
    for (var i=0; i < convertedNumber.length; i++) {
        if (i != (convertedNumber.length-1) && (convertedNumber[i] === "\u207B" || convertedNumber[i] === "\u207A")) {
            constructedNumber += convertedNumber[i+1] + convertedNumber[i];
            i++;
        } else {
            constructedNumber += convertedNumber[i];
        }
    }

    return constructedNumber;
}

function getChemicalNamePixelWidth(name) {
    $('canvas')
        .drawText({
            layer: true,
            name: 'measureText',
            fillStyle: "#36c",
            strokeStyle: "#25a",
            strokeWidth: 2,
            x: -100, y: -100,
            font: "36pt Verdana, sans-serif",
            text: name
        });
    var symbolWidth = $('canvas').measureText('measureText').width;
    $("canvas").removeLayer("measureText");
    return symbolWidth;
}

function getChemicalNamePixelWidthWithFontSize(symbol, fontSize) {
    var font = fontSize + "pt Verdana, sans-serif";
    $('canvas')
        .drawText({
            layer: true,
            name: 'measureText',
            fillStyle: "#36c",
            strokeStyle: "#25a",
            strokeWidth: 1,
            x: -100, y:  -100,
            font: font,
            text: symbol
        });
    var symbolWidth = $('canvas').measureText('measureText').width;
    $("canvas").removeLayer("measureText");
    return symbolWidth;
}