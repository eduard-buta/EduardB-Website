document.addEventListener("DOMContentLoaded", () => {
  // Global Breakpoints
  let windowWidth = window.innerWidth;
  const BREAKPOINTS = {
    desktop: { min: 992, max: Infinity },
    tablet: { min: 768, max: 991 },
    mobileLandscape: { min: 480, max: 767 },
    mobilePortrait: { min: 0, max: 479 },
  };

  // Debounce Function for Efficient Resize Handling
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
    if (element) {
      element.classList.toggle("display-none", !show);
    }
  }

  function handleResize() {
    windowWidth = window.innerWidth;
    handleResponsiveChanges();
  }

  window.addEventListener("resize", debounce(handleResize, 250));

  //--------------------------------------------------------------
  // Elements Caching
  //--------------------------------------------------------------
  // Elements Caching
  if (!document.querySelector(".menu-btn")) return;

  // Cache elements for performance
  const navbarLogo = document.querySelector(".navbar_logo-svg");
  const menuButton = document.querySelector(".menu-btn");
  const menuButtonSVG = document.querySelector(".navbar_menu-button-svg");
  const navbarButton = document.querySelector(".navbar_button");
  const menuProjectButton = document.querySelector(".menu_project-button");
  const primaryListWrapper = document.querySelector(
    ".menu_primary-list-wrapper",
  );
  const secondaryListWrapper = document.querySelector(
    ".menu_secondary-list-wrapper",
  );
  const menuSocialItems = document.querySelector(".menu_social-items");
  const timeWidget = document.querySelector(".time_widget.is-menu");

  // Cache original parents to reposition elements back
  const originalParentOfMenuProjectButton = menuProjectButton?.parentElement;
  const originalParentOfMenuSocialItems = menuSocialItems?.parentElement;

  // Default colors for Intersection Observer
  const defaultLogoColor = "#fe3636";
  const defaultButtonColor = "white";

  //--------------------------------------------------------------
  // Responsive Layout Logic
  //--------------------------------------------------------------
  function handleResponsiveChanges() {
    // Check breakpoints and rearrange elements
    if (windowWidth <= BREAKPOINTS.tablet.max) {
      if (menuProjectButton && primaryListWrapper) {
        primaryListWrapper.appendChild(menuProjectButton);
      }
      if (menuSocialItems && secondaryListWrapper) {
        secondaryListWrapper.appendChild(menuSocialItems);
      }
    } else {
      if (menuProjectButton && originalParentOfMenuProjectButton) {
        originalParentOfMenuProjectButton.appendChild(menuProjectButton);
      }
      if (menuSocialItems && originalParentOfMenuSocialItems) {
        originalParentOfMenuSocialItems.appendChild(menuSocialItems);
      }
    }

    // Adjust visibility of elements for mobile view
    toggleDisplay(timeWidget, windowWidth > BREAKPOINTS.mobileLandscape.max);
    toggleDisplay(navbarButton, windowWidth > BREAKPOINTS.mobileLandscape.max);
  }

  // Initial call to apply responsive changes
  handleResponsiveChanges();

  //--------------------------------------------------------------
  // Intersection Observer Logic
  //--------------------------------------------------------------
  // Intersection Observer Logic
  const observerOptions = {
    root: null,
    threshold: [0, 0.5, 1],
    rootMargin: "0px 0px -100% 0px",
  };

  const menuObserver = new IntersectionObserver(
    handleIntersection,
    observerOptions,
  );

  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (
          entry.target.getAttribute("mode") === "red" ||
          entry.target.getAttribute("mode") === "light"
        ) {
          updateStyles(entry.target);
        } else {
          applyDefaultStyles();
        }
      }
    });
  }

  // Intersection Observer utility functions
  function updateStyles(target) {
    const isRedSection = target.getAttribute("mode") === "red";
    const isLightSection = target.getAttribute("mode") === "light";

    navbarLogo.classList.toggle("logo-alt-color", isRedSection);
    menuButtonSVG.classList.toggle("button-alt-color", isLightSection);
    navbarButton.classList.toggle("button-alt-color", isLightSection);
  }

  function applyDefaultStyles() {
    navbarLogo.classList.remove("logo-alt-color");
    menuButtonSVG.classList.remove("button-alt-color");
    navbarButton.classList.remove("button-alt-color");
  }

  let selectedElements = [];
  // Observing elements that match specific criteria
  document.body
    .querySelectorAll("[class^='section_'],[class^='footer_component']")
    .forEach((element) => {
      if (element.matches("[mode='red'], [mode='light']")) {
        selectedElements.push(element);
        menuObserver.observe(element);
      } else if (!element.hasAttribute("mode")) {
        selectedElements.push(element);
        menuObserver.observe(element);
      }
    });

  //--------------------------------------------------------------
  // Menu Open/Close Animation
  //--------------------------------------------------------------
  // GSAP timeline for menu animations
  const menuTimeline = gsap.timeline({
    paused: true,
    reversed: true,
  });

  // Toggle menu open/close on button click
  const toggleMenu = () => {
    menuButton.classList.toggle("open");
    menuButton.classList.toggle("closed");

    // Menu open/close animation using GSAP timeline
    menuTimeline.reversed() ? openMenu() : closeMenu();
  };

  // Listen to click events on the specified elements to trigger menu toggle
  const clickableElements = document.querySelectorAll(".navbar_menu-button");
  clickableElements.forEach((element) => {
    element.addEventListener("click", toggleMenu);
  });

  // Menu button mouse enter event
  menuButton.addEventListener("mouseenter", () => {
    menuButton.classList.add("animating");
    const duration = 1.4; // Animation duration is always 1.4 seconds
    setTimeout(() => {
      menuButton.classList.remove("animating");
    }, duration * 1000);
  });

  // Handling keyboard and mouse inputs
  menuButton.addEventListener("keydown", () => {
    menuButton.classList.add("using-keyboard");
  });
  menuButton.addEventListener("mousedown", () => {
    menuButton.classList.remove("using-keyboard");
  });

  //--------------------------------------------------------------
  // Navbar CTA Button Animation
  //--------------------------------------------------------------
  // GSAP timeline for navbar CTA button animation
  const textTimeline = gsap.timeline({
    paused: true,
    onStart: () => {
      // Apply will-change only when the animation starts
      gsap.set(".navbar_button-text span", { willChange: "transform" });
    },
    onComplete: () => {
      // Remove will-change once the animation is complete
      gsap.set(".navbar_button-text span", { willChange: "auto" });
    },
  });

  // Animate each span upwards on hover
  textTimeline
    .to(".navbar_button-text span", {
      duration: 0.4,
      yPercent: -100,
      stagger: 0.08,
      ease: "Power2.easeOut",
      onComplete: function () {
        gsap.set(".navbar_button-text span", {
          yPercent: 100,
        });
      },
    })
    // Animate spans back to their original position
    .to(".navbar_button-text span", {
      duration: 0.4,
      yPercent: 0,
      stagger: 0.08,
      ease: "Power2.easeOut",
    });

  // Add hover event listener to play the animation sequence
  navbarButton.addEventListener("mouseenter", () => {
    textTimeline.restart();
  });

  //--------------------------------------------------------------
  // Journal Counter Logic
  //--------------------------------------------------------------
  // Function to prepend zeroes to numbers below 10
  function journalWithZero(num) {
    return num < 10 ? "0" + num : num;
  }

  // Function to update the journal count on the UI
  function updateJournalCount() {
    document.querySelectorAll("#journal-menu-item").forEach((menuItem) => {
      let totalJournal = journalWithZero(
        menuItem.querySelectorAll(".journal_items").length,
      );

      document
        .querySelectorAll("[journal-count='total']")
        .forEach((element) => {
          element.textContent = totalJournal;
        });
    });
  }

  updateJournalCount();

  //--------------------------------------------------------------
  // Menu Reveal Animation
  //--------------------------------------------------------------
  // Define menu animation sequences
  menuTimeline
    .to(".navbar_menu-button-svg", {
      duration: 0.2,
      onStart: () => toggleCorrectMenuColors(true), // Add class at the start of the timeline
      onReverseComplete: () => toggleCorrectMenuColors(false), // Remove class when timeline completes in reverse
    })
    .to(".menu_component", {
      opacity: 1,
      duration: 0.4,
      ease: "power2.out",
      display: "flex",
    })
    .from(
      ".menu_primary-link, .menu_secondary-link, .menu_cta-link, .menu_widget, .menu_social-item, .menu_legal-item",
      {
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.05,
      },
    );

  // Function to open the menu with animation
  const openMenu = () => {
    adjustNavbarColorsForBackground(); // Call this function when menu opens
    gsap.to(navbarButton, {
      y: -20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        if (windowWidth > BREAKPOINTS.mobileLandscape.max) {
          navbarButton.style.display = "none";
          timeWidget.style.display = "flex";
        }
      },
    });

    gsap.fromTo(
      timeWidget,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.in", delay: 0.5 },
    );

    menuTimeline.play();
  };

  // Function to close the menu with animation
  const closeMenu = () => {
    adjustNavbarColorsForBackground(); // Call this function when menu closes
    gsap.to(timeWidget, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        if (windowWidth > BREAKPOINTS.mobileLandscape.max) {
          timeWidget.style.display = "none";
          navbarButton.style.display = "flex";
        }
      },
    });

    gsap.fromTo(
      navbarButton,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.in", delay: 0.5 },
    );

    menuTimeline.reverse();
  };

  // Function to toggle the color of the button
  const toggleCorrectMenuColors = (colorOn) => {
    menuButtonSVG.classList.toggle("menu-button-color-white", colorOn);
    navbarLogo.classList.toggle("menu-logo-color-red", colorOn);
  };

  // Function to adjust navbar elements colors based on background
  const adjustNavbarColorsForBackground = () => {
    const navbarLogo = document.querySelector(".navbar_logo-svg");
    navbarLogo.classList.toggle(
      "logo-on-red-background",
      document.body.getAttribute("mode") === "red",
    );
  };

  //////////////////////////////////////////////////////////////////

  // // Wraps an element in a new container for styling and manipulation
  // function wrapInContainer(targetElement, wrapperType = "span", cssClasses) {
  //   const wrapper = document.createElement(wrapperType);
  //   if (cssClasses) {
  //     wrapper.classList.add(...cssClasses);
  //   }
  //   targetElement.parentNode.insertBefore(wrapper, targetElement);
  //   wrapper.appendChild(targetElement);
  //   return wrapper;
  // }

  // // Sets fixed width and height for stability during animation
  // const setItemSize = (item, targetElementSelector = null) => {
  //   const targetElement = targetElementSelector
  //     ? item.querySelector(targetElementSelector)
  //     : item;
  //   const rect = targetElement.getBoundingClientRect();
  //   item.style.width = `${rect.width}px`;
  //   item.style.height = `${rect.height}px`;
  // };

  // // Resets the inline size after animation
  // const resetInlineSize = (item) => {
  //   item.style.width = "";
  //   item.style.height = "";
  // };

  // // Handles hover events and triggers animations
  // const handleHover = (item, tl, labelElementSelector) => {
  //   const labelElement = labelElementSelector
  //     ? item.querySelector(labelElementSelector)
  //     : null;

  //   item.addEventListener("mouseenter", () => {
  //     setItemSize(item);
  //     if (labelElement) {
  //       setTimeout(() => {
  //         gsap.to(labelElement, { marginLeft: "-1em", duration: 0.35 }); // Add margin-left for secondary items
  //       }, "250");
  //     }
  //     tl.play();
  //   });
  //   item.addEventListener("mouseleave", () => {
  //     setItemSize(item);
  //     if (labelElement) {
  //       setTimeout(() => {
  //         gsap.to(labelElement, { marginLeft: 0, duration: 0.35 }); // Remove margin-left for secondary items
  //       }, "250");
  //     }
  //     tl.reverse().eventCallback("onReverseComplete", () =>
  //       resetInlineSize(item),
  //     );
  //   });
  // };

  // // Rewritten manageOverflow function with specific progress thresholds
  // function manageOverflow(item, tl, primaryElement, labelElement) {
  //   const forwardAdditionThreshold = 0.05;
  //   const forwardRemovalThreshold = 0.8;
  //   const backwardAdditionThreshold = 0.8;
  //   const backwardRemovalThreshold = 0.05;

  //   const primaryElementContainer = primaryElement.parentElement;
  //   const labelElementContainer = labelElement.parentElement;

  //   let forwardAdded = false;
  //   let backwardAdded = false;

  //   tl.eventCallback("onUpdate", () => {
  //     const progress = tl.progress();
  //     const isForward = !tl.reversed();

  //     if (isForward) {
  //       if (
  //         progress > forwardAdditionThreshold &&
  //         progress < forwardRemovalThreshold &&
  //         !forwardAdded
  //       ) {
  //         [primaryElementContainer, labelElementContainer].forEach((element) =>
  //           element.classList.add("overflow-clip"),
  //         );
  //         forwardAdded = true;
  //       } else if (
  //         (progress <= forwardAdditionThreshold ||
  //           progress >= forwardRemovalThreshold) &&
  //         forwardAdded
  //       ) {
  //         [primaryElementContainer, labelElementContainer].forEach((element) =>
  //           element.classList.remove("overflow-clip"),
  //         );
  //         forwardAdded = false;
  //       }
  //     } else {
  //       if (
  //         progress < backwardAdditionThreshold &&
  //         progress > backwardRemovalThreshold &&
  //         !backwardAdded
  //       ) {
  //         [primaryElementContainer, labelElementContainer].forEach((element) =>
  //           element.classList.add("overflow-clip"),
  //         );
  //         backwardAdded = true;
  //       } else if (
  //         (progress >= backwardAdditionThreshold ||
  //           progress <= backwardRemovalThreshold) &&
  //         backwardAdded
  //       ) {
  //         [primaryElementContainer, labelElementContainer].forEach((element) =>
  //           element.classList.remove("overflow-clip"),
  //         );
  //         backwardAdded = false;
  //       }
  //     }
  //   });

  //   // Ensure overflow class is removed at the end of animation
  //   const removeOverflowClass = () => {
  //     [primaryElementContainer, labelElementContainer].forEach((element) =>
  //       element.classList.remove("overflow-clip"),
  //     );
  //     forwardAdded = false;
  //     backwardAdded = false;
  //   };

  //   tl.eventCallback("onReverseComplete", removeOverflowClass);
  //   tl.eventCallback("onComplete", removeOverflowClass);
  // }

  // // Initialize animation for primary menu items
  // document
  //   .querySelectorAll('.menu_primary-item[data-hover="primary-item"]')
  //   .forEach((item) => {
  //     const primaryElement = item.querySelector(".secondary-6xl-clash");
  //     const labelElement = item.querySelector(".label-xl-grand");

  //     wrapInContainer(primaryElement, "span", [
  //       "line-mask-primary",
  //       "display-block",
  //     ]);
  //     wrapInContainer(labelElement, "span", [
  //       "line-mask-label",
  //       "display-block",
  //     ]);

  //     const menuPrimaryTl = gsap
  //       .timeline({ paused: true })
  //       .to([primaryElement, labelElement], {
  //         duration: 0.35,
  //         yPercent: -100,
  //         stagger: 0.1,
  //       })
  //       .set(primaryElement.parentElement, { clearProps: "fontSize" })
  //       .set(primaryElement.parentElement, { fontSize: "0.925em" })
  //       .set(primaryElement, {
  //         fontFamily: "Grandslang, sans-serif",
  //         fontStyle: "italic",
  //         fontWeight: 400,
  //       })
  //       .set([primaryElement, labelElement], { yPercent: 100 })
  //       .to([primaryElement, labelElement], {
  //         duration: 0.35,
  //         yPercent: 0,
  //         stagger: 0.1,
  //       });

  //     manageOverflow(item, menuPrimaryTl, primaryElement, labelElement);
  //     handleHover(item, menuPrimaryTl);
  //   });

  // // Initialize animation for secondary menu items
  // document
  //   .querySelectorAll('.menu_primary-item[data-hover="secondary-item"]')
  //   .forEach((item) => {
  //     const primaryElement = item.querySelector(".secondary-xl-clash");
  //     const labelElement = item.querySelector(".menu_link-label-wrapper");

  //     wrapInContainer(primaryElement, "span", [
  //       "line-mask-primary",
  //       "display-block",
  //     ]);
  //     wrapInContainer(labelElement, "span", [
  //       "line-mask-label",
  //       "display-block",
  //     ]);

  //     const menuSecondaryTl = gsap
  //       .timeline({ paused: true })
  //       .to([primaryElement, labelElement], {
  //         duration: 0.35,
  //         yPercent: -100,
  //         stagger: 0.1,
  //       })
  //       .set(primaryElement.parentElement, { clearProps: "fontSize" })
  //       .set(primaryElement.parentElement, { fontSize: "0.925em" })
  //       .set(primaryElement, {
  //         fontFamily: "Grandslang, sans-serif",
  //         fontStyle: "italic",
  //         fontWeight: 400,
  //       })
  //       .set([primaryElement, labelElement], { yPercent: 100 })
  //       .to([primaryElement, labelElement], {
  //         duration: 0.35,
  //         yPercent: 0,
  //         stagger: 0.1,
  //       });

  //     manageOverflow(item, menuSecondaryTl, primaryElement, labelElement);
  //     handleHover(item, menuSecondaryTl, ".line-mask-label"); // Pass the label selector for secondary items
  //   });
});
