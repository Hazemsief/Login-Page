//switching between login and signup
document.getElementById('show-sign-up').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('sign-in-form').classList.add('hidden');
    document.getElementById('sign-up-form').classList.remove('hidden');
});

document.getElementById('show-sign-in').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('sign-up-form').classList.add('hidden');
    document.getElementById('sign-in-form').classList.remove('hidden');
});

// Check real-time validation
var selectedInput = document.querySelectorAll('.selectedInput');
console.log(selectedInput);

for (var i = 0; i < selectedInput.length; i++) {
  selectedInput[i].addEventListener('input', function(e) {
    var inputId = e.target.id;
    var inputValue = e.target.value;
    validationInputs(inputId, inputValue); 
  });
}

function validationInputs(id, value) {
  var regex = {
    loginEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    loginPassword: /^.{8,}$/,
    regName: /^[A-Z][a-z]{2,20}$/,
    regEmail: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    regPassword: /^.{8,}$/,
    regRePassword: value => value === document.getElementById('regPassword').value 
  };

  var element = document.getElementById(id);
  console.log(element.nextElementSibling);

  var isValid = typeof regex[id] === 'function' ? regex[id](value) : regex[id].test(value);

  if (isValid) {
    element.classList.add('is-valid');
    element.classList.remove('is-invalid');
    element.nextElementSibling.classList.replace('d-block', 'd-none');
    console.log('match');
  } else {
    element.classList.add('is-invalid');
    element.classList.remove('is-valid');
    element.nextElementSibling.classList.replace('d-none', 'd-block');
    console.log('Not match');
  }

  return isValid; 
}

function checkEmailExists(email, callback) {
    fetch('/check-email', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email })
    })
    .then(response => response.json())
    .then(data => {
        callback(data.exists);
    })
    .catch(error => {
        console.error('Error:', error);
        callback(false);
    });
}

// Password eye toggle
function togglePassword(inputId, eyeIconId, eyeSlashIconId) {
    const passwordInput = document.getElementById(inputId);
    const eyeIcon = document.getElementById(eyeIconId);
    const eyeSlashIcon = document.getElementById(eyeSlashIconId);
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.style.display = 'none';
        eyeSlashIcon.style.display = 'inline';
    } else {
        passwordInput.type = 'password';
        eyeIcon.style.display = 'inline';
        eyeSlashIcon.style.display = 'none';
    }
}

// Validate login form
function validateLoginForm() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!validationInputs('loginEmail', email)) {
        alert('Please enter a valid email.');
        return false;
    }
    if (!validationInputs('loginPassword', password)) {
        alert('Please enter a valid password.');
        return false;
    }

    const userName = "User"; 
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', userName);

    window.location.href = 'home.html';
    return true;
}

// Validate sign-up form
function validateSignUpForm() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const rePassword = document.getElementById('regRePassword').value;

    if (!validationInputs('regName', name)) {
        alert('Please enter a valid name.');
        return false;
    }
    if (!validationInputs('regEmail', email)) {
        alert('Please enter a valid email.');
        return false;
    }
    if (!validationInputs('regPassword', password)) {
        alert('Please enter a valid password.');
        return false;
    }
    if (!validationInputs('regRePassword', rePassword)) {
        alert('Passwords do not match.');
        return false;
    }

    checkEmailExists(email, function(exists) {
        if (exists) {
            alert('This email is already registered.');
            return false;
        } else {
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);

            window.location.href = 'home.html';
            return true;
        }
    });

    return false; 
}
