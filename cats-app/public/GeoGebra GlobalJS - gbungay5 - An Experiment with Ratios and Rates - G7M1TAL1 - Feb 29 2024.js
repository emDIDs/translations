function ggbOnInit(name, ggbObject) {
  loadUtils().then(function(setupGGB) {
      const buttonClicks = defineButtonClickScripts();
      // you may replace the following function call with the name of your status text object as a string
      // if you do, you can delete the function defineStatusName
      const statusName = defineStatusName();
      const {
          getCanvas,
          setAriaLabel,
          readKeyboardInstructions,
          updateKeyboardInstructions,
          ggbReadText,
          enableButton,
          libClientFunction,
          libClickFunction,
          libKeyFunction,
          registerSafeObjectUpdateListener,
          registerSafeObjectClickListener,
          registerHoverListener,
          unavailableButtonText,
          setTabOrder,
          manageAddedList,
      } = setupGGB({
          name,
          ggbObject,
          defineKeyboardInstructions,
          buttonClicks,
          statusName,
      });
      const ggbcanvas = getCanvas(name);

      /*
       * IGNORE above
       * EDIT below
       */

      setAriaLabel(ggbcanvas, "Coin Sort Interactive");

      ggbObject.setErrorDialogsActive(false);

      var selectedObject = "";

      function defineStatusName() {
          // put the name of your GGB status text object here
          return "AAppletStatus";
      }
      // listeners here; keep these, add your own as needed
      ggbObject.registerClientListener(function(a) {
          clientFunction(a);
          libClientFunction(a);
      });
      ggbObject.registerClickListener(function(a) {
          clickListenerFunction(a);
          libClickFunction(a);
      });
      ggbcanvas.addEventListener("keyup", function(event) {
          keyit(event);
          libKeyFunction(event);
      });

      function checkForMaxMinDragSituation() {
          let selectedObjectXCoord = ggbObject.getXcoord(selectedObject.concat("Point"));
          let selectedObjectYCoord = ggbObject.getYcoord(selectedObject.concat("Point"));
          let appletMaxXCoord = ggbObject.getValue("maxDragX");
          let appletMaxYCoord = ggbObject.getValue("maxDragY");
          let appletMinXCoord = ggbObject.getValue("minDragX");
          let appletMinYCoord = ggbObject.getValue("minDragY");

          let minXOnly =
              selectedObjectXCoord === appletMinXCoord &&
              selectedObjectYCoord != appletMinYCoord &&
              selectedObjectYCoord != appletMaxYCoord;
          let maxXOnly =
              selectedObjectXCoord === appletMaxXCoord &&
              selectedObjectYCoord != appletMinYCoord &&
              selectedObjectYCoord != appletMaxYCoord;

          let minYOnly =
              selectedObjectYCoord === appletMinYCoord &&
              selectedObjectXCoord != appletMinXCoord &&
              selectedObjectXCoord != appletMaxXCoord;
          let maxYOnly =
              selectedObjectYCoord === appletMaxYCoord &&
              selectedObjectXCoord != appletMinXCoord &&
              selectedObjectXCoord != appletMaxXCoord;

          let minXAndMinY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMinYCoord;
          let maxXAndMinY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMinYCoord;
          let maxXAndMaxY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMaxYCoord;
          let minXAndMaxY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMaxYCoord;

          switch (true) {
              case minXOnly:
                  ggbReadText("This point is at its minimum x value for this interactive.");
                  break;
              case maxXOnly:
                  ggbReadText("This point is at its maximum x value for this interactive.");
                  break;
              case minYOnly:
                  ggbReadText("This point is at its minimum y value for this interactive.");
                  break;
              case maxYOnly:
                  ggbReadText("This point is at its maximum y value for this interactive.");
                  break;
              case minXAndMinY:
                  ggbReadText("This point is at its minimum x and y value for this interactive.");
                  break;
              case maxXAndMinY:
                  ggbReadText("This point is at its maximum x value and minimum y value for this interactive.");
                  break;
              case maxXAndMaxY:
                  ggbReadText("This point is at its maximum x and y value for this interactive.");
                  break;
              case minXAndMaxY:
                  ggbReadText("This point is at its minimum x value and maximum y value for this interactive.");
                  break;
          }
      }

      function executeCorrect() {
          ggbObject.setVisible(selectedObject, false);
          ggbObject.setValue("coinCount", ggbObject.getValue("coinCount") + 1);
          updateKeyboardInstructions(selectedObject);
          ggbReadText("You successfully sorted the coin. Press tab to select next object.");
      }

      function defineButtonClickScripts() {
          // defines button scripts
          // keep this function, but you can delete anything/everything inside it
          return {
              ggbButton1: function() {
                  enableButton(1, false);
                  enableButton(2, true);
              },
              ggbButton2: function() {
                  enableButton(1, true);
                  enableButton(2, false);
              },
              ggbButton3: function() {},
              ggbButton4: function() {},
              ggbButton5: function() {},
          };
      }

      function defineKeyboardInstructions(obj) {
          // takes a GGB object name as an argument, returns its keyboard text.

          if (obj.includes("Dime")) {
              return ggbObject.getVisible(obj) ? "Press the arrow keys to move this coin.\\\\Press d to move the coin into the dime box." : "Press tab to select next object.";
          } else if (obj.includes("Nickel")) {
              return ggbObject.getVisible(obj) ? "Press the arrow keys to move this coin.\\\\Press n to move the coin into the nickel box." : "Press tab to select next object.";
          } else if (obj.includes("Penny")) {
              return ggbObject.getVisible(obj) ? "Press the arrow keys to move this coin.\\\\Press p to move the coin into the penny box." : "Press tab to select next object.";
          } else if (obj.includes("Quarter")) {
              return ggbObject.getVisible(obj) ? "Press the arrow keys to move this coin.\\\\Press q to move the coin into the quarter box." : "Press tab to select next object.";
          }

          const keyboardInstructions = {
              // Dime1: ggbObject.getVisible("Dime1")
              //   ? "Press the arrow keys to move this coin.\\\\Press d to move the coin into the dime box."
              //   : "Press tab to select next object.",
              // Nickel1: ggbObject.getVisible("Nickel1")
              //   ? "Press the arrow keys to move this coin.\\\\Press n to move the coin into the nickel box."
              //   : "Press tab to select next object.",
              // Penny1: ggbObject.getVisible("Penny1")
              //   ? "Press the arrow keys to move this coin.\\\\Press p to move the coin into the penny box."
              //   : "Press tab to select next object.",
              // Penny2: ggbObject.getVisible("Penny2")
              //   ? "Press the arrow keys to move this coin.\\\\Press p to move the coin into the penny box."
              //   : "Press tab to select next object.",
              // Quarter1: ggbObject.getVisible("Quarter1")
              //   ? "Press the arrow keys to move this coin.\\\\Press q to move the coin into the quarter box."
              //   : "Press tab to select next object.",
              ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
          };
          return keyboardInstructions[obj];
      }

      function clientFunction(a) {
          switch (a.type) {
              case "select":
                  selectedObject = a.target;
                  if (
                      selectedObject.includes("Dime") ||
                      selectedObject.includes("Nickel") ||
                      selectedObject.includes("Penny") ||
                      selectedObject.includes("Quarter")
                  ) {
                      if (ggbObject.getValue("time") === 0) {
                          ggbObject.setAnimating("time", true);
                          ggbObject.startAnimation();
                          ggbReadText("The time has started. You have " + ggbObject.getValue("maxTime") + " seconds remaining.");
                      }
                  }
                  break;
              case "deselect":
                  selectedObject = "";
                  break;
              case "dragEnd":
                  if (ggbObject.getValue(selectedObject.concat("Correct"))) {
                      executeCorrect();
                  } else {
                      ggbReadText("This coin has not been correctly sorted yet.");
                  }
                  setTimeout(function() {
                      checkForMaxMinDragSituation();
                  }, 100);
                  break;
          }
      }

      function clickListenerFunction(a) {
          // switch (a) {}
      }

      function keyit(event) {
          // feel free to use event.key instead
          switch (true) {
              case event.key.includes("Arrow"):
                  if (ggbObject.getValue(selectedObject.concat("Correct"))) {
                      executeCorrect();
                  } else {
                      ggbReadText("This coin has not been correctly sorted yet.");
                  }
                  setTimeout(function() {
                      checkForMaxMinDragSituation();
                  }, 100);
                  break;
              case event.key === "d":
                  if (selectedObject.includes("Dime") && ggbObject.getVisible(selectedObject)) {
                      executeCorrect();
                  }
                  break;
              case event.key === "n":
                  if (selectedObject.includes("Nickel") && ggbObject.getVisible(selectedObject)) {
                      executeCorrect();
                  }
                  break;
              case event.key === "p":
                  if (selectedObject.includes("Penny") && ggbObject.getVisible(selectedObject)) {
                      executeCorrect();
                  }
                  break;
              case event.key === "q":
                  if (selectedObject.includes("Quarter") && ggbObject.getVisible(selectedObject)) {
                      executeCorrect();
                  }
                  break;
          }
      }

      //add new stuff above this line
  });

  /*
   * IGNORE BELOW
   */
  function loadUtils() {
      function parseJS(JSString) {
          return Function("" + JSString)();
      }
      if (!window.didUtils || !window.didUtils.setupGGB) {
          return fetch("https://cdn.digital.greatminds.org/did-utils/latest/index.js", {
              cache: "no-cache",
          })
              .then(function(response) {
                  return response.text();
              })
              .then(function(codingText) {
                  parseJS(codingText);
              })
              .then(function() {
                  return window.didUtils.setupGGB;
              });
      }
      return Promise.resolve(window.didUtils.setupGGB);
  }
}