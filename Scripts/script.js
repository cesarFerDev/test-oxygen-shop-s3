
//Módulo Burger Menú

const burgerBtn = document.getElementById("burger-btn");
const menu = document.querySelector(".menu");

burgerBtn.addEventListener("click", () => {
    menu.classList.toggle("menu-desplegable");
}); 

//Módulo percentage bar
const scrollBar = document.getElementById("scroll-bar");

window.addEventListener("scroll", () => {
  let percent = calcPercentage();  
  scrollBar.style.width = `${percent}%`;
});

function calcPercentage() {
    let scrollTop = window.scrollY;
    let docHeight = document.body.offsetHeight;
    let winHeight = window.innerHeight;
    let scrollPercent = scrollTop / (docHeight - winHeight);
    let percent = Math.round(scrollPercent * 100);
    return percent;
}

//Back to top button

const backTop = document.getElementById("return-top");

backTop.addEventListener("click", () => {
     setTimeout(() => {
        document.documentElement.scrollTop = 0;
    },200); 
})

//Modal

const storage = window.sessionStorage;
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("close-modal");
const formDialog = document.getElementById("form-dialog");
const emailDialog = document.getElementById("subscribe");

window.addEventListener("load", () => {
    if (!(modal.open) && storage.getItem("visit") == null) {
        storage.setItem("visit", true);
        setTimeout(()=>{
            modal.showModal();
         },5000);
    }
    
});

window.addEventListener("scroll", () => {
    let percent = calcPercentage();
    if (storage.getItem("visit") == null && percent >= 25 && (!(modal.open))) {
        modal.showModal();
        storage.setItem("visit", true);
    }
});

closeBtn.addEventListener("click", () => {
    modal.close();
});

emailDialog.addEventListener("blur", () => {
    if (!validateMail(emailDialog.value)) {
        emailDialog.style.borderColor = "red";
    } else {
        emailDialog.style.borderColor = "#95989A";
    }
});

formDialog.addEventListener("submit", (event) => {
    event.preventDefault();

    if(validateMail(formDialog.subscribe.value)) {
        //formDialog.submit();  //Comentado para no ser redirigido si se hacee el submit
        modal.close();
        alert("Thank you!");  //Para comprbar que funciona el "submit"
    } else {
        emailDialog.value = "";
        emailDialog.placeholder = "example@mail.com";
        emailDialog.style.borderColor = "red";
    }
});


//Formulario
const form  = document.getElementById("form");
const nombre = document.getElementById("name");
const email = document.getElementById("email");
const checkbox = document.getElementById("consent");
const checkboxText = document.getElementById("conditions");


nombre.addEventListener("blur", () => {  
    if (!(validateName(nombre.value))) {
        nombre.style.borderColor = "red";
    } else {
        nombre.style.borderColor = "#95989A";
    }
});
email.addEventListener("blur", () => {
    if ((!validateMail(form.email.value))) {
        email.style.borderColor = "red";
    } else {
        email.style.borderColor = "#95989A";
    }
});
checkbox.addEventListener("blur", () => { 
    if (!(validateCheckbox())) {
        checkboxText.style.color = "red";
    } else {
        checkboxText.style.color = "#95989A";
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let nameCorrect = validateName(nombre.value);
    let mailCorrect = validateName(form.email.value);
    let checkCorrect = validateCheckbox();


    if(nameCorrect && mailCorrect && checkCorrect) {
        //form.submit();  //Comentado para no ser redirigido si se hacee el submit
        nombre.style.borderColor = "#95989A";  //Reset de campos y estilos
        email.style.borderColor = "#95989A";
        nombre.placeholder = "";
        nombre.value = "";
        email.placeholder = "";
        email.value = "";
        checkbox.checked = false;
        alert("We'll keep you updated!"); //Para comprbar que funciona el "submit"
    } else {
        if (!nameCorrect) {
            nombre.value = "";
            nombre.style.borderColor = "red";
            nombre.placeholder = "Name field must contain between 2 and 100 characters";
        }
        if (!mailCorrect) {
            email.value = "";
            email.style.borderColor = "red";
            email.placeholder = "example@mail.com"
        }
        if (!checkCorrect) {
            checkboxText.style.color = "red";
        }    
    } 
}, false);

//Funciones validación

function validateName(nameCandidate) {  
    if (nameCandidate.length < 2 || nameCandidate.length > 100) {
        return false;
    } else {
        return true;
    }   
}

function validateMail(mailCandidate) { 
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mailCandidate)) {
        return true;
    } else {
        return false;
    }
}

function validateCheckbox() {
    if (checkbox.checked) {
        return true;
    } else {
        return false;
    }
}

//Selector de moneda

const currencySelector = document.getElementById("currency");
const basicPrice = document.getElementById("basic-price");
const proPrice = document.getElementById("pro-price");
const premiumPrice = document.getElementById("premium-price");

let oldValue = currencySelector.value;

currencySelector.addEventListener("change", async() => { 

    let newValue = currencySelector.value;
    let symbol = "";

    if (newValue === "eur") {
        symbol = "€";
    } else if (newValue === "usd") {
        symbol = "$";
    } else {
        symbol = "£";
    }

    try { //Hay que hacer la llamada a la API en cada cambio de moneda para obtener el dato, en una función externa devuelve promesa siempre
        let response = await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/${oldValue}/${newValue}.json`);
        if (response.ok) {
            let data = await response.json();
            let exchange = data[newValue];
            let pro = Math.round(25 * exchange);
            let premium = Math.round(60 * exchange);

            basicPrice.innerHTML = `${symbol}0`;
            proPrice.innerHTML = `${symbol}${pro}`;
            premiumPrice.innerHTML = `${symbol}${premium}`;
        } else {
            console("Error en la petición");
        }
        
    } catch (error) {
        console.log(error);
    }
    
});