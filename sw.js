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

var precacheConfig = [["/assets/banners/banner.png","3503b22e18302b24a4c2b42982379798"],["/assets/css/main.css","27041ad7c76bd96331f013d7e17ed4b3"],["/assets/images/duan.jpg","c369b0b96b2e8fa985e69dcd129bb317"],["/assets/images/kaneshiro.jpg","2cc0d5fa255cecdba76e0ec8ba87e127"],["/assets/images/lerch.jpg","818910a82e71e9d92630ead60bb49dea"],["/assets/images/nam.jpg","f099b95ff2ffa0ad4db70be939a37e09"],["/assets/images/nieto.jpg","678ed2f95eb82f8b4c4f6b9084f261ec"],["/assets/images/placeholder.png","87e3f20d7ab1b6c039c179d96f6a9956"],["/assets/images/srinivasamurthy.png","781de1b115bd3c59480c52e8a076e3d3"],["/assets/images/su.jpg","50c7b6b95c7f7fe8410193a9cde8cc9d"],["/assets/img/favicon.jpg","ffb9f5c8afdda7fa4f3fd697e5147182"],["/assets/img/icons/android-chrome-192x192.png","4df4c8779d47bcaa69516050281773b9"],["/assets/img/icons/android-chrome-256x256.png","939ec88a61f407945a27d867fca1651d"],["/assets/img/icons/apple-touch-icon.png","366666899d15cf8f6811cc73ee0d63de"],["/assets/img/icons/favicon-16x16.png","9da49993c9a4054474cf3d7aa4e3dc82"],["/assets/img/icons/favicon-32x32.png","d3e42a56b76293f647fbcc80255bf490"],["/assets/img/icons/icon-github.svg","4e06335104a29f91e08d4ef420da7679"],["/assets/img/icons/icon-instagram.svg","1e1119e2628235ee4c8771bff15eb2ca"],["/assets/img/icons/icon-twitter.svg","30551913d5399d6520e8a74b6f1e23f0"],["/assets/img/icons/mstile-150x150.png","1cea2ceb806d1a018330a51a1d8b73b6"],["/assets/img/icons/safari-pinned-tab.svg","398ef6b25c0f7f3f6e54c112a8facc5f"],["/assets/img/posts/emile-perron-190221.jpg","4705474281b975b7a213b96e71f772e7"],["/assets/img/posts/emile-perron-190221_lg.jpg","aafe35b1dc6d9dc9293c8c2ef4121046"],["/assets/img/posts/emile-perron-190221_md.jpg","03ed35ed656429599daba312f0990a0f"],["/assets/img/posts/emile-perron-190221_placehold.jpg","67f40708f69ab671cee04d624258b85c"],["/assets/img/posts/emile-perron-190221_sm.jpg","4ce4178a62d5a456e90e7bc47bde50f5"],["/assets/img/posts/emile-perron-190221_thumb.jpg","f20085dfe2e36854f8a12f1fd6c50425"],["/assets/img/posts/emile-perron-190221_thumb@2x.jpg","b8fa22c3237de529316037f093b9cb4d"],["/assets/img/posts/emile-perron-190221_xs.jpg","ac32cbd525d72e932499668af5647d03"],["/assets/img/posts/shane-rounce-205187.jpg","bb774d6e05b2b55ffdabe11a8aac7c56"],["/assets/img/posts/shane-rounce-205187_lg.jpg","83cd838024fff9c3faec59fa1da97872"],["/assets/img/posts/shane-rounce-205187_md.jpg","628cf27bf658cf6de9df79ab9bf2cb2d"],["/assets/img/posts/shane-rounce-205187_placehold.jpg","249fc4a09bcfcbd7d5764f14c14ae82e"],["/assets/img/posts/shane-rounce-205187_sm.jpg","a2400a468e10d7d64528ac9c6bc3b6f0"],["/assets/img/posts/shane-rounce-205187_thumb.jpg","c3b2dd0d95a6d3a44d7702f8c06b1e78"],["/assets/img/posts/shane-rounce-205187_thumb@2x.jpg","b0722b63a92c92a44cd92c0201fc92a4"],["/assets/img/posts/shane-rounce-205187_xs.jpg","cd58fd23f3b3c1de2183beb9ed08327b"],["/assets/img/posts/sleek.jpg","a32252a618ffe8ae57c9ce9ab157a01b"],["/assets/img/posts/sleek_lg.jpg","95a1338aa524727f34950f269133e904"],["/assets/img/posts/sleek_md.jpg","4e35ceb2f5fffd3d758fade699b0b85a"],["/assets/img/posts/sleek_placehold.jpg","0f48050cd7776895b98c6ce21597ff39"],["/assets/img/posts/sleek_sm.jpg","f30af3d30b7df905d962e494750f5da0"],["/assets/img/posts/sleek_thumb.jpg","f7b8a94ac9da8e5ea36bb9e459872400"],["/assets/img/posts/sleek_thumb@2x.jpg","e67e2129dc58a100b98a5e027c964dbc"],["/assets/img/posts/sleek_xs.jpg","c8212cace6d446950556a3bf6efe4520"],["/assets/ismir.png","b9e568b77f5ff28dec02196fbefadeb5"],["/assets/js/bundle.js","414cd958258faa4cf0b30ec8698c4ded"],["/assets/logo.svg","4305c785d6dd5875336e95dc9c09cdee"],["/cfp/index.html","9efc34a1c40272cedb30f4694585f28f"],["/cft/index.html","4f8917a55eaec0681f3c592a6d972db6"],["/gulpfile.babel.js","50fae5531a04093e229eb6668daecd97"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Blog Banner (2240 x 1260 px).png","3503b22e18302b24a4c2b42982379798"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Facebook Banner_Cover (1640 x 924 px).png","39c37a45210b913c9162fc6c8b765154"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Full Screen (1920 x 1080 px).png","bde547ff41542ed7f184e53818636e14"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Post (1080 x 1080 px) 1.png","dc60afe0a8cd00d0f7fe0270af6c5ecd"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Post (1080 x 1080 px) 2.png","ddc302c5947b3805db3c1d2e72882081"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Post (1080 x 1080 px) 3.png","2310b1c6c519723b2a1ee723394f723b"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Post (1080 x 1080 px) 4.png","869b2b3f57dcc6e4e5de9e171c20a701"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Post (1080 x 1080 px) 5.png","80340ccc715fe3267668aeb00fcd164d"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Instagram Story (1080 x 1920 px).png","9a988fef96e1562e1ad39059938d7632"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - LinkedIn Banner (1584 x 396 px).png","e8571c382fe167fba059f17202926c3d"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - YouTube Channel Art (2560 x 1440 px).png","85dd42dbc864d5da2ea164d1f5fe2411"],["/images/banner/BackgroundOnly/FIX ISMIR2021 Background - Zoom Virtual Background (1920 x 1080 px).png","23a29b003a7e00e1f91ab052f1e1cead"],["/images/banner/WithText/FIX ISMIR2021 Facebook Banner_Cover.png","515881542e0d4c4453a713503620617c"],["/images/banner/WithText/FIX ISMIR2021 LinkedIn Banner.png","d20d90beb809022dace27d21baeb0092"],["/images/banner/WithText/FIX ISMIR2021 Twitter Header.png","94a7f7c0b302d31971a535c7ab544fd6"],["/images/banner/WithText/FIX ISMIR2021 YouTube Channel Art.png","8c2d61780458893bb1deb45b26fb5793"],["/images/duan.jpg","c369b0b96b2e8fa985e69dcd129bb317"],["/images/gururani.jpg","b2861f349f843f964db5983e459031b1"],["/images/kaneshiro.jpg","2cc0d5fa255cecdba76e0ec8ba87e127"],["/images/lee.jpg","b25aa8985012f68eeda911fc9d856494"],["/images/lerch.jpg","818910a82e71e9d92630ead60bb49dea"],["/images/logo/FINAL/ISMIR2021_LOGO.jpg","434ffa4c9f6d45bd1daa5e64dd18dc88"],["/images/logo/FINAL/ISMIR2021_LOGO.png","852ead405f529fa72b95947005bd0b75"],["/images/logo/FINAL/ISMIR2021_LOGO.svg","4305c785d6dd5875336e95dc9c09cdee"],["/images/logo/FINAL/SoundWaveOnly.jpg","02e80b4318e0262aaab57e89b3d9dd6f"],["/images/logo/FINAL/SoundWaveOnly.png","75fdbaa43a4bf1251ea67cca295a6b9a"],["/images/logo/FINAL/SoundWaveOnly.svg","3a9ae6832dc9859091d7409c9902159b"],["/images/morsi.jpg","1ab167d39fef8e7153730c68ba621509"],["/images/nam.jpg","f099b95ff2ffa0ad4db70be939a37e09"],["/images/nieto.jpg","678ed2f95eb82f8b4c4f6b9084f261ec"],["/images/pati.jpg","ac19bdff209f178c93e0ff88e0320877"],["/images/placeholder.png","87e3f20d7ab1b6c039c179d96f6a9956"],["/images/rao.jpg","13b319838f9d999f3f63794c752c8bc4"],["/images/srinivasamurthy.png","781de1b115bd3c59480c52e8a076e3d3"],["/images/su.jpg","50c7b6b95c7f7fe8410193a9cde8cc9d"],["/images/vankranenburg.jpg","fc313660e8e6938d126b6ccee07829e2"],["/images/wu.jpg","e4ed47f3ad5af66212527067c73792ee"],["/images/yang.jpg","72dd29d93cdb80e89ffaf15ff99903a3"],["/index.html","09413cbfbb2245859f1ea883e13a8d8a"],["/sw.js","e478378ef8bc8cba184370cb4e8a69e2"],["/team/index.html","22e211e9c1309324b01bf866c187b985"],["/team_demo/index.html","65353ac2038550764fc6811be6c02024"]];
var cacheName = 'sw-precache-v3--' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
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

var createCacheKey = function(originalUrl, paramName, paramValue,
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

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
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

var stripIgnoredUrlParameters = function(originalUrl,
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
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
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

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
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







