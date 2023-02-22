# HTML5-MOVING-VUE

**html5-moving-vue** is a tool for you moving in/out.
You can simplely deploy this tools in your home pc or laptop, and using it on web browser in your mobile phones(Safari, Chrome).
There is a server-side project named **moving** written in golang you can find it [here](https://github.com/alydnhrealgang/moving) and follow its instructs to deploy.

# Overview
This moving application offers organizing your stuffs when you are moving out and you will get an information list of organized articles in each boxes.

- Use the camera on mobile phone as a barcode scanner.
- Easily to create/update/delete boxes and articles after a barcode scanned.
- Easily moving articles from one box to another.
- You will get a complete inventory of mainifests on each **boxes**.

# Concepts
The ideas of **moving** tools consists of 3 parts:

- **BOX** is a container that can hold various **ARTICLES**. The most important feature of a box is its "code," which can be represented by a barcode label that you affix onto it.
- **ARTICLE** represents an individual item or a group of items (such as a collection of photos you've taken). The primary characteristic of an article is its "code" which is the same as the **code** for a **BOX**. It also includes a "parent code" that indicates the box to which it belongs.
- **CART** is a virtual **BOX** that does not exist as a physical **BOX**. You can think of it as a shopping cart that you fill with items you want to buy when you're shopping. You can then select some of those **ARTICLES** and place them into a physical **BOX**.

# Prepare for running
You should do some preparation for your first running:

- Due to the security reasons in your mobile browsers, if we'd like to invoke the camera function on HTML5 page, we should make an SSL root certificate and install in your mobile phone and set it up to your host server to provide an https website, you can follow up this article [How to Create Your Own SSL Certificate Authority for Local HTTPS Development](https://deliciousbrains.com/ssl-certificate-authority-for-local-https-development/#becoming-certificate-authority) to get it done. After that you should put generated certification files to `/certs` folder, the default certification file names are `/certs/192.168.31.49.key` and `/certs/192.168.31.49.crt` and if the file name changes you could update them in [vite.config.js](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/vite.config.js).
```js
function sslPlugin() {
  return {
    name: "vite:ssl",
    async configResolved(config) {
      const https = () => ({
        key: __dirname + "replace_to_key_file_path",
        cert: __dirname + "replace_to_crt_file_path"
      });
      config.server.https = Object.assign({}, config.server.https, https());
      config.preview.https = Object.assign({}, config.preview.https, https());
    }
  };
}
```
- You should either print or buy barcode stickers with a size of 4cm x 8cm and a ratio of 1:2. Currently, the system only supports barcodes in the range of "689500001" to "689500999".
> If you want **use difference size of barcode stickers** and in order to **ensure the quality of scanned result**, you can change `scanWidth` and `scanHeight` value in [QrCodeScanner.vue](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/src/components/QrCodeScanner.vue)

> If you want **change the range of barcodes**, you can change the regex `VITE_BAR_CODE_REGEXP` in [.evn](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/.evn) file
- Before running the program, you should set up the moving server. 
> The default API server URL is `https://192.168.31.49:8443/v1`, which is specified in the .env.production file. You should update this URL to the correct address for your moving server.

# Run it
**html5-moving-vue** is created by vue3 and could running wth vite.
- For development environment, you can:
```bash
> cd html5-moving-vue
> npm install # install all the dependencies for the project, run only once.
> npm run dev
```
# Deploy
```bash
> cd html5-moving-vue
> npm run build
```
The compiled codes are in `dist` folder, you can deploy it to IIS, NGINX, etc.
please note that you should add SSL certification configuration to your web server. 

# Photofilo

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/1.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/2.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/3.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/4.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/5.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/6.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/7.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/8.jpg?raw=true)

![enter image description here](https://github.com/alydnhrealgang/html5-moving-vue/blob/main/portfolio/9.jpg?raw=true)
