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

        setAriaLabel(ggbcanvas, "Coin Sort Dynamic Image");

        ggbObject.setErrorDialogsActive(false);

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
            const keyboardInstructions = {
                // A: "Press the arrow keys to move this point.", // example for a point
                ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
                ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
                ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
                ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
                ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
            };
            return keyboardInstructions[obj];
        }

        function clientFunction(a) {
            // switch (a.type) {}
        }

        function clickListenerFunction(a) {
            // switch (a) {}
        }

        function keyit(event) {
            // feel free to use event.key instead
            // switch (event.code) {}
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
