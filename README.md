# XO
A 1v1 round-based browser-game. Using <a href="https://nuxtjs.org/" target="_blank">Nuxt.js</a> for app structure and [Socket.io](https://socket.io/) for real-time. This app uses SVG-Elements wrapped as [Vue-Components](https://vuejs.org/v2/guide/components.html/) and is laid out with [Vuetify](https://vuetifyjs.com/).

Checkout the live [Demo](http://xo-app.de/).

## Getting Started
Make sure you have [Git](https://git-scm.com/downloads/), [Node.js](https://nodejs.org/en/) and [NPM](https://www.npmjs.com/get-npm/) or [Yarn](https://yarnpkg.com/lang/en/) installed on your system.

## Clone
``` bash
git clone https://github.com/dafuniok/xo.git
```

## Install, build and run
``` bash
# change directory
$ cd xo

# install dependencies
$ npm install

# serve with hot reload at localhost:9000
$ npm run dev

# for more script options see package.json file
```

For more configuration check out [Nuxt.js docs](https://nuxtjs.org/).

## Docker
``` bash
# building image
$ docker build -t <your username>/xo .

# run image
$ docker run -p 9000:9000 -d <your username>/xo
```

## License

The source code is licensed under MIT license