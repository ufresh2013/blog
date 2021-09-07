const VERSION = '1.0.0'
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      let request = event.request.clone();
      return fetch(request).then(httpRes => {
        // http请求的返回已被抓到，可以处置了。
        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        let responseClone = httpRes.clone();
        caches.open(VERSION).then(cache => {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      }, err => {
        // 如果 Service Workder 之前存储了该资源，返回该资源
        if (response) {
          return response;
        }
      });
    })
  );
}, err => {
  console.log(err)
});
