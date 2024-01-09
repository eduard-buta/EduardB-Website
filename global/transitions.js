//--------------------------------------------------------------
// Global Breakpoints
//--------------------------------------------------------------
let windowWidth = window.innerWidth;
const BREAKPOINTS = {
  desktop: { min: 992, max: Infinity }, // 992px and above
  tablet: { min: 768, max: 991 }, // Between 768px and 991px
  mobileLandscape: { min: 480, max: 767 }, // Between 480px and 767px
  mobilePortrait: { min: 0, max: 479 }, // Up to 479px
};

//--------------------------------------------------------------
// Debounce Function for Efficient Resize Handling
//--------------------------------------------------------------
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// This function now uses classes to show/hide elements
function toggleDisplay(element, show) {
  element.classList.toggle("display-none", !show);
}

function handleResize() {
  windowWidth = window.innerWidth;
}

window.addEventListener("resize", debounce(handleResize, 250));
//--------------------------------------------------------------

CustomEase.create("customEaseOutQuint", "M0,0 C0.230,1.000, 0.320,1.000, 1,1");

//------------------------------------------------------------
//---------------------PRELOADER COMPONENTS---------------------
//--------------------------------------------------------------
const preloaderComponent = document.querySelector(".preloader_component");
const preloaderContent = document.querySelector(".preloader_content");
const preloaderBarFill = document.querySelector(".preloader_bar-fill");
const preloaderBar = document.querySelector(".preloader_bar");
const preloaderProgress = document.querySelector("#preloader-progress");
const hintContainers = document.querySelectorAll(
  ".preloader_hints .hint-container"
);

//--------------------------------------------------------------
//--------------------TRANSITION COMPONENTS---------------------
//--------------------------------------------------------------
// Reference to the transition overlay wrapper
const pageTransition = document.querySelector(".transition-overlay-wrapper");

// Reference to individual transition overlays
const pageTransitionItems = document.querySelectorAll(
  ".transition-overlay-1, .transition-overlay-2"
);

// Reference to the transition text
const transitionTextElement = document.querySelector(
  ".transition-overlay-2 .transitiontext"
);

// Map object for destination-page text content [TBD]
const pageTextMapping = {
  "": "Home text",
  "/about": "About text",
  "/contact": "Contact text",
  "/portfolio": "Portfolio text",
  "/playground": "Playground text",
  "/blog": "Blog text",
  "/blogs/": "Blog post text",
};

//--------------------------------------------------------------
//----------------------PRELOADER LOGIC ------------------------
//--------------------------------------------------------------
// Check whether sessionStorage for preloader exists
const hasSeenPreloader = sessionStorage.getItem("hasSeenPreloader");

// If user has not seen the preloader, show it and set sessionStorage
if (!hasSeenPreloader) {
  // Initial setup
  gsap.set(preloaderComponent, { visibility: "visible", opacity: 1 });
  gsap.set(preloaderBarFill, { width: "0%" });
  preloaderProgress.textContent = "0";
  hintContainers.forEach((hint) => {
    gsap.set(hint.querySelector(".label-xxs-man"), { yPercent: -100 });
    hint.querySelector(".label-xxs-man").dataset.visible = "false";
  });

  function updateProgress(percentage) {
    // Optimizing DOM access and manipulation
    const preloaderBarFillStyle = preloaderBarFill.style;
    gsap.to(preloaderBarFillStyle, { width: percentage + "%", duration: 0.25 });
    preloaderProgress.textContent = percentage;

    // Update hint labels based on loading thresholds
    hintContainers.forEach((hint, index) => {
      const label = hint.querySelector(".label-xxs-man");
      if (percentage >= (index + 1) * 25 && label.dataset.visible === "false") {
        label.style.transform = "translateY(0)";
        label.dataset.visible = "true";
      }
    });

    if (percentage === 100) {
      gsap.to(preloaderContent, {
        opacity: 0,
        duration: 0.5,
        onComplete: expandBars,
      });
    }
  }

  // Function for expanding the bars horizontally
  function expandBars() {
    const halfDifference = (windowWidth - preloaderBarFill.offsetWidth) / 2; // Calculating the difference to be added on both sides

    gsap.to(preloaderBarFill, {
      x: `-=${halfDifference}px`,
      width: `${windowWidth}px`,
      duration: 0.5,
      ease: "Power2.easeInOut",
      delay: 0.2,
      onComplete: expandBarsVertically,
    });

    gsap.to(preloaderBar, {
      x: `-=${halfDifference}px`,
      width: `${windowWidth}px`,
      duration: 0.5,
      ease: "Power2.easeInOut",
    });
  }

  // Function for expanding the bars vertically
  function expandBarsVertically() {
    const fullHeight = window.innerHeight; // Getting the viewport height
    const barTop = preloaderBarFill.getBoundingClientRect().top; // Getting the distance from the bar to the top of the viewport

    // Expanding the filled bar's height and adjusting its position accordingly
    gsap.to(preloaderBarFill, {
      y: `-=${barTop}px`,
      height: `${fullHeight}px`,
      duration: 0.5,
      ease: "Power2.easeInOut",
      onComplete: hidePreloader,
    });

    // No delay for the unfilled bar, but added easing
    gsap.to(preloaderBar, {
      y: `-=${barTop}px`,
      height: `${fullHeight}px`,
      duration: 0.5,
      ease: "Power2.easeInOut",
    });
  }

  function hidePreloader() {
    gsap.to(preloaderComponent, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => {
        preloaderComponent.style.visibility = "hidden";
        // Initialize transitions after the preloader is hidden
        // Check if document has already finished loading
        if (document.readyState === "complete") {
          initializeTransitions();
        } else {
          // If not, wait for it to finish
          window.addEventListener("load", initializeTransitions);
        }
      },
    });
  }

  let percentage = 0;
  let loadingInterval = setInterval(function () {
    if (percentage < 80) {
      let randomChunk = Math.floor(Math.random() * 15) + 1;
      percentage = Math.min(80, percentage + randomChunk);
      updateProgress(percentage);
    } else {
      clearInterval(loadingInterval);
      setTimeout(() => {
        updateProgress(100);
      }, 500);
    }
  }, 250);

  // Set a sessionStorage object to remember that the user has seen the preloader this session
  sessionStorage.setItem("hasSeenPreloader", true);
} else {
  // Initialize transitions if the preloader isn’t supposed to be shown
  window.addEventListener("load", (event) => {
    initializeTransitions();
  });
}

function initializeTransitions() {
  // Animate transition overlays to slide up
  gsap.to(pageTransitionItems, {
    y: "-100vh",
    duration: 1,
    ease: "customEaseOutQuint",
    stagger: {
      amount: 0.1,
    },
    onComplete: function () {
      pageTransition.style.display = "none";
      // loadGSAPAnimations();
      gsap.set(".page-wrapper", { opacity: 1 });
    },
  });

  document.body.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (!link) return;

    const isSamePage =
      link.hostname === window.location.hostname &&
      new URL(link.href).pathname === window.location.pathname;
    const isHashChange = link.href.includes("#") && isSamePage;

    if (
      link.hostname === window.location.hostname &&
      !isHashChange &&
      !link.className.includes("w-pagination") &&
      link.getAttribute("target") !== "_blank"
    ) {
      e.preventDefault();

      const destination = link.href;
      // Update the transition text based on destination if the element exists
      if (transitionTextElement) {
        const url = new URL(destination);
        let pathName = url.pathname;

        if (pathName.endsWith("/")) {
          pathName = pathName.slice(0, -1);
        }

        let textContent;

        if (pageTextMapping[pathName]) {
          textContent = pageTextMapping[pathName];
        } else {
          const pathSegments = pathName.split("/").filter((segment) => segment);

          if (pathSegments.length === 1) {
            // For only one slash link segment, use a default or mapping if available
            textContent = pageTextMapping[pathSegments[0]] || "Navigating...";
          } else if (pathSegments.length > 1) {
            // For links with more slash segments, construct dynamic text or use a specific mapping if available
            textContent =
              pageTextMapping[`${pathSegments[0]}/`] ||
              `Exploring ${pathSegments[0]}...`;
          } else {
            // For any other cases, or if pathSegments is empty, use a default text
            textContent = "Navigating...";
          }
        }
        transitionTextElement.textContent = textContent;
      }

      // Display transition overlay wrapper
      pageTransition.style.display = "block";

      // Animate transition overlays to slide down and then up
      gsap.fromTo(
        pageTransitionItems,
        {
          y: "100vh",
        },
        {
          y: "0vh",
          duration: 1,
          ease: "customEaseOutQuint",
          stagger: {
            amount: 0.25,
          },
          onComplete: () => {
            window.location = destination;
          },
        }
      );
    } else if (isSamePage) {
      // Allow the browser to handle hash changes within the same page, without running the transition.
      return;
    }
  });
}

// Initialize a variable to store the last known height of the page
let lastKnownHeight = document.body.scrollHeight;

// Function to check if the page height has changed
const checkForHeightChange = () => {
  if (document.body.scrollHeight !== lastKnownHeight) {
    lastKnownHeight = document.body.scrollHeight;
    ScrollTrigger.refresh(true); // Adding 'true' to indicate a deep refresh
  }
  requestAnimationFrame(checkForHeightChange);
};

requestAnimationFrame(checkForHeightChange);
