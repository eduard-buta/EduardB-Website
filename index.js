document.addEventListener("DOMContentLoaded", function () {
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
    updateBadgePosition();
    updateClientTabs();
    initGsapAnimation();
  }

  window.addEventListener("resize", debounce(handleResize, 250));

  //--------------------------------------------------------------
  // Portfolio section add "New" badge to logo wrapper on mobile
  //--------------------------------------------------------------
  // Caching DOM elements for performance
  const badge = document.querySelector(".highlighted-project_badge");
  const logoWrapper = document.querySelector(".project_logo-wrapper");
  const metaWrapper = document.querySelector(".highlighted-project_meta");

  function updateBadgePosition() {
    if (badge && logoWrapper && metaWrapper) {
      if (windowWidth <= BREAKPOINTS.mobileLandscape.max) {
        logoWrapper.appendChild(badge);
      } else {
        metaWrapper.appendChild(badge);
      }
    }
  }

  updateBadgePosition(); // Run initially in case the page loads on a smaller screen

  //--------------------------------------------------------------
  // Portfolio section reverse categories alignment using Mutation Observer
  //--------------------------------------------------------------
  if (windowWidth > BREAKPOINTS.mobileLandscape.max) {
    const projectsContainer = document.querySelector(".projects_collection");

    if (!projectsContainer) return; // Early exit if the container is not found

    const callback = function (mutationsList, observer) {
      let hasUpdated = false;

      for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length) {
          const projectsItems = document.querySelectorAll(
            ".projects_collection .projects_item",
          );

          projectsItems.forEach((item, index) => {
            // Only process the item if it hasn't been updated yet
            if (!hasUpdated) {
              const categoriesList = item.querySelector(
                ".projects-categories_list.w-dyn-items",
              );
              if (categoriesList && (index + 1) % 2 === 0) {
                categoriesList.classList.add("is-reversed");
                hasUpdated = true; // Mark that we've made an update
              }
            }
          });

          // If an update has been made, disconnect the observer
          if (hasUpdated) {
            mutationObserver.disconnect();
            break; // Exit the loop early
          }
        }
      }
    };

    const mutationObserver = new MutationObserver(callback);
    const config = { childList: true, subtree: true };
    mutationObserver.observe(projectsContainer, config);
  }

  //--------------------------------------------------------------
  // Capabilities Deck Section Button State Change on Click
  //--------------------------------------------------------------
  const capabilitiesFormWrapper = document.querySelector(
    ".capabilities-form_layout-wrapper",
  );
  if (!capabilitiesFormWrapper) return;

  const capabilitiesInputs = capabilitiesFormWrapper.querySelector(
    ".form-input_group.is-capabilities",
  ).children;
  const mobileHorizontalInputs = capabilitiesFormWrapper.querySelector(
    ".form-input_group.is-mobile-horizontal",
  ).children;
  const capabilitiesButton = document.querySelector(".button.is-capabilities");
  const capabilitiesButtonText = capabilitiesButton.querySelector(
    ".button_text.is-capabilities",
  );

  // Optimized function to get the natural height of an element
  function __getNaturalHeight(element) {
    const clone = element.cloneNode(true);
    clone.style.visibility = "hidden";
    clone.style.maxHeight = "none";
    clone.style.position = "absolute";
    document.body.appendChild(clone);

    const height = clone.offsetHeight;

    document.body.removeChild(clone);
    return height;
  }

  const formNaturalHeight = __getNaturalHeight(capabilitiesFormWrapper);
  const safetyMargin = 50;
  const maxHeightWithMargin = formNaturalHeight + safetyMargin;

  // Initial GSAP setup
  gsap.set(
    [capabilitiesFormWrapper, capabilitiesInputs, mobileHorizontalInputs],
    { autoAlpha: 0 },
  );
  gsap.set(capabilitiesFormWrapper, {
    scaleY: 0,
    transformOrigin: "0% 0%",
    display: "none",
    maxHeight: 0,
  });
  gsap.set([capabilitiesInputs, mobileHorizontalInputs], { y: -20 });

  capabilitiesButton.addEventListener("click", function () {
    const isFormVisible =
      gsap.getProperty(capabilitiesFormWrapper, "scaleY") === 1;

    capabilitiesButtonText.textContent = "Fill the form";
    capabilitiesButtonText.style.backgroundColor = "#818181";
    capabilitiesButton.style.borderColor = "#818181";
    capabilitiesButton.style.pointerEvents = "none";

    if (!isFormVisible) {
      const formTimeline = gsap.timeline();

      formTimeline
        .to(capabilitiesFormWrapper, {
          scaleY: 1,
          autoAlpha: 1,
          display: "flex",
          maxHeight: maxHeightWithMargin + "px",
          duration: 0.5,
          ease: "power2.out",
          onComplete: () => {
            // Reset will-change property once animation is complete
            capabilitiesFormWrapper.style.willChange = "auto";
          },
        })
        .to([capabilitiesInputs, mobileHorizontalInputs], {
          autoAlpha: 1,
          y: 0,
          stagger: 0.2,
          ease: "power2.out",
          duration: 0.5,
        });
    }
  });

  //--------------------------------------------------------------
  // Testimonials Section Swiper Script Settings
  //--------------------------------------------------------------
  const numberWithZero = (num) => (num < 10 ? "0" + num : num.toString());
  const testimonialSliders = document.querySelectorAll(".testimonial_slider");
  testimonialSliders.forEach((testimonialSlider) => {
    const slides = testimonialSlider.querySelectorAll(
      ".swiper-slide.is-slider-content",
    );
    const totalSlides = numberWithZero(slides.length);

    document.querySelector(".swiper-number-total").textContent = totalSlides;

    const numberSwiperElement = testimonialSlider.querySelector(
      ".swiper.is-slider-numbers",
    );
    const contentSwiperElement = testimonialSlider.querySelector(
      ".swiper.is-slider-content",
    );
    const nextElement = testimonialSlider.querySelector(".swiper-next");
    const prevElement = testimonialSlider.querySelector(".swiper-prev");

    const testimonialNumberSwiper = new Swiper(numberSwiperElement, {
      slidesPerView: 1,
      speed: 750,
      height: 32,
      direction: "vertical",
      loop: true,
    });

    const testimonialContentSwiper = new Swiper(contentSwiperElement, {
      slidesPerView: 1,
      speed: 1500,
      autoplay: false, // Disabled by default, controlled by IntersectionObserver
      keyboard: true,
      spaceBetween: 150,
      navigation: {
        nextEl: nextElement,
        prevEl: prevElement,
        disabledClass: "swiper-button-disabled",
      },
      loop: true,
    });

    testimonialContentSwiper.controller.control = testimonialNumberSwiper;
    testimonialNumberSwiper.controller.control = testimonialContentSwiper;
  });

  // IntersectionObserver Options
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15,
  };

  const testimonialsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const contentSwiperElement = entry.target.querySelector(
          ".swiper.is-slider-content",
        );
        if (contentSwiperElement && contentSwiperElement.swiper) {
          contentSwiperElement.swiper.params.autoplay = {
            delay: 8000,
            disableOnInteraction: false,
          };
          contentSwiperElement.swiper.autoplay.start();
        }
      } else {
        const contentSwiperElement = entry.target.querySelector(
          ".swiper.is-slider-content",
        );
        if (contentSwiperElement && contentSwiperElement.swiper) {
          contentSwiperElement.swiper.autoplay.stop();
        }
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".testimonial_slider")
    .forEach((testimonialSlider) => {
      testimonialsObserver.observe(testimonialSlider);
    });

  //--------------------------------------------------------------
  // Function to Initialize Tab Change Animation
  //--------------------------------------------------------------
  function initTabAnimation() {
    if (windowWidth < BREAKPOINTS.desktop.min) {
      return; // Exit if not on desktop
    }

    const tabMenu = document.querySelector(".clients-tabs_menu.w-tab-menu");
    const tabs = Array.from(tabMenu.getElementsByClassName("clients-tab_link"));
    const tabContent = document.querySelector(
      ".clients-tabs_content.w-tab-content",
    );

    // Variable to store the interval ID
    let intervalId = null;

    // Remove existing event listeners and clear existing interval if present
    function cleanUp() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
      tabs.forEach((tab) => tab.removeEventListener("click", onTabClick));
    }

    // Function to change active tab and its associated content
    function changeActiveTab() {
      const currentTab = tabMenu.querySelector(".w--current");
      const currentContentId = currentTab.getAttribute("href").substring(1);
      const currentContent = tabContent.querySelector(`#${currentContentId}`);

      let newTab;
      do {
        newTab = tabs[Math.floor(Math.random() * tabs.length)];
      } while (newTab === currentTab);

      const newContentId = newTab.getAttribute("href").substring(1);
      const newContent = tabContent.querySelector(`#${newContentId}`);

      // Update tab and content states
      currentTab.classList.remove("w--current");
      currentTab.setAttribute("aria-selected", "false");
      currentContent.classList.remove("w--tab-active");

      newTab.classList.add("w--current");
      newTab.setAttribute("aria-selected", "true");
      newContent.classList.add("w--tab-active");
    }

    // Function to handle tab click and reset timer
    function onTabClick() {
      cleanUp();
      intervalId = setInterval(changeActiveTab, 3000);
    }

    cleanUp();

    // Add click event listener to each tab
    tabs.forEach((tab) => tab.addEventListener("click", onTabClick));

    // Initialize the interval for tab change
    intervalId = setInterval(changeActiveTab, 3000);

    // Intersection observer to trigger animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && intervalId === null) {
          intervalId = setInterval(changeActiveTab, 3000);
        } else if (!entry.isIntersecting && intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      });
    });

    observer.observe(tabMenu);
  }

  function updateClientTabs() {
    if (windowWidth >= BREAKPOINTS.desktop.min) {
      initTabAnimation();
    }
  }

  // Initialize Tab Animation Conditionally Based on Breakpoint
  if (windowWidth >= BREAKPOINTS.desktop.min) {
    initTabAnimation();
  }

  //--------------------------------------------------------------
  // Process section snapping, horizontal scroll and responsive functionality
  //--------------------------------------------------------------
  const section = document.querySelector(".section_home-process");

  if (windowWidth >= BREAKPOINTS.desktop.min) {
    const observerIntersection = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          ScrollTrigger.refresh();
        }
      });
    });
    observerIntersection.observe(section);
  }

  // GSAP ScrollTrigger animation for the process component
  let currentScrollTrigger;

  function initGsapAnimation() {
    // If there's a current ScrollTrigger, kill it and reset the affected DOM elements
    if (currentScrollTrigger) {
      currentScrollTrigger.kill();
      gsap.set(".process_component", { clearProps: "all" });
    }

    // If viewport is above or equal to 992px, initialize the GSAP animation
    if (windowWidth >= BREAKPOINTS.desktop.min) {
      const xOffset = "-400vw";
      const endExtension = "0vw";

      gsap.set(".process_component", { willChange: "transform" });

      currentScrollTrigger = gsap.to(".process_component", {
        x: xOffset,
        ease: "none",
        scrollTrigger: {
          trigger: ".process_component",
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=400%" + endExtension,
          snap: 0.25,
          onUpdate: (self) => {
            currentScrollTrigger = self;
          },
          onToggle: (self) => {
            if (!self.isActive) {
              gsap.set(".process_component", { clearProps: "willChange" });
            }
          },
        },
      });

      gsap.ticker.lagSmoothing(0);
    }
    ScrollTrigger.refresh();
  }

  initGsapAnimation();

  ///////////////////////////////////////////////////////////////////////////

  // Process headers & lists toggling for Tablet & below
  document.querySelectorAll(".process_step-heading").forEach((el) => {
    el.addEventListener("click", toggleStepDetails);
  });
  document.querySelectorAll(".process_phase-heading").forEach((el) => {
    el.addEventListener("click", toggleScopeList);
  });

  function toggleStepDetails(event) {
    if (windowWidth >= BREAKPOINTS.desktop.min) return;

    let target = event.target.closest(".process_step-heading");
    if (!target) return;

    let details = target.nextElementSibling;
    let isOpen = parseFloat(details.style.opacity) === 1;

    gsap.killTweensOf(details.children);
    gsap.killTweensOf(details);

    if (isOpen) {
      // Close the dropdown
      gsap.to(details, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        ease: "power3.out",
        onComplete: () => (details.style.pointerEvents = "none"),
      });
    } else {
      // Open the dropdown
      details.style.pointerEvents = "auto";
      gsap.set(details.children, { autoAlpha: 0, y: -50 }); // Set initial state

      // Animate parent container
      gsap.to(details, {
        height: "auto",
        opacity: 1,
        marginBottom: "2em",
        ease: "power3.inOut",
        onStart: () => {
          // Start the children's animation in conjunction with the parent's
          gsap.to(details.children, {
            duration: 0.3,
            stagger: 0.15,
            autoAlpha: 1,
            y: 0,
          });
        },
      });
    }
  }

  function toggleScopeList(event) {
    if (windowWidth >= BREAKPOINTS.desktop.min) return;

    let target = event.target.closest(".process_phase-heading");
    if (!target) return;

    let chevron = target.querySelector(".process_phase-chevron");
    let scopeList = target.nextElementSibling;
    let isOpen = parseFloat(scopeList.style.opacity) === 1;

    let parentDetails = target.closest(".process_step-details");
    let initialHeight = parentDetails.clientHeight;

    gsap.killTweensOf(scopeList);
    gsap.killTweensOf(parentDetails);
    gsap.killTweensOf(chevron);

    if (isOpen) {
      gsap.to(scopeList, {
        height: 0,
        opacity: 0,
        marginBottom: 0,
        willChange: "transform",
        ease: "power3.out",
        onUpdate: () => {
          let newHeight = parentDetails.clientHeight;
          parentDetails.style.height =
            parseFloat(parentDetails.style.height) -
            (initialHeight - newHeight) +
            "px";
        },
        onComplete: () => {
          scopeList.style.pointerEvents = "none";
        },
      });

      // Rotate the chevron back to 0 and toggle the color class
      gsap.to(chevron, {
        rotation: 0,
        ease: "power3.out",
      });
      chevron.classList.remove("chevron-active-color");
      chevron.classList.add("chevron-default-color");
    } else {
      scopeList.style.pointerEvents = "auto";
      let targetHeight = scopeList.scrollHeight;
      scopeList.style.height = "0px";
      gsap.to(scopeList, {
        height: targetHeight,
        opacity: 1,
        marginBottom: "2em",
        ease: "power3.inOut",
        onUpdate: () => {
          let newHeight = parentDetails.clientHeight;
          parentDetails.style.height =
            parseFloat(parentDetails.style.height) +
            (newHeight - initialHeight) +
            "px";
        },
      });

      // Rotate the chevron by 180 degrees and toggle the color class
      gsap.to(chevron, {
        rotation: 180,
        ease: "power3.inOut",
      });
      chevron.classList.remove("chevron-default-color");
      chevron.classList.add("chevron-active-color");
    }
  }
});
