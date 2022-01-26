console.log('This is Postman Clone');

// Initialize No. of parameters
let addedParamCount = 0;

//Utility Function
// -------********* Very Important ******* -------
//1. Utility function to get DOM element from string 
function getElementFromString(string) {
    let div = document.createElement('div')
    div.innerHTML = string;
    return div.firstElementChild;
}
//Hiding the Parameter box initially
let parametersBox = document.getElementById('parametersBox')
parametersBox.style.display = 'none';

// If the user clicks on params box, hide the json box
let paramsRadio = document.getElementById('paramsRadio')
paramsRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'none';
    document.getElementById('parametersBox').style.display = 'block';
})

// If the user clicks on json box, hide the params box
let jsonRadio = document.getElementById('jsonRadio')
jsonRadio.addEventListener('click', () => {
    document.getElementById('requestJsonBox').style.display = 'block';
    document.getElementById('parametersBox').style.display = 'none';
})

//If user clicks + button , add more parameters
let addParam = document.getElementById('addParam')
addParam.addEventListener('click', (e) => {
    e.preventDefault();
    let params = document.getElementById('params')
    let string = `<div class="row mb-3">
                    <label for="urlField" class="col-sm-2 col-form-label">Parameter ${addedParamCount + 2}</label>
                    <div class="col-md-4">
                        <input type="text" id="parameterKey${addedParamCount + 2}" class="form-control" placeholder="Enter Parameter ${addedParamCount + 2} Key"
                            aria-label="First name">
                    </div>
                    <div class="col-md-4">
                        <input type="text" id="parameterValue${addedParamCount + 2}" class="form-control"
                            placeholder="Enter Parameter ${addedParamCount + 2} Value" aria-label="Last name">
                    </div>
                    <button id="addParam" class="btn btn-primary deleteParam" style="width:auto;">-</button>
                    
                </div>`

    //Converts the element string to DOM----Note here we cant directly append the element.
    let paramElement = getElementFromString(string);
    params.appendChild(paramElement);
    addedParamCount++;

    //Adding an event listener to remove the parameter on clicking (-) button
    let deleteParam = document.getElementsByClassName('deleteParam');
    for (const item of deleteParam) {
        item.addEventListener('click', (e) => {
            e.target.parentElement.remove();
        })
    }
})

//If user clicks on submit button
let submit = document.getElementById('submit')
submit.addEventListener('click', (e) => {
    e.preventDefault()
    // Show please wait in the response box to request patience from the user
    // document.getElementById('responseJsonText').value = "Please wait.. Fetching response...";
    document.getElementById('responsePrism').innerHTML = "Please wait.. Fetching response...";

    //Fetch all the values user has entered
    let url = document.getElementById('url').value
    let requestType = document.querySelector("input[name='requestType']:checked").value;
    let contentType = document.querySelector("input[name='contentType']:checked").value;


    // If user has used params option instead of json, collect all the parameters in an object
    if (contentType == 'params') {
        data = {}; //Creating an empty object
        for (let i = 0; i < addedParamCount + 1; i++) {
            if (document.getElementById('parameterKey' + (i + 1)) != undefined) {
                let key = document.getElementById('parameterKey' + (i + 1)).value;
                let value = document.getElementById('parameterValue' + (i + 1)).value;
                data[key] = value;
            }
            data = JSON.stringify(data);
        }
    }
    else {
        data = document.getElementById('requestJsonText').value
    }

    console.log('url is ', url);
    console.log('requestType is ', requestType);
    console.log('contentType is ', contentType);
    console.log('data is ', data);

    // If Request type is GET invoke fetch api to GET post
    if (requestType == 'GET') {
        fetch(url, {
            method: 'GET',
        })

            //This isnt working :(((((((
            // .then((response)=>{
            //     response.text();
            // })
            //Dont know whyyyyyyyyyyyy, huhhhhhhhhhh

            .then(response => response.text())
            .then(text=>document.getElementById('responsePrism').innerHTML = text)
        // document.getElementById('responsePrism').innerHTML = text;
        Prism.highlightAll();

    }
    else {
        fetch(url, {
            method: 'POST',
            body: data,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(response => response.text())
            .then((text) => {
                document.getElementById('responsePrism').innerHTML = text;
                Prism.highlightAll();
            })
    }
})
