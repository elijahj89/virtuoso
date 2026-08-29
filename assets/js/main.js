/* Virtuoso — progressive enhancement only. The page is fully readable
   and the form is fully usable without any of this. */
(function () {
  'use strict';

  /* --- Current year in the footer ------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* --- Image fallback --------------------------------------------------
     Photography lives in assets/img/ and is optional. If a file is absent
     the sections fall back to their ink-toned backgrounds, which are
     designed to stand on their own rather than look broken. */
  function retire(img) {
    var holder = img.closest('.hero__media, .giveback__bg, .split__media');
    (holder || img).setAttribute('hidden', '');
  }

  Array.prototype.forEach.call(document.images, function (img) {
    img.addEventListener('error', function () { retire(img); });
    /* This script is deferred, so an image may have already failed by the
       time the listener is attached — that error event is gone. A complete
       image with no intrinsic width did not decode. */
    if (img.complete && img.naturalWidth === 0) retire(img);
  });

  /* --- Lead form -------------------------------------------------------- */
  var form = document.getElementById('lead-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');

  var MESSAGES = {
    'parent-name': 'Please tell us your name.',
    'email': 'Please enter an email address we can reply to.',
    'student-age': 'Please enter the student’s age.',
    'instrument': 'Please choose an instrument.',
    'experience': 'Please choose an experience level.',
    'format': 'Please choose a preferred format.',
    'consent': 'Please confirm we may contact you.'
  };

  function errorSlot(id) {
    return form.querySelector('[data-error-for="' + id + '"]');
  }

  function setError(field, message) {
    var slot = errorSlot(field.id);
    if (slot) slot.textContent = message || '';
    if (message) field.setAttribute('aria-invalid', 'true');
    else field.removeAttribute('aria-invalid');
  }

  function validateField(field) {
    var value = (field.value || '').trim();

    if (field.type === 'checkbox') {
      if (field.required && !field.checked) {
        setError(field, MESSAGES[field.id] || 'This field is required.');
        return false;
      }
      setError(field, '');
      return true;
    }

    if (field.required && !value) {
      setError(field, MESSAGES[field.id] || 'This field is required.');
      return false;
    }

    if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      setError(field, 'That email address doesn’t look quite right.');
      return false;
    }

    if (field.type === 'number' && value) {
      var n = Number(value);
      var min = Number(field.min), max = Number(field.max);
      if (isNaN(n) || (field.min && n < min) || (field.max && n > max)) {
        setError(field, 'Please enter an age between ' + field.min + ' and ' + field.max + '.');
        return false;
      }
    }

    setError(field, '');
    return true;
  }

  var fields = Array.prototype.slice.call(
    form.querySelectorAll('input:not([type="hidden"]):not(#botcheck), select, textarea')
  );

  fields.forEach(function (field) {
    field.addEventListener('blur', function () {
      if (field.required || (field.value || '').trim()) validateField(field);
    });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  function showStatus(message, ok) {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('form__status--ok', !!ok);
    status.hidden = false;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var firstInvalid = null;
    fields.forEach(function (field) {
      if (!validateField(field) && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      showStatus('Please correct the highlighted fields and try again.', false);
      firstInvalid.focus();
      return;
    }

    /* Honeypot — a real person never fills this in. */
    var honey = form.querySelector('#botcheck');
    if (honey && honey.value) return;

    var endpoint = form.getAttribute('data-endpoint');
    var accessKey = form.getAttribute('data-access-key');

    var payload = {};
    new FormData(form).forEach(function (value, key) {
      if (key !== 'botcheck') payload[key] = value;
    });

    if (!endpoint || !accessKey) {
      /* Not yet wired to a mailbox. Say so plainly rather than faking a
         success state — see the TODO block in index.html. */
      showStatus(
        'This form isn’t connected to a mailbox yet, so nothing was sent. ' +
        'Add a Web3Forms access key in index.html to go live. ' +
        '(Your entries are valid and were logged to the browser console.)',
        false
      );
      if (window.console) console.log('[Virtuoso] Lead payload:', payload);
      return;
    }

    payload.access_key = accessKey;
    payload.subject = 'Virtuoso — new evaluation request';
    payload.from_name = 'Virtuoso website';

    submit.disabled = true;
    var originalLabel = submit.textContent;
    submit.textContent = 'Sending…';

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (response) { return response.json().catch(function () { return {}; }); })
      .then(function (data) {
        if (data && data.success) {
          form.classList.add('form--sent');
          showStatus(
            'Thank you — your request has reached us. We’ll be in touch within two ' +
            'business days to arrange the evaluation lesson.',
            true
          );
          form.reset();
        } else {
          throw new Error((data && data.message) || 'Submission failed');
        }
      })
      .catch(function () {
        showStatus(
          'Something went wrong sending your request. Please email us directly at ' +
          'hello@virtuoso.academy and we’ll pick it up from there.',
          false
        );
      })
      .then(function () {
        submit.disabled = false;
        submit.textContent = originalLabel;
      });
  });
})();
