function removeAds() {
    console.log("ITVX Adblocker Active");

    function tryRemovingAds(attempt) {
        const elem = document.getElementsByClassName("genie-container")[0];

        if (elem) {
            attrib = elem.getAttribute("data-video-id")

            if (!attrib) {

                console.log("Video ID not found");
                return;
            }

            rawId = attrib.split("/").slice(-1)[0];
            idBase = rawId.split(".")[0].replaceAll("_", "/");
            idIndex = rawId.split(".")[1];

            if (!idBase || !idIndex) {

                console.log("Video ID in unknown format");
                return;
            }

            console.log("Episode IDs:", rawId, idBase, idIndex);

            timestamp = Date.now() - 60000
            breaksWatched = {
                indexes: [...Array(20).keys()],
                timestamp: timestamp
            }

            // Remove break breaks
            storage = JSON.parse(localStorage.getItem("genie-productions")) || {};
            storage[idBase] = storage[idBase] || {};
            storage[idBase][idIndex] = storage[idBase][idIndex] || {};
            storage[idBase][idIndex].breaksWatched = breaksWatched;
            
            // Remove intro ads
            let introAdKey = Object.keys(storage)[0]
            let introAdIndex = Object.keys(storage[startAdKey])[1];
            if (storage[introAdKey]) {
                storage[introAdKey]['timestamp'] = timestamp;
                storage[introAdKey][introAdIndex]['progress']['time'] = null;
                storage[introAdKey][introAdIndex]['progress']['percentage'] = 1;
            }

            localStorage.setItem("genie-productions", JSON.stringify(storage));
            console.log("Removed intro ads")
            console.log("Removed ad breaks 1-20")

        } else {
            if (attempt < 5) {
                console.log("Video element not found, retrying...");
                setTimeout(() => tryRemovingAds(attempt + 1), 500);
            } else {
                console.log("Failed to find video element after 5 attempts");
            }
        }
    }

    tryRemovingAds(0);
}

removeAds();
