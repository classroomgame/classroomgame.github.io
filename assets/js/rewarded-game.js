(function () {
    "use strict";

    var gate = document.querySelector("[data-rewarded-game]");
    var fullGame = document.getElementById("full-game");
    var config = window.rewardedGameConfig || {};

    if (!gate || !fullGame || !config.adUnitPath || !config.embedUrl) return;

    var button = gate.querySelector(".rewarded-play-button");
    var status = gate.querySelector(".rewarded-game-status");
    var rewardedSlot = null;
    var rewardedReadyEvent = null;
    var rewardGranted = false;
    var fallbackTimer = null;
    var listenersAdded = false;

    window.googletag = window.googletag || { cmd: [] };

    function setStatus(message) {
        if (status) status.textContent = message;
    }

    function clearFallbackTimer() {
        if (!fallbackTimer) return;
        window.clearTimeout(fallbackTimer);
        fallbackTimer = null;
    }

    function destroyCurrentSlot() {
        if (!rewardedSlot || !window.googletag || !googletag.destroySlots) return;
        googletag.destroySlots([rewardedSlot]);
        rewardedSlot = null;
    }

    function loadGameIframe() {
        clearFallbackTimer();
        if (fullGame.querySelector("iframe.game-iframe")) return;
        destroyCurrentSlot();

        var iframe = document.createElement("iframe");
        iframe.id = "iframehtml5";
        iframe.className = "game-iframe w-[100%] h-[100%]";
        iframe.title = "play game";
        iframe.src = config.embedUrl;
        iframe.frameBorder = "0";
        iframe.scrolling = "no";
        iframe.setAttribute("allowfullscreen", "");

        gate.remove();
        fullGame.appendChild(iframe);
    }

    function allowFallbackPlay(reason) {
        clearFallbackTimer();
        destroyCurrentSlot();
        rewardedReadyEvent = null;
        rewardGranted = false;
        button.disabled = false;
        button.dataset.mode = "fallback";
        button.textContent = "Play game";
        setStatus("Rewarded ad is unavailable. You can play normally.");
        if (reason) console.warn("Rewarded ad fallback:", reason);
    }

    function startFallbackTimer() {
        clearFallbackTimer();
        fallbackTimer = window.setTimeout(function () {
            allowFallbackPlay("request timeout");
        }, Number(config.timeoutMs) || 10000);
    }

    function addRewardedListeners() {
        if (listenersAdded) return;
        listenersAdded = true;

        var pubads = googletag.pubads();

        pubads.addEventListener("rewardedSlotReady", function (event) {
            if (event.slot !== rewardedSlot) return;
            clearFallbackTimer();
            rewardedReadyEvent = event;
            button.disabled = false;
            button.dataset.mode = "rewarded";
            button.textContent = "Watch 1 ad";
            setStatus("Ad ready. Watch 1 ad to unlock " + (config.gameTitle || "this game") + ".");
        });

        pubads.addEventListener("rewardedSlotGranted", function (event) {
            if (event.slot !== rewardedSlot) return;
            rewardGranted = true;
            setStatus("Reward granted. Close the ad to start the game.");
        });

        pubads.addEventListener("rewardedSlotClosed", function (event) {
            if (event.slot !== rewardedSlot) return;

            var canPlay = rewardGranted;
            destroyCurrentSlot();
            rewardedReadyEvent = null;

            if (canPlay) {
                loadGameIframe();
                return;
            }

            button.disabled = true;
            button.textContent = "Preparing ad...";
            setStatus("The ad was not completed. Preparing another ad.");
            requestRewardedAd();
        });

        pubads.addEventListener("slotRenderEnded", function (event) {
            if (event.slot !== rewardedSlot || !event.isEmpty) return;
            destroyCurrentSlot();
            allowFallbackPlay("no ad fill");
        });
    }

    function requestRewardedAd() {
        rewardGranted = false;
        rewardedReadyEvent = null;
        startFallbackTimer();

        googletag.cmd.push(function () {
            addRewardedListeners();

            rewardedSlot = googletag.defineOutOfPageSlot(
                config.adUnitPath,
                googletag.enums.OutOfPageFormat.REWARDED
            );

            if (!rewardedSlot) {
                allowFallbackPlay("rewarded format is not supported");
                return;
            }

            rewardedSlot.addService(googletag.pubads());
            googletag.enableServices();
            googletag.display(rewardedSlot);
        });
    }

    button.addEventListener("click", function () {
        if (button.dataset.mode === "fallback") {
            loadGameIframe();
            return;
        }

        if (!rewardedReadyEvent) return;

        button.disabled = true;
        setStatus("Opening rewarded ad...");

        if (!rewardedReadyEvent.makeRewardedVisible()) {
            allowFallbackPlay("the rewarded ad could not be displayed");
        }
    });

    if (!document.querySelector('script[src*="securepubads.g.doubleclick.net/tag/js/gpt.js"]')) {
        var gptScript = document.createElement("script");
        gptScript.async = true;
        gptScript.crossOrigin = "anonymous";
        gptScript.src = "https://securepubads.g.doubleclick.net/tag/js/gpt.js";
        document.head.appendChild(gptScript);
    }

    requestRewardedAd();
})();
