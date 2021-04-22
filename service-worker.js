/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["/edam/404.html","a5380452da997e4750f76412e03b2580"],["/edam/4f246bb6dbb4f7b6914e9a007b00e33c.svg","4f246bb6dbb4f7b6914e9a007b00e33c"],["/edam/54d6cb2f693ceb46c5ae49b090874d1b.svg","54d6cb2f693ceb46c5ae49b090874d1b"],["/edam/7562b926206cf8ebb0816f2629d2567b.svg","7562b926206cf8ebb0816f2629d2567b"],["/edam/PICIDAE_COMMON.js","1c9b3e6b772d3857d22e3f6d4c6d8cb5"],["/edam/PICIDAE_ENTRY.js","28f0222fe20d5ee5aac0d3c84307f5e0"],["/edam/about/__information__.html","d0e1ab0dd71e65ca2a13780c3fe3f78a"],["/edam/about/__information__.js","3ec3ded14c9b34f9127fe7f59d9c3e96"],["/edam/about/why-named-edam_zh.html","3a45a55d93de47a42d4895ced8a30bb4"],["/edam/about/why-named-edam_zh.js","b4fe968dffa5bdd7071cc0ff5cf4bf6e"],["/edam/about/why-needs-edam.html","a5380452da997e4750f76412e03b2580"],["/edam/about/why-needs-edam_zh.html","20b5a164a36c32bd5da8c9a6177655e3"],["/edam/about/why-needs-edam_zh.js","0d6a4b495df28f961fa50080591c5e25"],["/edam/advanced/__information__.html","20ec5d6a8134b88bd90ac8dfdb612462"],["/edam/advanced/__information__.js","23e7ea4ff0ff8a49a87046575bc1c7b0"],["/edam/advanced/process.html","fd58dc6d28794891f728829c611f070d"],["/edam/advanced/process.js","d0f9ed4d5b09efefb090d6fda9bf949f"],["/edam/advanced/process_zh.html","a9bd73b5de3c6613f1c9d0bccf3c4663"],["/edam/advanced/process_zh.js","95c434bab173489e17b2f763dd46ee86"],["/edam/advanced/standalone.html","c4300483cae730e6d1afee1eda7e0250"],["/edam/advanced/standalone.js","a42522b0b996997ced6c0bd79675da54"],["/edam/advanced/standalone_zh.html","9d59799dadf45d18a68dd814d4b89ab9"],["/edam/advanced/standalone_zh.js","96313e5f0396747a7037cacf1efc68db"],["/edam/advanced/test_zh.html","7f4c5639c096066a9ef041ff249f7928"],["/edam/advanced/test_zh.js","80cd24f1d07aa1529949f6fec1e30368"],["/edam/advanced/write-loader.html","b59fa72386ac3157306868d88d188aca"],["/edam/advanced/write-loader.js","810c8f6b83b5161993e339e7a78b61dc"],["/edam/advanced/write-loader_zh.html","1f7819f2f6f103465e513d8df78cb38b"],["/edam/advanced/write-loader_zh.js","409b76b886f582235100de460f2f249f"],["/edam/advanced/write-plugin.html","63dfdd1b66c0da72220ca7b7a07394c5"],["/edam/advanced/write-plugin.js","fff02228d66be9091d0d170fa7525459"],["/edam/advanced/write-plugin_zh.html","52fdc7c62ebf70baeeb64cd33affdc4f"],["/edam/advanced/write-plugin_zh.js","840c6f0795f4080dc26245e6a4c2b77c"],["/edam/advanced/write-template.html","6131a761ec31b05941e7d3692bbeecd1"],["/edam/advanced/write-template.js","771650f43d1dd5c4aa1519edf74b07dc"],["/edam/advanced/write-template_zh.html","afecad3ff30a3e64938571fa1dca6bbb"],["/edam/advanced/write-template_zh.js","72c81df2898af24a1b6481c7a1078e24"],["/edam/api.html","a5380452da997e4750f76412e03b2580"],["/edam/awesome/autocompete.html","0ad5b53a53a5b80bd178fe23ba1e5b60"],["/edam/awesome/autocompete.js","299d84fee110218f35ee88f7c5ebdbad"],["/edam/docs.html","a5380452da997e4750f76412e03b2580"],["/edam/features.html","b99920eb8d5fb0c2f3a20f6b56f87198"],["/edam/features.js","794f31a400d0a9fab24d8c6e41828238"],["/edam/features_zh.html","25c10ffb551dd56c250b43f87a063648"],["/edam/features_zh.js","65c49bb0df1f9aa0b4e95393aec8b50f"],["/edam/index.html","a7369337c74d68cf673d085b296c6955"],["/edam/index.js","061d17e40f0e1489b593aca43f5b62ee"],["/edam/index_zh.html","1ef87eac0d7d12714f67d5869a9ad062"],["/edam/index_zh.js","e65628ab3727fdff91bcb853a9d8eea5"],["/edam/packages/edam-cli.html","a5380452da997e4750f76412e03b2580"],["/edam/packages/edam-completer.html","a5380452da997e4750f76412e03b2580"],["/edam/packages/edam-gh-completer.html","a5380452da997e4750f76412e03b2580"],["/edam/packages/edam-plugin-dulcet-prompt.html","a5380452da997e4750f76412e03b2580"],["/edam/packages/edam-prettier-loader.html","a5380452da997e4750f76412e03b2580"],["/edam/packages/edam.html","a5380452da997e4750f76412e03b2580"],["/edam/style.css","8f5d0d5eb5e393487d7cb32d9524c2ab"],["/edam/usage/__information__.html","3f954ce591aae1a915a27042ae23950b"],["/edam/usage/__information__.js","6443ae6a1adf529aa769590eca53383b"],["/edam/usage/installation.html","7fca4faaf308dc3ad4653f9a596fdbe6"],["/edam/usage/installation.js","dd1359444adac33ce3064e42faf706d1"],["/edam/usage/installation_zh.html","79f9890976234a736042ab673156ca8c"],["/edam/usage/installation_zh.js","b4c0b44ea696ea8a26555ee5aab4d96d"],["/edam/usage/options.html","67f6c42552e10614dc3963c26895616e"],["/edam/usage/options.js","e0c4d01251d7f20c62eac43fd05bf97f"],["/edam/usage/options_zh.html","cc23def4e26ac9da8de0d580be762080"],["/edam/usage/options_zh.js","276acd8b96c93e06604c7f2eae610a5d"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function (originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function (originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function (originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function (whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function (originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  return;
                  // throw new Error('Request for ' + cacheKey + ' returned a ' +
                  //  'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    if (!shouldRespond) {
      shouldRespond = [
        url.replace(/\/*$/, '.html'),
        url.replace(/\/*$/, '/index.html'),
        url
      ].some(function (maybeUrl) {
        if (urlsToCacheKeys.has(maybeUrl)) {
          url = maybeUrl
          return true
        }
      })
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '/edam/index.html';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







