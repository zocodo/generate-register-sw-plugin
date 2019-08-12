(function(version, isUsePwa, filepath) {
  if ('serviceWorker' in navigator) {
    var serviceWorkerUrl = filepath + '?v=' + version
    var localVersion = localStorage.getItem('serviceWorkerVersion')
    var isNewVersion = (version != localVersion)
    if (isUsePwa === 'true') {
      if (isNewVersion && (localVersion !== null || localVersion !== undefined)) {
        version && localStorage.setItem('serviceWorkerVersion', version)
        deleteCacahe()
      } else {
        navigator.serviceWorker.register(serviceWorkerUrl).then(function(registration) {
          console.log('regist success')
        }).catch(function(error) {
          console.log('regist fail', error)
        });
      }
    } else {
      unregisterSw()
    }

    function unregisterSw() {
      navigator.serviceWorker.getRegistrations().then(function(regs) {
        for (var reg of regs) {
          if (new RegExp(location.origin).test(reg.scope)) {
            console.log(reg.scope)
            reg.unregister().then(function(reg) {
              console.log('unregist success', reg)
              deleteCacahe().then(function() {
                location.reload()
              })
            });
          }
        }
      })
    }

    function deleteCacahe() {
      return caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            // 如果当前版本和缓存版本不一致
            return caches.delete(cacheName);
          })
        )
      })
    }
  }
})('{{version}}', '{{isOpenPWA}}', '{{swFilePath}}');
