const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = ' ~`!@#$%^&*()_-+={[}]|;"<,>.?/ ';


let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
//Set strength circle colour to grey
setIndicator("#ccc");


//Set Password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;
    const max = inputSlider.max;
    const min = inputSlider.min;

    inputSlider.style.backgroundSize = ( (passwordLength - min) * 100 / ( max - min )) + "% 100%"
}


function setIndicator(color) {
    indicator.style.background = color ;
    // Shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRandomInteger(min,max) {
    return Math.floor(Math.random()*(max - min)) + min ;
}


function getRandomNumber() {
    return getRandomInteger(0,10);
}


function generateLowercase() {
    return String.fromCharCode(getRandomInteger(97,123));
}


function generateUppercase() {
    return String.fromCharCode(getRandomInteger(65,90));
}


function generateSymbols() {
    const randNum = getRandomInteger(0,symbols.length);
    return symbols.charAt(randNum);
}


function calcStrength() {
    let hasUpper = false ;
    let hasLower = false ;
    let hasNum = false ;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true ;
    if (lowercaseCheck.checked) hasLower = true ;
    if (numbersCheck.checked) hasNum = true ;
    if (symbolsCheck.checked) hasSym = true ;

    if( hasUpper && hasLower && ( hasNum || hasSym ) && passwordLength>=8 ) {
        setIndicator("#0f0");
    }
    else if( (hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6 ) {
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}


async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    }, 2000);
    
}


inputSlider.addEventListener('input',(e) => {
    passwordLength = e.target.value ;
    handleSlider();
})


copyBtn.addEventListener('click',(e) => {
    if(passwordDisplay.value){
        copyContent();
    }
})


function handleCheckBoxChange() {
    checkCount = 0 ;
    allCheckBox.forEach( (checkBox) => {
        if(checkBox.checked)
            checkCount++;
    });

    // Special Condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount ;
        handleSlider();
    }
}


allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange)
})


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}


generateBtn.addEventListener('click', () => {
    // None of the check Box Selected
    if(checkCount == 0) 
        return;

    if(passwordLength < checkCount){
        passwordLength = checkCount ;
        handleSlider();
    }

    // Let's start the journey to find the new password
    console.log("starting new journey");
    // remove old password
    password = "" ;

    // Let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked){
    //     password += generateLowercase();
    // }

    // if(numbersCheck.checked){
    //     password += getRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbols();
    // }

    
    let funcArr = [] ;

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numbersCheck.checked)
        funcArr.push(getRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbols);


    // Compulsary Addition
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("Compulsaary Addition");

    // Remaining Addition
    for(let i=0;i<passwordLength - funcArr.length;i++){
        let randIndex = getRandomInteger(0 , funcArr.length);
        password += funcArr[randIndex]();
    }
    console.log("Remaining Addition");

    // Shuffle the Password
    password = shufflePassword(Array.from(password));
    console.log("Password Reshuffle");

    // Show Password in UI or Display
    passwordDisplay.value = password ;
    console.log("Pass Display");

    // Claculate Strength Of Password
    calcStrength();
})