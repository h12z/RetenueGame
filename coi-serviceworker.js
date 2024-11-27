self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => self.clients.claim());

self.addEventListener("fetch", (event) => {
    const request = event.request;

    if (request.mode === "navigate" || request.destination === "script" || request.destination === "worker") {
        const newHeaders = new Headers(request.headers);
        newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
        newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

        event.respondWith(
            fetch(request, { headers: newHeaders }).then((response) => {
                const modifiedHeaders = new Headers(response.headers);
                modifiedHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                modifiedHeaders.set("Cross-Origin-Opener-Policy", "same-origin");

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: modifiedHeaders,
                });
            })
        );
    }
});

/*

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/coi-serviceworker.js')
        .then((registration) => {
            console.log("COI Service Worker registered:", registration);
        })
        .catch((error) => {
            console.error("COI Service Worker registration failed:", error);
        });
}

*/