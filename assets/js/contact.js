/* Contact form: send through Web3Forms without a page reload. */
(function () {
  "use strict";

  var form = document.getElementById("contact-form");
  if (!form) return;

  var status = form.querySelector("[data-form-status]");
  var submit = form.querySelector('button[type="submit"]');
  var submitLabel = form.querySelector("[data-submit-label]");
  var success = document.getElementById("form-success");
  var reset = document.querySelector("[data-reset-form]");
  var accessKey = form.querySelector('input[name="access_key"]');

  function setStatus(message, state) {
    if (!status) return;
    status.textContent = message || "";
    if (state) status.setAttribute("data-state", state);
    else status.removeAttribute("data-state");
  }

  function setBusy(busy) {
    if (!submit) return;
    submit.disabled = busy;
    if (submitLabel) submitLabel.textContent = busy ? "Sending…" : "Send message";
  }

  function showSuccess() {
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus({ preventScroll: true });
    }
    setStatus("", null);
    setBusy(false);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var key = accessKey ? accessKey.value.trim() : "";
    if (!key || key.indexOf("YOUR_") === 0) {
      setStatus("This form is not configured yet. Please use GitHub for now.", "error");
      return;
    }

    if (!form.reportValidity()) return;

    var honey = form.querySelector('input[name="botcheck"]');
    if (honey && honey.checked) {
      showSuccess();
      return;
    }

    setStatus("Sending…", null);
    setBusy(true);

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.success) {
          showSuccess();
          return;
        }
        throw new Error((result.data && result.data.message) || "Submission failed");
      })
      .catch(function () {
        setStatus("Could not send. Please try again, or find me on GitHub.", "error");
        setBusy(false);
      });
  });

  if (reset) {
    reset.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      if (success) success.hidden = true;
      setStatus("", null);
      var name = form.querySelector('input[name="name"]');
      if (name) name.focus();
    });
  }

  form.addEventListener("input", function () {
    if (status && status.getAttribute("data-state") === "error") setStatus("", null);
  });
})();
