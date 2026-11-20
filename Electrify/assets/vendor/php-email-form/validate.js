(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      fetch(action, {
        method: 'POST',
        body: formData,
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (response) {
          if (response.ok) {
            return response.text();
          }
          throw new Error(response.status + ' ' + response.statusText + ' ' + response.url);
        })
        .then(function (data) {
          thisForm.querySelector('.loading').classList.remove('d-block');
          if (data.trim().toLowerCase() === 'success') {
            thisForm.querySelector('.sent-message').classList.add('d-block');
            thisForm.reset();
          } else {
            displayError(thisForm, 'Something went wrong sending your message. Please try again later.');
          }
        })
        .catch(function (error) {
          displayError(thisForm, error);
        });
    });
  });

  function displayError(thisForm, error) {
    thisForm.querySelector('.loading').classList.remove('d-block');
    thisForm.querySelector('.error-message').textContent = error;
    thisForm.querySelector('.error-message').classList.add('d-block');
  }

})();
