/*
  @author: GeoGebra - Dynamic Mathematics for Everyone, http://www.geogebra.org
  @license: This file is subject to the GeoGebra Non-Commercial License Agreement, see http://www.geogebra.org/license. For questions please write us at office@geogebra.org.
*/
(function () {
  console.log("LOADED!", window.GGBApplet);
  if (typeof window.GGBApplet === "function") {
    console.warn("deployggb.js was loaded twice");
    return;
  }
  let isRenderGGBElementEnabled = false;
  let scriptLoadStarted = false;
  let html5AppletsToProcess = null;
  let ggbHTML5LoadedCodebaseIsWebSimple = false;
  let ggbHTML5LoadedCodebaseVersion = null;
  let ggbHTML5LoadedScript = null;
  const GGBApplet = function () {
    "use strict";
    const applet = {};
    let ggbVersion = "5.0";
    let parameters = {};
    let views = null;
    let html5NoWebSimple = false;
    let html5NoWebSimpleParamExists = false;
    let appletID = null;
    let initComplete = false;
    let html5OverwrittenCodebaseVersion = null;
    let html5OverwrittenCodebase = null;
    for (let i = 0; i < arguments.length; i++) {
      const p = arguments[i];
      if (p !== null) {
        switch (typeof p) {
          case "number":
            ggbVersion = p.toFixed(1);
            break;
          case "string":
            if (p.match(new RegExp("^[0-9]\\.[0-9]+$"))) {
              ggbVersion = p;
            } else {
              appletID = p;
            }
            break;
          case "object":
            if (typeof p.is3D !== "undefined") {
              views = p;
            } else {
              parameters = p;
            }
            break;
          case "boolean":
            html5NoWebSimple = p;
            html5NoWebSimpleParamExists = true;
            break;
        }
      }
    }
    if (views === null) {
      views = {
        is3D: false,
        AV: false,
        SV: false,
        CV: false,
        EV2: false,
        CP: false,
        PC: false,
        DA: false,
        FI: false,
        PV: false,
        macro: false,
      };
      if (
        parameters.material_id !== undefined &&
        !html5NoWebSimpleParamExists
      ) {
        html5NoWebSimple = true;
      }
    }
    if (appletID !== null && parameters.id === undefined) {
      parameters.id = appletID;
    }
    let jnlpFilePath = "";
    let html5Codebase = "";
    let isHTML5Offline = false;
    let loadedAppletType = null;
    let html5CodebaseVersion = null;
    let html5CodebaseScript = null;
    let html5CodebaseIsWebSimple = false;
    let previewImagePath = null;
    let previewLoadingPath = null;
    let previewPlayPath = null;
    let fonts_css_url = null;
    const jnlpBaseDir = null;
    if (parameters.height !== undefined) {
      parameters.height = Math.round(parameters.height);
    }
    if (parameters.width !== undefined) {
      parameters.width = Math.round(parameters.width);
    }
    const parseVersion = function (d) {
      return parseFloat(d) > 4 ? parseFloat(d) : 5;
    };
    applet.setHTML5Codebase = function (codebase, offline) {
      html5OverwrittenCodebase = codebase;
      setHTML5CodebaseInternal(codebase, offline);
    };
    applet.setJavaCodebase =
      applet.setJavaCodebaseVersion =
      applet.isCompiledInstalled =
      applet.setPreCompiledScriptPath =
      applet.setPreCompiledResourcePath =
        function () {};
    applet.setHTML5CodebaseVersion = function (version, offline) {
      const numVersion = parseFloat(version);
      if (numVersion !== NaN && numVersion < 5) {
        console.log(
          "The GeoGebra HTML5 codebase version " +
            numVersion +
            " is deprecated. Using version latest instead."
        );
        return;
      }
      html5OverwrittenCodebaseVersion = version;
      setDefaultHTML5CodebaseForVersion(version, offline);
    };
    applet.getHTML5CodebaseVersion = function () {
      return html5CodebaseVersion;
    };
    applet.getParameters = function () {
      return parameters;
    };
    applet.setFontsCSSURL = function (url) {
      fonts_css_url = url;
    };
    applet.setGiacJSURL = function (url) {};
    applet.setJNLPFile = function (newJnlpFilePath) {
      jnlpFilePath = newJnlpFilePath;
    };
    applet.setJNLPBaseDir = function (baseDir) {};
    applet.inject = function () {
      function isOwnIFrame() {
        return (
          window.frameElement &&
          window.frameElement.getAttribute("data-singleton")
        );
      }
      let type = "auto";
      let container_ID = parameters.id;
      let container;
      let noPreview = false;
      for (let i = 0; i < arguments.length; i++) {
        let p = arguments[i];
        if (typeof p === "string") {
          p = p.toLowerCase();
          if (p.match(/^(prefer)?(java|html5|compiled|auto|screenshot)$/)) {
            type = p;
          } else {
            container_ID = arguments[i];
          }
        } else if (typeof p === "boolean") {
          noPreview = p;
        } else if (p instanceof HTMLElement) {
          container = p;
        }
      }
      continueInject();
      function continueInject() {
        if (!initComplete) {
          setTimeout(continueInject, 200);
          return;
        }
        type = detectAppletType(type);
        const appletElem = container || document.getElementById(container_ID);
        if (!appletElem) {
          console.log("possibly bug on ajax loading? ");
          return;
        }
        applet.removeExistingApplet(appletElem, false);
        if (parameters.width === undefined && appletElem.clientWidth) {
          parameters.width = appletElem.clientWidth;
        }
        if (parameters.height === undefined && appletElem.clientHeight) {
          parameters.height = appletElem.clientHeight;
        }
        if (!(parameters.width && parameters.height) && type === "html5") {
          delete parameters.width;
          delete parameters.height;
        }
        loadedAppletType = type;
        if (type === "screenshot") {
          injectScreenshot(appletElem, parameters);
        } else {
          let playButton = false;
          if (
            (parameters.hasOwnProperty("playButton") &&
              parameters.playButton) ||
            (parameters.hasOwnProperty("clickToLoad") && parameters.clickToLoad)
          ) {
            playButton = true;
          } else if (
            parameters.hasOwnProperty("playButtonAutoDecide") &&
            parameters.playButtonAutoDecide
          ) {
            playButton = (!isInIframe() || isOwnIFrame()) && isMobileDevice();
          }
          if (playButton) {
            loadedAppletType = "screenshot";
            injectPlayButton(appletElem, parameters, noPreview, type);
          } else {
            injectHTML5Applet(appletElem, parameters, noPreview);
          }
        }
      }
      return;
    };
    function isInIframe() {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    }
    function isMobileDevice() {
      if (
        parameters.hasOwnProperty("screenshotGenerator") &&
        parameters.screenshotGenerator
      ) {
        return false;
      }
      return Math.max(screen.width, screen.height) < 800;
    }
    applet.getViews = function () {
      return views;
    };
    applet.isJavaInstalled = function () {
      return false;
    };
    const fetchParametersFromApi = function (successCallback) {
      const onSuccess = function (text) {
        const jsonData = JSON.parse(text);
        const isGeoGebra = function (element) {
          return element.type == "G" || element.type == "E";
        };
        const item = jsonData.elements
          ? jsonData.elements.filter(isGeoGebra)[0]
          : jsonData;
        if (!item || !item.url) {
          onError();
          return;
        }
        parameters.fileName = item.url;
        updateAppletSettings(item.settings || {});
        views.is3D = true;
        const imageDir = "https://www.geogebra.org/images/";
        applet.setPreviewImage(
          previewImagePath || item.previewUrl,
          imageDir + "GeoGebra_loading.png",
          imageDir + "applet_play.png"
        );
        successCallback();
      };
      var onError = function () {
        parameters.onError && parameters.onError();
        log(
          "Error: Fetching material (id " +
            parameters.material_id +
            ") failed.",
          parameters
        );
      };
      const host = location.host.match(
        /(www|stage|beta|groot|alpha).geogebra.(org|net)/
      )
        ? location.host
        : "www.geogebra.org";
      const path = "/materials/" + parameters.material_id + "?scope=basic";
      sendCorsRequest(
        "https://" + host + "/api/proxy.php?path=" + encodeURIComponent(path),
        onSuccess,
        onError
      );
    };
    function updateAppletSettings(settings) {
      const parameterNames = [
        "width",
        "height",
        "showToolBar",
        "showMenuBar",
        "showAlgebraInput",
        "allowStyleBar",
        "showResetIcon",
        "enableLabelDrags",
        "enableShiftDragZoom",
        "enableRightClick",
        "appName",
      ];
      ["enableLabelDrags", "enableShiftDragZoom", "enableRightClick"].forEach(
        function (name) {
          settings[name] = !!settings[name];
        }
      );
      parameterNames.forEach(function (name) {
        if (parameters[name] === undefined && settings[name] !== undefined) {
          parameters[name] = settings[name];
        }
      });
      if (parameters.showToolBarHelp === undefined) {
        parameters.showToolBarHelp = parameters.showToolBar;
      }
    }
    function sendCorsRequest(url, onSuccess, onError) {
      const xhr = new XMLHttpRequest();
      xhr.open("GET", url);
      xhr.onload = function () {
        onSuccess(xhr.responseText);
      };
      xhr.onerror = onError;
      xhr.send();
    }
    applet.isHTML5Installed = function () {
      return true;
    };
    applet.getLoadedAppletType = function () {
      return loadedAppletType;
    };
    applet.setPreviewImage = function (
      previewFilePath,
      loadingFilePath,
      playFilePath
    ) {
      previewImagePath = previewFilePath;
      previewLoadingPath = loadingFilePath;
      previewPlayPath = playFilePath;
    };
    applet.removeExistingApplet = function (appletParent, showScreenshot) {
      let i;
      if (typeof appletParent === "string") {
        appletParent = document.getElementById(appletParent);
      }
      loadedAppletType = null;
      let removedID = null;
      for (i = 0; i < appletParent.childNodes.length; i++) {
        const currentChild = appletParent.childNodes[i];
        const { className } = currentChild;
        if (className === "applet_screenshot") {
          if (showScreenshot) {
            currentChild.style.display = "block";
            loadedAppletType = "screenshot";
          } else {
            currentChild.style.display = "none";
          }
        } else if (className !== "applet_scaler prerender") {
          appletParent.removeChild(currentChild);
          removedID =
            className && className.indexOf("appletParameters") != -1
              ? currentChild.id
              : null;
          i--;
        }
      }
      const appName = parameters.id !== undefined ? parameters.id : removedID;
      const app = window[appName];
      if (app && typeof app.getBase64 === "function") {
        app.remove();
        window[appName] = null;
      }
    };
    applet.refreshHitPoints = function () {
      if (parseVersion(ggbHTML5LoadedCodebaseVersion) >= 5) {
        return true;
      }
      const app = applet.getAppletObject();
      if (app) {
        if (typeof app.recalculateEnvironments === "function") {
          app.recalculateEnvironments();
          return true;
        }
      }
      return false;
    };
    applet.startAnimation = function () {
      const app = applet.getAppletObject();
      if (app) {
        if (typeof app.startAnimation === "function") {
          app.startAnimation();
          return true;
        }
      }
      return false;
    };
    applet.stopAnimation = function () {
      const app = applet.getAppletObject();
      if (app) {
        if (typeof app.stopAnimation === "function") {
          app.stopAnimation();
          return true;
        }
      }
      return false;
    };
    applet.getAppletObject = function () {
      const appName = parameters.id !== undefined ? parameters.id : "ggbApplet";
      return window[appName];
    };
    applet.resize = function () {};
    const appendParam = function (applet, name, value) {
      const param = document.createElement("param");
      param.setAttribute("name", name);
      param.setAttribute("value", value);
      applet.appendChild(param);
    };
    const valBoolean = function (value) {
      return value && value !== "false";
    };
    var injectHTML5Applet = function (appletElem, parameters, noPreview) {
      if (parseVersion(html5CodebaseVersion) <= 4.2) {
        noPreview = true;
      }
      let loadScript = !isRenderGGBElementEnabled && !scriptLoadStarted;
      if (
        (!isRenderGGBElementEnabled && !scriptLoadStarted) ||
        ggbHTML5LoadedCodebaseVersion !== html5CodebaseVersion ||
        (ggbHTML5LoadedCodebaseIsWebSimple && !html5CodebaseIsWebSimple)
      ) {
        loadScript = true;
        isRenderGGBElementEnabled = false;
        scriptLoadStarted = false;
      }
      const article = document.createElement("div");
      article.classList.add("appletParameters", "notranslate");
      let oriWidth = parameters.width;
      const oriHeight = parameters.height;
      parameters.disableAutoScale =
        parameters.disableAutoScale === undefined
          ? GGBAppletUtils.isFlexibleWorksheetEditor()
          : parameters.disableAutoScale;
      if (parameters.width !== undefined) {
        if (parseVersion(html5CodebaseVersion) <= 4.4) {
          if (valBoolean(parameters.showToolBar)) {
            parameters.height -= 7;
          }
          if (valBoolean(parameters.showAlgebraInput)) {
            parameters.height -= 37;
          }
          if (parameters.width < 605 && valBoolean(parameters.showToolBar)) {
            parameters.width = 605;
            oriWidth = 605;
          }
        } else {
          let minWidth = 100;
          if (
            valBoolean(parameters.showToolBar) ||
            valBoolean(parameters.showMenuBar)
          ) {
            if (parameters.hasOwnProperty("customToolBar")) {
              parameters.customToolbar = parameters.customToolBar;
            }
            minWidth = valBoolean(parameters.showMenuBar) ? 245 : 155;
          }
          if (oriWidth < minWidth) {
            parameters.width = minWidth;
            oriWidth = minWidth;
          }
        }
      }
      article.style.border = "none";
      article.style.display = "inline-block";
      for (const key in parameters) {
        if (parameters.hasOwnProperty(key) && key !== "appletOnLoad") {
          article.setAttribute("data-param-" + key, parameters[key]);
        }
      }
      if (fonts_css_url) {
        article.setAttribute("data-param-fontscssurl", fonts_css_url);
      }
      applet.resize = function () {
        GGBAppletUtils.responsiveResize(appletElem, parameters);
      };
      window.addEventListener("resize", function (evt) {
        applet.resize();
      });
      const oriAppletOnload =
        typeof parameters.appletOnLoad === "function"
          ? parameters.appletOnLoad
          : function () {};
      if (!noPreview && parameters.width !== undefined) {
        if (!parameters.hasOwnProperty("showSplash")) {
          article.setAttribute("data-param-showSplash", "false");
        }
        let previewPositioner = appletElem.querySelector(
          ".applet_scaler.prerender"
        );
        const preRendered = previewPositioner !== null;
        if (!preRendered) {
          var previewContainer = createScreenShotDiv(
            oriWidth,
            oriHeight,
            parameters.borderColor,
            false
          );
          previewPositioner = document.createElement("div");
          previewPositioner.className = "applet_scaler";
          previewPositioner.style.position = "relative";
          previewPositioner.style.display = "block";
          previewPositioner.style.width = oriWidth + "px";
          previewPositioner.style.height = oriHeight + "px";
        } else {
          var previewContainer =
            previewPositioner.querySelector(".ggb_preview");
        }
        if (window.GGBT_spinner) {
          window.GGBT_spinner.attachSpinner(previewPositioner, "66%");
        }
        if (parseVersion(html5CodebaseVersion) >= 5) {
          parameters.appletOnLoad = function (api) {
            const preview = appletElem.querySelector(".ggb_preview");
            if (preview) {
              preview.parentNode.removeChild(preview);
            }
            if (window.GGBT_spinner) {
              window.GGBT_spinner.removeSpinner(previewPositioner);
            }
            if (window.GGBT_wsf_view) {
              $(window).trigger("resize");
            }
            oriAppletOnload(api);
          };
          if (!preRendered) {
            previewPositioner.appendChild(previewContainer);
          }
        } else {
          article.appendChild(previewContainer);
        }
        previewPositioner.appendChild(article);
        if (!preRendered) {
          appletElem.appendChild(previewPositioner);
        }
        setTimeout(function () {
          applet.resize();
        }, 1);
      } else {
        const appletScaler = document.createElement("div");
        appletScaler.className = "applet_scaler";
        appletScaler.style.position = "relative";
        appletScaler.style.display = "block";
        appletScaler.appendChild(article);
        appletElem.appendChild(appletScaler);
        parameters.appletOnLoad = function (api) {
          applet.resize();
          oriAppletOnload(api);
        };
      }
      function renderGGBElementWithParams(article, parameters) {
        if (
          parameters &&
          typeof parameters.appletOnLoad === "function" &&
          typeof renderGGBElement === "function"
        ) {
          renderGGBElement(article, parameters.appletOnLoad);
        } else {
          renderGGBElement(article);
        }
        log(
          "GeoGebra HTML5 applet injected and rendered with previously loaded codebase.",
          parameters
        );
      }
      function renderGGBElementOnTube(a, parameters) {
        if (typeof renderGGBElement === "undefined") {
          if (html5AppletsToProcess === null) {
            html5AppletsToProcess = [];
          }
          html5AppletsToProcess.push({
            article: a,
            params: parameters,
          });
          window.renderGGBElementReady = function () {
            isRenderGGBElementEnabled = true;
            if (
              html5AppletsToProcess !== null &&
              html5AppletsToProcess.length
            ) {
              html5AppletsToProcess.forEach(function (obj) {
                renderGGBElementWithParams(obj.article, obj.params);
              });
              html5AppletsToProcess = null;
            }
          };
          if (parseVersion(html5CodebaseVersion) < 5) {
            a.className += " geogebraweb";
          }
        } else {
          renderGGBElementWithParams(a, parameters);
        }
      }
      if (loadScript) {
        scriptLoadStarted = true;
        for (let i = 0; i < article.childNodes.length; i++) {
          const tag = article.childNodes[i].tagName;
          if (tag === "TABLE") {
            article.removeChild(article.childNodes[i]);
            i--;
          }
        }
        if (ggbHTML5LoadedScript !== null) {
          const el = document.querySelector(
            'script[src="' + ggbHTML5LoadedScript + '"]'
          );
          if (el !== undefined && el !== null) {
            el.parentNode.removeChild(el);
          }
        }
        const script = document.createElement("script");
        const scriptLoaded = function () {
          renderGGBElementOnTube(article, parameters);
        };
        script.src = html5Codebase + html5CodebaseScript;
        ggbHTML5LoadedCodebaseIsWebSimple = html5CodebaseIsWebSimple;
        ggbHTML5LoadedCodebaseVersion = html5CodebaseVersion;
        ggbHTML5LoadedScript = script.src;
        log(
          "GeoGebra HTML5 codebase loaded: '" + html5Codebase + "'.",
          parameters
        );
        if (
          !html5OverwrittenCodebase &&
          (!html5OverwrittenCodebaseVersion ||
            html5OverwrittenCodebaseVersion == "5.0")
        ) {
          if (html5CodebaseIsWebSimple) {
            webSimple.succeeded = webSimple.succeeded || webSimple();
          } else {
            web3d.succeeded = web3d.succeeded || web3d();
          }
          scriptLoaded();
        } else if (html5Codebase.requirejs) {
          require(["geogebra/runtime/js/web3d/web3d.nocache"], scriptLoaded);
        } else {
          script.onload = scriptLoaded;
          appletElem.appendChild(script);
        }
      } else {
        renderGGBElementOnTube(article, parameters);
      }
      parameters.height = oriHeight;
      parameters.width = oriWidth;
    };
    var injectScreenshot = function (appletElem, parameters, showPlayButton) {
      const previewContainer = createScreenShotDiv(
        parameters.width,
        parameters.height,
        parameters.borderColor,
        showPlayButton
      );
      const previewPositioner = document.createElement("div");
      previewPositioner.style.position = "relative";
      previewPositioner.style.display = "block";
      previewPositioner.style.width = parameters.width + "px";
      previewPositioner.style.height = parameters.height + "px";
      previewPositioner.className =
        "applet_screenshot applet_scaler" +
        (showPlayButton ? " applet_screenshot_play" : "");
      previewPositioner.appendChild(previewContainer);
      const scale = GGBAppletUtils.getScale(
        parameters,
        appletElem,
        showPlayButton
      );
      if (showPlayButton) {
        appletElem.appendChild(getPlayButton());
        if (!window.GGBT_wsf_view) {
          appletElem.style.position = "relative";
        }
      } else if (window.GGBT_spinner) {
        window.GGBT_spinner.attachSpinner(previewPositioner, "66%");
      }
      appletElem.appendChild(previewPositioner);
      if (scale !== 1 && !isNaN(scale)) {
        GGBAppletUtils.scaleElement(previewPositioner, scale);
        previewPositioner.style.width = parameters.width + "px";
        previewPositioner.style.height = parameters.height + "px";
        previewPositioner.parentNode.style.width =
          parameters.width * scale + "px";
        previewPositioner.parentNode.style.height =
          parameters.height * scale + "px";
      }
      applet.resize = function () {
        resizeScreenshot(
          appletElem,
          previewContainer,
          previewPositioner,
          showPlayButton
        );
      };
      window.addEventListener("resize", function (evt) {
        applet.resize();
      });
      applet.resize();
    };
    function resizeScreenshot(
      appletElem,
      previewContainer,
      previewPositioner,
      showPlayButton
    ) {
      if (!appletElem.contains(previewContainer)) {
        return;
      }
      if (
        typeof window.GGBT_wsf_view === "object" &&
        window.GGBT_wsf_view.isFullscreen()
      ) {
        if (appletElem.id !== "fullscreencontent") {
          return;
        }
        window.GGBT_wsf_view.setCloseBtnPosition(appletElem);
      }
      const scale = GGBAppletUtils.getScale(
        parameters,
        appletElem,
        showPlayButton
      );
      if (previewPositioner.parentNode !== null) {
        if (!isNaN(scale) && scale !== 1) {
          GGBAppletUtils.scaleElement(previewPositioner, scale);
          previewPositioner.parentNode.style.width =
            parameters.width * scale + "px";
          previewPositioner.parentNode.style.height =
            parameters.height * scale + "px";
        } else {
          GGBAppletUtils.scaleElement(previewPositioner, 1);
          previewPositioner.parentNode.style.width = parameters.width + "px";
          previewPositioner.parentNode.style.height = parameters.height + "px";
        }
      }
      if (
        typeof window.GGBT_wsf_view === "object" &&
        window.GGBT_wsf_view.isFullscreen()
      ) {
        GGBAppletUtils.positionCenter(appletElem);
      }
      if (typeof window.GGBT_ws_header_footer === "object") {
        window.GGBT_ws_header_footer.setWsScrollerHeight();
      }
    }
    applet.onExitFullscreen = function (fullscreenContainer, appletElem) {
      appletElem.appendChild(fullscreenContainer);
    };
    var injectPlayButton = function (appletElem, parameters, noPreview, type) {
      injectScreenshot(appletElem, parameters, true);
      const play = function () {
        const elems = [];
        for (i = 0; i < appletElem.childNodes.length; i++) {
          elems.push(appletElem.childNodes[i]);
        }
        if (window.GGBT_wsf_view) {
          const content = window.GGBT_wsf_view.renderFullScreen(
            appletElem,
            parameters.id
          );
          const container = document.getElementById("fullscreencontainer");
          const oldcontent = jQuery(appletElem).find(".fullscreencontent");
          if (oldcontent.length > 0) {
            content.remove();
            oldcontent.attr("id", "fullscreencontent").show();
            jQuery(container).append(oldcontent);
            window.dispatchEvent(new Event("resize"));
          } else {
            injectHTML5Applet(content, parameters, false);
          }
          window.GGBT_wsf_view.launchFullScreen(container);
        } else {
          loadedAppletType = type;
          injectHTML5Applet(appletElem, parameters, false);
        }
        if (!window.GGBT_wsf_view) {
          for (i = 0; i < elems.length; i++) {
            appletElem.removeChild(elems[i]);
          }
        }
      };
      const imgs = appletElem.getElementsByClassName("ggb_preview_play");
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].addEventListener("click", play, false);
        imgs[i].addEventListener("ontouchstart", play, false);
      }
      if (typeof window.ggbAppletPlayerOnload === "function") {
        window.ggbAppletPlayerOnload(appletElem);
      }
      if (isMobileDevice() && window.GGBT_wsf_view) {
        $(".wsf-element-fullscreen-button").remove();
      }
    };
    var getPlayButton = function () {
      const playButtonContainer = document.createElement("div");
      playButtonContainer.className = "ggb_preview_play icon-applet-play";
      if (!window.GGBT_wsf_view) {
        const css =
          "" +
          ".icon-applet-play {" +
          "   width: 100%;" +
          "   height: 100%;box-sizing: border-box;position: absolute;z-index: 1001;cursor: pointer;border-width: 0px;" +
          "   background-color: transparent;background-repeat: no-repeat;left: 0;top: 0;background-position: center center;" +
          '   background-image: url("https://www.geogebra.org/images/worksheet/icon-start-applet.png");' +
          "}" +
          ".icon-applet-play:hover {" +
          'background-image: url("https://www.geogebra.org/images/worksheet/icon-start-applet-hover.png");' +
          "}";
        const style = document.createElement("style");
        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
        document.getElementsByTagName("head")[0].appendChild(style);
      }
      return playButtonContainer;
    };
    var createScreenShotDiv = function (
      oriWidth,
      oriHeight,
      borderColor,
      showPlayButton
    ) {
      const previewContainer = document.createElement("div");
      previewContainer.className = "ggb_preview";
      previewContainer.style.position = "absolute";
      previewContainer.style.zIndex = "90";
      previewContainer.style.width = oriWidth - 2 + "px";
      previewContainer.style.height = oriHeight - 2 + "px";
      previewContainer.style.top = "0px";
      previewContainer.style.left = "0px";
      previewContainer.style.overflow = "hidden";
      previewContainer.style.backgroundColor = "white";
      let bc = "lightgrey";
      if (borderColor !== undefined) {
        if (borderColor === "none") {
          bc = "transparent";
        } else {
          bc = borderColor;
        }
      }
      previewContainer.style.border = "1px solid " + bc;
      const preview = document.createElement("img");
      preview.style.position = "relative";
      preview.style.zIndex = "1000";
      preview.style.top = "-1px";
      preview.style.left = "-1px";
      if (previewImagePath !== null) {
        preview.setAttribute("src", previewImagePath);
      }
      preview.style.opacity = 0.7;
      if (previewLoadingPath !== null) {
        let previewOverlay;
        let pWidth;
        let pHeight;
        if (!showPlayButton) {
          previewOverlay = document.createElement("img");
          previewOverlay.style.position = "absolute";
          previewOverlay.style.zIndex = "1001";
          previewOverlay.style.opacity = 1;
          preview.style.opacity = 0.3;
          pWidth = 360;
          if (pWidth > (oriWidth / 4) * 3) {
            pWidth = (oriWidth / 4) * 3;
          }
          pHeight = pWidth / 5.8;
          previewOverlay.setAttribute("src", previewLoadingPath);
          previewOverlay.setAttribute("width", pWidth);
          previewOverlay.setAttribute("height", pHeight);
          const pX = (oriWidth - pWidth) / 2;
          const pY = (oriHeight - pHeight) / 2;
          previewOverlay.style.left = pX + "px";
          previewOverlay.style.top = pY + "px";
          previewContainer.appendChild(previewOverlay);
        }
      }
      previewContainer.appendChild(preview);
      return previewContainer;
    };
    var detectAppletType = function (preferredType) {
      preferredType = preferredType.toLowerCase();
      if (preferredType === "html5" || preferredType === "screenshot") {
        return preferredType;
      }
      return "html5";
    };
    const modules = [
      "web",
      "webSimple",
      "web3d",
      "tablet",
      "tablet3d",
      "phone",
    ];
    var setDefaultHTML5CodebaseForVersion = function (version, offline) {
      html5CodebaseVersion = version;
      if (offline) {
        setHTML5CodebaseInternal(html5CodebaseVersion, true);
        return;
      }
      let hasWebSimple = !html5NoWebSimple;
      if (hasWebSimple) {
        const v = parseVersion(html5CodebaseVersion);
        if (!isNaN(v) && v < 4.4) {
          hasWebSimple = false;
        }
      }
      let protocol;
      let codebase;
      if (window.location.protocol.substr(0, 4) === "http") {
        protocol = window.location.protocol;
      } else {
        protocol = "http:";
      }
      const index = html5CodebaseVersion.indexOf("//");
      if (index > 0) {
        codebase = html5CodebaseVersion;
      } else if (index === 0) {
        codebase = protocol + html5CodebaseVersion;
      } else {
        codebase = "https://www.geogebra.org/apps/5.2.846.0/";
      }
      for (const key in modules) {
        if (
          html5CodebaseVersion.slice(modules[key].length * -1) ===
            modules[key] ||
          html5CodebaseVersion.slice((modules[key].length + 1) * -1) ===
            modules[key] + "/"
        ) {
          setHTML5CodebaseInternal(codebase, false);
          return;
        }
      }
      if (
        !GGBAppletUtils.isFlexibleWorksheetEditor() &&
        hasWebSimple &&
        !views.is3D &&
        !views.AV &&
        !views.SV &&
        !views.CV &&
        !views.EV2 &&
        !views.CP &&
        !views.PC &&
        !views.DA &&
        !views.FI &&
        !views.PV &&
        !valBoolean(parameters.showToolBar) &&
        !valBoolean(parameters.showMenuBar) &&
        !valBoolean(parameters.showAlgebraInput) &&
        !valBoolean(parameters.enableRightClick) &&
        (!parameters.appName || parameters.appName == "classic")
      ) {
        codebase += "webSimple/";
      } else {
        codebase += "web3d/";
      }
      setHTML5CodebaseInternal(codebase, false);
    };
    var setHTML5CodebaseInternal = function (codebase, offline) {
      if (codebase.requirejs) {
        html5Codebase = codebase;
        return;
      }
      if (codebase.slice(-1) !== "/") {
        codebase += "/";
      }
      html5Codebase = codebase;
      if (offline === null) {
        offline = codebase.indexOf("http") === -1;
      }
      isHTML5Offline = offline;
      html5CodebaseScript = "web.nocache.js";
      html5CodebaseIsWebSimple = false;
      let folders = html5Codebase.split("/");
      if (folders.length > 1) {
        if (!offline && folders[folders.length - 2] === "webSimple") {
          html5CodebaseScript = "webSimple.nocache.js";
          html5CodebaseIsWebSimple = true;
        } else if (modules.indexOf(folders[folders.length - 2]) >= 0) {
          html5CodebaseScript = folders[folders.length - 2] + ".nocache.js";
        }
      }
      folders = codebase.split("/");
      html5CodebaseVersion = folders[folders.length - 3];
      if (html5CodebaseVersion.substr(0, 4) === "test") {
        html5CodebaseVersion =
          html5CodebaseVersion.substr(4, 1) +
          "." +
          html5CodebaseVersion.substr(5, 1);
      } else if (
        html5CodebaseVersion.substr(0, 3) === "war" ||
        html5CodebaseVersion.substr(0, 4) === "beta"
      ) {
        html5CodebaseVersion = "5.0";
      }
      const numVersion = parseFloat(html5CodebaseVersion);
      if (
        numVersion !== NaN &&
        numVersion < 5 &&
        codebase.indexOf("geogebra.org") >= 0
      ) {
        console.log(
          "The GeoGebra HTML5 codebase version " +
            numVersion +
            " is deprecated. Using version latest instead."
        );
        setDefaultHTML5CodebaseForVersion("5.0", offline);
      }
    };
    var log = function (text, parameters) {
      if (window.console && window.console.log) {
        if (
          !parameters ||
          typeof parameters.showLogging === "undefined" ||
          (parameters.showLogging && parameters.showLogging !== "false")
        ) {
          console.log(text);
        }
      }
    };
    if (parameters.material_id !== undefined) {
      fetchParametersFromApi(continueInit);
    } else {
      continueInit();
    }
    function continueInit() {
      let html5Version = ggbVersion;
      if (html5OverwrittenCodebaseVersion !== null) {
        html5Version = html5OverwrittenCodebaseVersion;
      } else {
        if (parseFloat(html5Version) < 5) {
          html5Version = "5.0";
        }
      }
      setDefaultHTML5CodebaseForVersion(html5Version, false);
      if (html5OverwrittenCodebase !== null) {
        setHTML5CodebaseInternal(html5OverwrittenCodebase, isHTML5Offline);
      }
      initComplete = true;
    }
    return applet;
  };
  var GGBAppletUtils = (function () {
    "use strict";
    function isFlexibleWorksheetEditor() {
      return window.GGBT_wsf_edit !== undefined;
    }
    function scaleElement(el, scale) {
      if (scale != 1) {
        el.style.transformOrigin = "0% 0% 0px";
        el.style.webkitTransformOrigin = "0% 0% 0px";
        el.style.transform = "scale(" + scale + "," + scale + ")";
        el.style.webkitTransform = "scale(" + scale + "," + scale + ")";
        el.style.maxWidth = "initial";
        if (el.querySelector(".ggb_preview") !== null) {
          el.querySelector(".ggb_preview").style.maxWidth = "initial";
        }
        if (el.querySelectorAll(".ggb_preview img")[0] !== undefined) {
          el.querySelectorAll(".ggb_preview img")[0].style.maxWidth = "initial";
        }
        if (el.querySelectorAll(".ggb_preview img")[1] !== undefined) {
          el.querySelectorAll(".ggb_preview img")[1].style.maxWidth = "initial";
        }
      } else {
        el.style.transform = "none";
        el.style.webkitTransform = "none";
      }
    }
    function getWidthHeight(
      appletElem,
      appletWidth,
      allowUpscale,
      autoHeight,
      noBorder,
      scaleContainerClass
    ) {
      let container = null;
      if (scaleContainerClass != undefined && scaleContainerClass != "") {
        let parent = appletElem.parentNode;
        while (parent != null) {
          if (
            (" " + parent.className + " ").indexOf(
              " " + scaleContainerClass + " "
            ) > -1
          ) {
            container = parent;
            break;
          } else {
            parent = parent.parentNode;
          }
        }
      }
      let myWidth = 0;
      let myHeight = 0;
      let windowWidth = 0;
      let border = 0;
      let borderRight = 0;
      let borderLeft = 0;
      let borderTop = 0;
      if (container) {
        myWidth = container.offsetWidth;
        myHeight = Math.max(
          autoHeight ? container.offsetWidth : 0,
          container.offsetHeight
        );
      } else {
        if (window.innerWidth && document.documentElement.clientWidth) {
          myWidth = Math.min(
            window.innerWidth,
            document.documentElement.clientWidth
          );
          myHeight = Math.min(
            window.innerHeight,
            document.documentElement.clientHeight
          );
          windowWidth = myWidth;
        } else {
          myWidth = window.innerWidth;
          myHeight = window.innerHeight;
          windowWidth = window.innerWidth;
        }
        if (appletElem) {
          const rect = appletElem.getBoundingClientRect();
          if (rect.left > 0) {
            if (rect.left <= myWidth && (noBorder === undefined || !noBorder)) {
              if (document.dir === "rtl") {
                borderRight = myWidth - rect.width - rect.left;
                borderLeft = windowWidth <= 480 ? 10 : 30;
              } else {
                borderLeft = rect.left;
                borderRight = windowWidth <= 480 ? 10 : 30;
              }
              border = borderLeft + borderRight;
            }
          }
        }
        if (
          appletElem &&
          typeof window.GGBT_wsf_view === "object" &&
          window.GGBT_wsf_view.isFullscreen()
        ) {
          const appletRect = appletElem.getBoundingClientRect();
          if (
            window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionRight"
          ) {
            border = 40;
            borderTop = 0;
          } else if (
            window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionTop"
          ) {
            border = 0;
            borderTop = 40;
          }
        }
      }
      if (appletElem) {
        if (
          (allowUpscale === undefined || !allowUpscale) &&
          appletWidth > 0 &&
          appletWidth + border < myWidth
        ) {
          myWidth = appletWidth;
        } else {
          myWidth -= border;
        }
        if (
          typeof window.GGBT_wsf_view === "object" &&
          window.GGBT_wsf_view.isFullscreen() &&
          (allowUpscale === undefined || !allowUpscale)
        ) {
          myHeight -= borderTop;
        }
      }
      return { width: myWidth, height: myHeight };
    }
    function calcScale(
      parameters,
      appletElem,
      allowUpscale,
      showPlayButton,
      scaleContainerClass
    ) {
      if (parameters.isScreenshoGenerator) {
        return 1;
      }
      const ignoreHeight = showPlayButton !== undefined && showPlayButton;
      const noScaleMargin =
        parameters.noScaleMargin != undefined && parameters.noScaleMargin;
      const valBoolean = function (value) {
        return value && value !== "false";
      };
      const autoHeight = valBoolean(parameters.autoHeight);
      const windowSize = getWidthHeight(
        appletElem,
        parameters.width,
        allowUpscale,
        autoHeight,
        (ignoreHeight && window.GGBT_wsf_view) || noScaleMargin,
        scaleContainerClass
      );
      const windowWidth = parseInt(windowSize.width);
      let appletWidth = parameters.width;
      let appletHeight = parameters.height;
      if (appletWidth === undefined) {
        const article = appletElem.querySelector(".appletParameters");
        if (article) {
          appletWidth = article.offsetWidth;
          appletHeight = article.offsetHeight;
        }
      }
      let xscale = windowWidth / appletWidth;
      let yscale = ignoreHeight ? 1 : windowSize.height / appletHeight;
      if (allowUpscale !== undefined && !allowUpscale) {
        xscale = Math.min(1, xscale);
        yscale = Math.min(1, yscale);
      }
      return Math.min(xscale, yscale);
    }
    function getScale(parameters, appletElem, showPlayButton) {
      let scale = 1;
      let autoScale;
      let allowUpscale = false;
      if (parameters.hasOwnProperty("allowUpscale")) {
        allowUpscale = parameters.allowUpscale;
      }
      if (parameters.hasOwnProperty("scale")) {
        scale = parseFloat(parameters.scale);
        if (isNaN(scale) || scale === null || scale === 0) {
          scale = 1;
        }
        if (scale > 1) {
          allowUpscale = true;
        }
      }
      if (
        appletElem &&
        typeof window.GGBT_wsf_view === "object" &&
        window.GGBT_wsf_view.isFullscreen()
      ) {
        allowUpscale = true;
      }
      if (
        !(
          parameters.hasOwnProperty("disableAutoScale") &&
          parameters.disableAutoScale
        )
      ) {
        autoScale = calcScale(
          parameters,
          appletElem,
          allowUpscale,
          showPlayButton,
          parameters.scaleContainerClass
        );
      } else {
        return scale;
      }
      if (
        allowUpscale &&
        (!parameters.hasOwnProperty("scale") || scale === 1)
      ) {
        return autoScale;
      }
      return Math.min(scale, autoScale);
    }
    function positionCenter(appletElem) {
      const windowWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
      );
      const windowHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
      );
      const appletRect = appletElem.getBoundingClientRect();
      const calcHorizontalBorder = (windowWidth - appletRect.width) / 2;
      let calcVerticalBorder = (windowHeight - appletRect.height) / 2;
      if (calcVerticalBorder < 0) {
        calcVerticalBorder = 0;
      }
      appletElem.style.position = "relative";
      if (window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionRight") {
        if (calcHorizontalBorder < 40) {
          appletElem.style.left = "40px";
        } else {
          appletElem.style.left = calcHorizontalBorder + "px";
        }
        appletElem.style.top = calcVerticalBorder + "px";
      } else if (
        window.GGBT_wsf_view.getCloseBtnPosition() === "closePositionTop"
      ) {
        if (calcVerticalBorder < 40) {
          appletElem.style.top = "40px";
        } else {
          appletElem.style.top = calcVerticalBorder + "px";
        }
        appletElem.style.left = calcHorizontalBorder + "px";
      }
    }
    function responsiveResize(appletElem, parameters) {
      const article = appletElem.querySelector(".appletParameters");
      if (article) {
        if (
          typeof window.GGBT_wsf_view === "object" &&
          window.GGBT_wsf_view.isFullscreen()
        ) {
          if (parameters.id !== article.getAttribute("data-param-id")) {
            return;
          }
          window.GGBT_wsf_view.setCloseBtnPosition(appletElem);
        }
        if (
          article.parentElement &&
          /fullscreen/.test(article.parentElement.className)
        ) {
          return;
        }
        const scale = getScale(parameters, appletElem);
        if (isFlexibleWorksheetEditor()) {
          article.setAttribute("data-param-scale", scale);
        }
        let scaleElem = null;
        for (let i = 0; i < appletElem.childNodes.length; i++) {
          if (
            appletElem.childNodes[i].className !== undefined &&
            appletElem.childNodes[i].className.match(/^applet_scaler/)
          ) {
            scaleElem = appletElem.childNodes[i];
            break;
          }
        }
        if (
          scaleElem !== null &&
          scaleElem.querySelector(".noscale") !== null
        ) {
          return;
        }
        const appName =
          parameters.id !== undefined ? parameters.id : "ggbApplet";
        const app = window[appName];
        if (
          (app == null || !app.recalculateEnvironments) &&
          scaleElem !== null &&
          !scaleElem.className.match(/fullscreen/)
        ) {
          scaleElem.parentNode.style.transform = "";
          if (!isNaN(scale) && scale !== 1) {
            scaleElem.parentNode.style.width = parameters.width * scale + "px";
            scaleElem.parentNode.style.height =
              parameters.height * scale + "px";
            scaleElement(scaleElem, scale);
          } else {
            scaleElement(scaleElem, 1);
            scaleElem.parentNode.style.width = parameters.width + "px";
            scaleElem.parentNode.style.height = parameters.height + "px";
          }
        }
        if (
          typeof window.GGBT_wsf_view === "object" &&
          window.GGBT_wsf_view.isFullscreen()
        ) {
          positionCenter(appletElem);
        }
        if (window.GGBT_wsf_view && !window.GGBT_wsf_view.isFullscreen()) {
          window.GGBT_wsf_general.adjustContentToResize(
            $(article).parents(".content-added-content")
          );
        }
      }
    }
    return {
      responsiveResize,
      isFlexibleWorksheetEditor,
      positionCenter,
      getScale,
      scaleElement,
    };
  })();
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return GGBApplet;
    });
  }
  GGBAppletUtils.makeModule = function (name, permutation) {
    function webModule() {
      const H = "bootstrap";
      const I = "begin";
      const J = "gwt.codesvr." + name + "=";
      const K = "gwt.codesvr=";
      const L = name;
      const M = "startup";
      const N = "DUMMY";
      const O = 0;
      const P = 1;
      const Q = "iframe";
      const R =
        "position:absolute; width:0; height:0; border:none; left: -1000px;";
      const S = " top: -1000px;";
      const T = "Chrome";
      const U = "CSS1Compat";
      const V = "<!doctype html>";
      const W = "";
      const X = "<html><head></head><body></body></html>";
      const Y = "undefined";
      const Z = "readystatechange";
      const $ = 10;
      const _ = "script";
      const ab = "javascript";
      const bb = "Failed to load ";
      const cb = "moduleStartup";
      const db = "scriptTagAdded";
      const eb = "moduleRequested";
      const fb = "meta";
      const gb = "name";
      const hb = name + "::";
      const ib = "::";
      const jb = "gwt:property";
      const kb = "content";
      const lb = "=";
      const mb = "gwt:onPropertyErrorFn";
      const nb = 'Bad handler "';
      const ob = '" for "gwt:onPropertyErrorFn"';
      const pb = "gwt:onLoadErrorFn";
      const qb = '" for "gwt:onLoadErrorFn"';
      const rb = "#";
      const sb = "?";
      const tb = "/";
      const ub = "img";
      const vb = "clear.cache.gif";
      const wb = "baseUrl";
      const xb = name + ".nocache.js";
      const yb = "base";
      const zb = "//";
      const Ab = "selectingPermutation";
      const Bb = name + ".devmode.js";
      const Cb = permutation;
      const Db = ":";
      const Eb = ".cache.js";
      const Fb = "loadExternalRefs";
      const Gb = "end";
      const n = window;
      const o = document;
      q(H, I);
      function p() {
        const a = n.location.search;
        return a.indexOf(J) != -1 || a.indexOf(K) != -1;
      }
      function q(a, b) {}
      webModule.__sendStats = q;
      webModule.__moduleName = L;
      webModule.__errFn = null;
      webModule.__moduleBase = N;
      webModule.__softPermutationId = O;
      webModule.__computePropValue = null;
      webModule.__getPropMap = null;
      webModule.__installRunAsyncCode = function () {};
      webModule.__gwtStartLoadingFragment = function () {
        return null;
      };
      webModule.__gwt_isKnownPropertyValue = function () {
        return false;
      };
      webModule.__gwt_getMetaProperty = function () {
        return null;
      };
      let r = null;
      const s = (n.__gwt_activeModules = n.__gwt_activeModules || {});
      s[L] = { moduleName: L };
      webModule.__moduleStartupDone = function (e) {
        const f = s[L].bindings;
        s[L].bindings = function () {
          const a = f ? f() : {};
          const b = e[webModule.__softPermutationId];
          for (let c = O; c < b.length; c++) {
            const d = b[c];
            a[d[O]] = d[P];
          }
          return a;
        };
      };
      let t;
      function u() {
        v();
        return t;
      }
      function v() {
        if (t) {
          return;
        }
        const a = o.createElement(Q);
        a.id = L;
        a.style.cssText = R + S;
        a.tabIndex = -1;
        o.body.appendChild(a);
        t = a.contentWindow.document;
        if (navigator.userAgent.indexOf(T) == -1) {
          t.open();
          const b = document.compatMode == U ? V : W;
          t.write(b + X);
          t.close();
        }
      }
      function w(f) {
        function g(a) {
          function b() {
            if (typeof o.readyState === Y) {
              return typeof o.body !== Y && o.body != null;
            }
            return /loaded|complete/.test(o.readyState);
          }
          let c = b();
          if (c) {
            a();
            return;
          }
          function d() {
            if (!c) {
              if (!b()) {
                return;
              }
              c = true;
              a();
              if (o.removeEventListener) {
                o.removeEventListener(Z, d, false);
              }
              if (e) {
                clearInterval(e);
              }
            }
          }
          if (o.addEventListener) {
            o.addEventListener(Z, d, false);
          }
          var e = setInterval(function () {
            d();
          }, $);
        }
        function h(a) {
          const b = u();
          const c = b.body;
          const d = b.createElement(_);
          d.language = ab;
          d.crossOrigin = W;
          d.src = a;
          if (webModule.__errFn) {
            d.onerror = function () {
              webModule.__errFn(L, new Error(bb + a));
            };
          }
          c.appendChild(d);
          q(cb, db);
        }
        q(cb, eb);
        g(function () {
          h(f);
        });
      }
      webModule.__startLoadingFragment = function (a) {
        return C(a);
      };
      webModule.__installRunAsyncCode = function (a) {
        const b = u();
        const c = b.body;
        const d = b.createElement(_);
        d.language = ab;
        d.text = a;
        c.appendChild(d);
        c.removeChild(d);
      };
      function A() {
        const c = {};
        let d;
        let e;
        const f = o.getElementsByTagName(fb);
        for (let g = O, h = f.length; g < h; ++g) {
          const i = f[g];
          let j = i.getAttribute(gb);
          var k;
          if (j) {
            j = j.replace(hb, W);
            if (j.indexOf(ib) >= O) {
              continue;
            }
            if (j == jb) {
              k = i.getAttribute(kb);
              if (k) {
                var l;
                const m = k.indexOf(lb);
                if (m >= O) {
                  j = k.substring(O, m);
                  l = k.substring(m + P);
                } else {
                  j = k;
                  l = W;
                }
                c[j] = l;
              }
            } else if (j == mb) {
              k = i.getAttribute(kb);
              if (k) {
                try {
                  d = eval(k);
                } catch (a) {
                  alert(nb + k + ob);
                }
              }
            } else if (j == pb) {
              k = i.getAttribute(kb);
              if (k) {
                try {
                  e = eval(k);
                } catch (a) {
                  alert(nb + k + qb);
                }
              }
            }
          }
        }
        __gwt_getMetaProperty = function (a) {
          const b = c[a];
          return b == null ? null : b;
        };
        r = d;
        webModule.__errFn = e;
      }
      function B() {
        function e(a) {
          let b = a.lastIndexOf(rb);
          if (b == -1) {
            b = a.length;
          }
          let c = a.indexOf(sb);
          if (c == -1) {
            c = a.length;
          }
          const d = a.lastIndexOf(tb, Math.min(c, b));
          return d >= O ? a.substring(O, d + P) : W;
        }
        function f(a) {
          if (a.match(/^\w+:\/\//)) {
          } else {
            const b = o.createElement(ub);
            b.src = a + vb;
            a = e(b.src);
          }
          return a;
        }
        function g() {
          const a = __gwt_getMetaProperty(wb);
          if (a != null) {
            return a;
          }
          return W;
        }
        function h() {
          const a = o.getElementsByTagName(_);
          for (let b = O; b < a.length; ++b) {
            if (a[b].src.indexOf(xb) != -1) {
              return e(a[b].src);
            }
          }
          return W;
        }
        function i() {
          const a = o.getElementsByTagName(yb);
          if (a.length > O) {
            return a[a.length - P].href;
          }
          return W;
        }
        function j() {
          const a = o.location;
          return (
            a.href == a.protocol + zb + a.host + a.pathname + a.search + a.hash
          );
        }
        let k = g();
        if (k == W) {
          k = h();
        }
        if (k == W) {
          k = i();
        }
        if (k == W && j()) {
          k = e(o.location.href);
        }
        k = f(k);
        return k;
      }
      function C(a) {
        if (a.match(/^\//)) {
          return a;
        }
        if (a.match(/^[a-zA-Z]+:\/\//)) {
          return a;
        }
        return webModule.__moduleBase + a;
      }
      function D() {
        const f = [];
        let g = O;
        const h = [];
        const i = [];
        function j(a) {
          const b = i[a]();
          const c = h[a];
          if (b in c) {
            return b;
          }
          const d = [];
          for (const e in c) {
            d[c[e]] = e;
          }
          if (r) {
            r(a, d, b);
          }
          throw null;
        }
        __gwt_isKnownPropertyValue = function (a, b) {
          return b in h[a];
        };
        webModule.__getPropMap = function () {
          const a = {};
          for (const b in h) {
            if (h.hasOwnProperty(b)) {
              a[b] = j(b);
            }
          }
          return a;
        };
        webModule.__computePropValue = j;
        n.__gwt_activeModules[L].bindings = webModule.__getPropMap;
        if (p()) {
          return C(Bb);
        }
        let k;
        try {
          k = Cb;
          const l = k.indexOf(Db);
          if (l != -1) {
            g = parseInt(k.substring(l + P), $);
            k = k.substring(O, l);
          }
        } catch (a) {}
        webModule.__softPermutationId = g;
        return C(k + Eb);
      }
      function F() {
        if (!n.__gwt_stylesLoaded) {
          n.__gwt_stylesLoaded = {};
        }
      }
      A();
      webModule.__moduleBase =
        "https://www.geogebra.org/apps/5.2.846.0/" + name + "/";
      s[L].moduleBase = webModule.__moduleBase;
      const G = D();
      F();
      w(G);
      return true;
    }
    return webModule;
  };
  if (typeof window.web3d !== "function") {
    window.web3d = GGBAppletUtils.makeModule(
      "web3d",
      "793FD36B765F901DCF4E7C4693263FB5"
    );
  }
  if (typeof window.webSimple !== "function") {
    window.webSimple = GGBAppletUtils.makeModule(
      "webSimple",
      "B16513343E3469D295C3B6DFBA395841"
    );
  }
  window.GGBApplet = GGBApplet;
})();
