export default {
    install(app, { router }) {
      router.afterEach((to) => {
        if (window.gtag) {
          window.gtag("config", "G-DHQ4419S3M", {
            page_path: to.fullPath,
          })
        }
      })
    },
  }
  
  