// CREATE ELEMENT
// var newEl = document.createElement('div');

// GET ATTRIBUTE
// document.querySelector('.el').setAttribute('key', 'value');
// document.querySelector('.el').getAttribute('key');

// ADD/REMOVE/TOGGLE CLASS
// document.querySelector('.el').classList.add('class');
// document.querySelector('.el').classList.remove('class');
// document.querySelector('.el').classList.toggle('class');

// REMOVE
// remove('.el');

// function remove(el) {
//   var toRemove = document.querySelector(el);
//   toRemove.parentNode.removeChild(toRemove);
// }

// PARENT
// document.querySelector('.el').parentNode;

// PREV/NEXT ELEMENT
// document.querySelector('.el').previousElementSibling;
// document.querySelector('.el').nextElementSibling;

document.addEventListener("DOMContentLoaded", function() {
  loaded()
});

function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}
// get all data in form and return object
function getFormData() {
  return{
    lastname: document.getElementById('lastname').value,
    email: document.getElementById('email').value,
    firstname: document.getElementById('firstname').value,
    company: document.getElementById('company').value
  }
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  var data = getFormData();         // get the values submitted in the form
  // if( !validEmail(data.email) ) {   // if email is not valid show error
  //   document.getElementById('email-invalid').style.display = 'block';
  //   return false;
  // } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
      if(xhr.status === 200){
        document.getElementById('gform').style.display = 'none';
        document.getElementById('sentence-form-head').innerText = 'Voilà ! Inscription terminée.';
        document.getElementById('sentence-form-content').innerText = 'Vous venez de rejoindre la file d\'attente,' +
          ' nous vous tenons au courant dès que l\'alpha vous sera ouverte.';

      }
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k])
    }).join('&')
    event.preventDefault();           // we are submitting via xhr below

    xhr.send(encoded);
  // }
}
function loaded() {
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  form.addEventListener("submit", handleFormSubmit, false);
};
