document.addEventListener("DOMContentLoaded", function() {
    const inputSlider = document.querySelector("[data-lengthSlider]");
    const lengthDisplay = document.querySelector("[data-lengthNumber]");
    const passwordDisplay = document.querySelector("[data-passwordDisplay]"); // ✅ Fixed selector
    const copyBtn = document.querySelector("[data-copy]");
    const copyMsg = document.querySelector("[data-copyMsg]");
    const uppercaseCheck = document.querySelector("#uppercase");
    const lowercaseCheck = document.querySelector("#lowercase");
    const numberCheck = document.querySelector("#numbers");
    const symbolCheck = document.querySelector("#symbols");
    const indicator = document.querySelector("[data-indicator]");
    const generateBtn = document.querySelector(".generatebutton");
    const allCheckbox = document.querySelectorAll("input[type=checkbox]");

    const Symbols = " !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

    let password = "";
    let passwordLength = 10;
    let checkCount = 0;

    function handleSlider() {
        inputSlider.value = passwordLength;
        lengthDisplay.innerText = passwordLength;
    }

    handleSlider();

    function setIndicator(color) {
        indicator.style.backgroundColor = color;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateRandomNumber() {
        return getRndInteger(0, 10);
    }

    function generateLowerCase() {
        return String.fromCharCode(getRndInteger(97, 123));
    }

    function generateUpperCase() {
        return String.fromCharCode(getRndInteger(65, 91));
    }

    function generateSymbol() {
        const randNum = getRndInteger(0, Symbols.length);
        return Symbols.charAt(randNum);
    }

    function calcStrength() {
        let hasUpper = uppercaseCheck.checked;
        let hasLower = lowercaseCheck.checked;
        let hasNum = numberCheck.checked;
        let hasSym = symbolCheck.checked;

        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
            setIndicator("#0f0"); // Strong
        } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
            setIndicator("#ff0"); // Medium
        } else {
            setIndicator("#f00"); // Weak
        }
    }

    async function copyContent() {
        try {
            await navigator.clipboard.writeText(passwordDisplay.innerText);
            copyMsg.innerText = "Copied!";
        } catch (e) {
            copyMsg.innerText = "Failed!";
        }

        copyMsg.classList.add("active");
        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000);
    }

    function shufflePassword(array) {
        if (!array || array.length === 0) { 
            console.error("shufflePassword received an empty or undefined array!");
            return "";
        }
    
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    
        return array.join(""); // ✅ Convert array back to string
    }
    

    function handleCheckBoxChange() {
        checkCount = 0;
        allCheckbox.forEach((checkbox) => {
            if (checkbox.checked) {
                checkCount++;
            }
        });

        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    }

    allCheckbox.forEach((checkbox) => {
        checkbox.addEventListener("change", handleCheckBoxChange);
    });

    inputSlider.addEventListener("input", (e) => {
        passwordLength = parseInt(e.target.value, 10);
        handleSlider();
    });

    copyBtn.addEventListener('click', () => {
        if (passwordDisplay.value) {
            copyContent();
        }
    });

    generateBtn.addEventListener("click", () => {
        if (checkCount <= 0) return;
        if (passwordLength < checkCount) {
            passwordLength = checkCount;
            handleSlider();
        }
    
        password = "";
        let funcArr = [];
    
        if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
        if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
        if (numberCheck.checked) funcArr.push(generateRandomNumber);
        if (symbolCheck.checked) funcArr.push(generateSymbol);
    
        // Compulsory addition
        for (let i = 0; i < funcArr.length; i++) {
            password += funcArr[i]();
        }
    
        // Remaining addition
        for (let i = 0; i < passwordLength - funcArr.length; i++) {
            let randIndex = getRndInteger(0, funcArr.length);
            password += funcArr[randIndex]();
        }
    
        // shuffle function call
        password = shufflePassword(password.split("")); // Convert string to array before shuffling
        console.log("Shuffle done:", password);
    
        // Display in UI
        passwordDisplay.value = password;
        console.log("UI addition done");
    
        // Calculate strength
        calcStrength();
    });
    
});