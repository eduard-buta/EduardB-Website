// //--------------------------------------------------------------
// // Global Breakpoints
// //--------------------------------------------------------------
// let windowWidth = window.innerWidth;
// const BREAKPOINTS = {
//   desktop: { min: 992, max: Infinity }, // 992px and above
//   tablet: { min: 768, max: 991 }, // Between 768px and 991px
//   mobileLandscape: { min: 480, max: 767 }, // Between 480px and 767px
//   mobilePortrait: { min: 0, max: 479 }, // Up to 479px
// };

// //--------------------------------------------------------------
// // Debounce Function for Efficient Resize Handling
// //--------------------------------------------------------------
// function debounce(func, wait, immediate) {
//   let timeout;
//   return function () {
//     const context = this,
//       args = arguments;
//     const later = function () {
//       timeout = null;
//       if (!immediate) func.apply(context, args);
//     };
//     const callNow = immediate && !timeout;
//     clearTimeout(timeout);
//     timeout = setTimeout(later, wait);
//     if (callNow) func.apply(context, args);
//   };
// }

// // This function now uses classes to show/hide elements
// function toggleDisplay(element, show) {
//   element.classList.toggle("display-none", !show);
// }

// function handleResize() {
//   windowWidth = window.innerWidth;
// }

// window.addEventListener("resize", debounce(handleResize, 250));

// Listen for the 'focus' event on all elements in the document
document.addEventListener(
  "focus",
  function (event) {
    // Log the currently focused element to the console
    console.log("Focused element:", event.target);
  },
  true,
); // Use capture phase to ensure the event is captured as it descends through the DOM

// ------------------------------ CHECKBOX FUNCTIONALITY -------------------------//

// Template for new checkbox content (moved outside the function)
const template = document.createElement("template");
template.innerHTML = `
  <div class="ellipse-container">
    <div class="hover-effect">
      <div class="hover-ellipse"></div>
      <svg class="hover-checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11.871 9.121">
        <path d="m.436,5.257l3.202,3.178L11.436.686" fill="none" stroke="#EDEDED" stroke-miterlimit="10" stroke-width="1.5" />
      </svg>
    </div>
  </div>
`;

function addCheckboxFunctionality() {
  const checkboxes = document.querySelectorAll(
    ".w-checkbox-input.form_checkbox-field",
  );
  if (checkboxes.length === 0) return;

  let keyboardUsed = false;

  // Event listener to set flag when keyboard is used
  document.addEventListener("keydown", function (event) {
    if (event.key === "Tab") {
      keyboardUsed = true;
    }
  });

  // Event listener to reset flag when mouse is used
  document.addEventListener("mousedown", function () {
    keyboardUsed = false;
  });

  checkboxes.forEach((checkbox) => {
    checkbox.appendChild(template.content.cloneNode(true));

    const checkboxInput = checkbox.nextElementSibling;
    if (checkboxInput && checkboxInput.type === "checkbox") {
      const checkboxID = checkboxInput.id;

      checkboxInput.addEventListener("change", function () {
        checkbox.classList.toggle(`checked-${checkboxID}`, this.checked);
        checkboxInput.setAttribute("aria-checked", this.checked);
        handleConsentChange({ target: checkboxInput });
      });

      // Add focus-visible only if keyboard was used
      checkboxInput.addEventListener("focus", function () {
        if (keyboardUsed) {
          checkbox.classList.add("focus-visible");
        }
      });

      checkboxInput.addEventListener("blur", function () {
        checkbox.classList.remove("focus-visible");
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  addCheckboxFunctionality();
});

// ------------------------------ INPUT FIELD FUNCTIONALITY -------------------------//

// VALIDATION CONSTANTS
// Map of input types (like email, phone, etc.) to their respective regex validations.
const validations = {
  email:
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9-]{2,}|(\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]))/,
  phone: /^[ \/\+\-\(\)0-9]*$/,
  link: /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i,
};

// Error messages that should be displayed for each type of input when validation fails.
const errorMessages = {
  name: "Name is required",
  email: "Invalid email format",
  company: "Company name is required",
  phone: "Invalid phone number format",
  location: "Location is required",
  link: "Invalid link format",
  details: "Project details are required",
};

// Map of combo classes to their respective error text colors
const comboClassColors = {
  "is-footer": {
    textColor: "#0b0f12",
    svgColor: "#0b0f12",
  },
  "is-blog": {
    textColor: "#DB791B",
    svgColor: "#C6C6C6",
  },
  "is-capabilities": {
    textColor: "#fe3636",
    svgColor: "#353A3D",
  },
};

// Set of whitelisted form IDs
const whitelistedFormIDs = new Set([
  "wf-form-contact-form",
  "wf-form-newsletter-form-footer",
  "wf-form-newsletter-form-sidebar",
  "wf-form-capabilities-form",
]);

// UTILITY FUNCTIONS
// Hides the error text label associated with an input element.
const hideErrorText = (input) => {
  const errorText = input.parentElement.querySelector(".text-error-state");
  if (errorText) {
    errorText.classList.add("hidden");
    input.parentElement.classList.remove("is-focused");
  }
};

// Displays the error message label associated with an input. If no error div is found, it creates one.
const showErrorText = (input, message) => {
  let errorText = input.parentElement.querySelector(".text-error-state");
  if (!errorText) {
    errorText = document.createElement("div");
    errorText.className = "text-error-state hidden";
    input.parentElement.appendChild(errorText);
  }
  errorText.textContent = message;
  errorText.classList.remove("hidden");
  input.parentElement.classList.add("is-focused");
  return errorText;
};

// Checks if the input value is valid based on its type. It uses the 'validations' map for this purpose.
const validateInput = (fieldType, value) => {
  if (validations[fieldType]) {
    return validations[fieldType].test(value);
  }
  return value.trim() !== "";
};

//Creates checkmark SVG for valid fields with dynamic color properties
const getColoredSVGDataURL = (color) => {
  const rawSVG = `
    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.3857 19C8.30347 19.0001 6.28566 18.2782 4.67604 16.9574C3.06641 15.6365 1.96458 13.7984 1.55828 11.7562C1.15197 9.71402 1.46634 7.59415 2.4478 5.75777C3.42927 3.92139 5.0171 2.48213 6.94078 1.68523C8.86445 0.888323 11.0049 0.783082 12.9975 1.38744C14.9901 1.99179 16.7114 3.26835 17.8683 4.99959C19.0252 6.73084 19.546 8.80966 19.342 10.8818C19.1379 12.954 18.2217 14.8914 16.7494 16.3638C15.0617 18.0516 12.7726 18.9999 10.3857 19Z" stroke="${color}" stroke-width="1.25" stroke-miterlimit="10"/>
        <path d="M5.89209 10.5209L8.50959 13.1384L14.8846 6.75586" stroke="${color}" stroke-width="1.25" stroke-miterlimit="10"/>
    </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(rawSVG)}")`;
};

// Searches for combo classes in an element and its ancestors for later color styling based on form type.
const findComboClass = (element) => {
  while (element) {
    for (const comboClass in comboClassColors) {
      if (element.classList.contains(comboClass)) {
        return comboClass;
      }
    }
    element = element.parentElement; // Move to the next parent element.
  }
  return null; // Return null if no combo class was found.
};

// Optimize Multiple querySelector Calls
// Cache commonly used selectors
const formInputsCache = new Map();

const getFormInputs = (formElement) => {
  if (!formInputsCache.has(formElement)) {
    const inputs = formElement.querySelectorAll(
      "input[input], textarea[input]",
    );
    formInputsCache.set(formElement, inputs);
  }
  return formInputsCache.get(formElement);
};

// Check if all inputs within a form are valid
const areAllInputsValid = (formElement) => {
  const formInputs = getFormInputs(formElement);
  for (const input of formInputs) {
    const fieldType = input.getAttribute("input");
    if (!fieldType) continue;
    if (!validateInput(fieldType, input.value)) {
      return false;
    }
  }
  return true;
};

// Check if the consent checkbox within a form is checked
const isConsentCheckboxChecked = (formElement) => {
  const consentCheckboxInput =
    formElement.querySelector(".w-checkbox-input").nextElementSibling;
  return consentCheckboxInput && consentCheckboxInput.checked;
};

// Toggle the submit button's state
const toggleSubmitButtonState = (formElement, isEnabled) => {
  if (formElement.id === "wf-form-contact-form") return;

  const submitButtonParent =
    formElement.querySelector(".w-button").parentElement;
  if (!submitButtonParent) return;

  submitButtonParent.classList.toggle("submit-button-enabled", isEnabled);
  submitButtonParent.classList.toggle("submit-button-disabled", !isEnabled);
};

// Check if all inputs within a CONTACT FORM STEP are valid
const areAllInputsInActiveStepValid = () => {
  // Find the active step (that does NOT have the style of "display: none;")
  const activeStep = Array.from(document.querySelectorAll(".form-step")).find(
    (step) => step.style.display !== "none",
  );
  if (!activeStep) return false;

  const stepInputs = activeStep.querySelectorAll(
    "input[input], textarea[input]",
  );

  for (const input of stepInputs) {
    const fieldType = input.getAttribute("input");
    if (!fieldType) continue;
    if (!validateInput(fieldType, input.value)) {
      return false;
    }
  }
  return true;
};

// Check if the current input's parent form is whitelisted with ID
const isInputInWhitelistedForm = (inputElement) => {
  const parentForm = inputElement.closest("form");
  return parentForm && whitelistedFormIDs.has(parentForm.id);
};

// Event handlers
// Main validation handler. It's triggered every time there's an input event.
const handleInput = (event) => {
  // If the input's form is not whitelisted, return early
  if (!isInputInWhitelistedForm(event.target)) return;

  const fieldType = event.target.getAttribute("input");
  if (!fieldType) return;

  const isValid = validateInput(fieldType, event.target.value);

  const foundComboClass = findComboClass(event.target);
  let textColor = "#fe3636"; // default error text color
  let svgColor = "#353A3D"; // default SVG color

  //If combo is found, style accordingly
  if (foundComboClass) {
    textColor = comboClassColors[foundComboClass].textColor;
    svgColor = comboClassColors[foundComboClass].svgColor;
  }

  if (isValid) {
    if (event.target.tagName !== "TEXTAREA") {
      event.target.classList.add("input-valid-state");
      event.target.style.backgroundImage = getColoredSVGDataURL(svgColor); //add SVG checkmark
    }
    hideErrorText(event.target);
  } else {
    event.target.classList.remove("input-valid-state");
    event.target.style.backgroundImage = ""; // remove SVG checkmark

    const errorElement = showErrorText(
      event.target,
      errorMessages[fieldType] || "Invalid input",
    );
    errorElement.style.color = textColor;
  }

  handleConsentChange(event);
};

// Checks validation both for checkbox consent and input fields
const handleConsentChange = (eventArg) => {
  const currentTarget = eventArg ? eventArg.target : event.target;
  const isWhitelisted = isInputInWhitelistedForm(currentTarget);
  if (!isWhitelisted) return;

  const formElement = currentTarget.closest("form");
  if (formElement) {
    const allInputsValid = areAllInputsValid(formElement);
    const consentGiven = isConsentCheckboxChecked(formElement);
    toggleSubmitButtonState(formElement, allInputsValid && consentGiven);
  }
};

// Bind the validation handler to all input fields.
const bindInputValidation = () => {
  const inputs = document.querySelectorAll("input[input], textarea[input]");
  inputs.forEach((input) => {
    input.addEventListener("input", debounce(handleInput, 300));
  });
};

// Additional Logic: Trigger validation for inputs with value on page load
const triggerValidationForPersistedValues = () => {
  const inputs = document.querySelectorAll("input[input], textarea[input]");
  inputs.forEach((input) => {
    if (input.value && isInputInWhitelistedForm(input)) {
      input.dispatchEvent(new Event("input"));
    }
  });
};

bindInputValidation();
triggerValidationForPersistedValues();

