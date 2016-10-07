# qoverStrapi

A quick description of qoverStrapi.

post install

the solution should be executed on MacOSX

required

install nodejs on mac osx

suggestion on mac osx

install iterm2 Nightly Builds

install nvm

use nvm to install node

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | bash

install node

    nvm install v5.11.1
    nvm install v6.2.0

install mongo on mac osx (xcode installed needed)

https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

install homebrew

install homebrew

    /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

install mongodb

    brew install mongodb

create data path

    sudo -p /data
    sudo chmod -R 777 /data

execute mongodb

    mongod --dbpath=/data

install

unzip the package

2 directories: qover and qoverStrapi

- qover : the front-end part
- qoverStrapi : the api

qover

technology

- framework : react-redux-starter-kit version 2

install and run

    cd qover
    nvm use v6.2.0

    npm install
    npm start

access

admin url: http://localhost:1337/admin/#!/

admin user: qovertest@gmail.com

admin password: eduBcRtjID8

api graphql url example: http://localhost:1337/api/graphql?query={products{id,name,productparam{key,value}}}

test

    npm test

info

qover is developed with webstorm on mac osx

qoverStrapi

technology

- framework : strapi

install and run

    cd qoverStrapi
    nvm use v5.11.1
    npm i -g strapi gulp
    cd api/admin/public
    npm install
    gulp install

    npm install
    strapi start OR npm start OR node --harmony server.js

access

- url: http://localhost:3000/
- login: log with a valid user
- click on Form in the navbar
- fill the form
- press 'Get Price'
- visit the admin panel in quoverStrapi to see the quote in the Quote Table

test

no test for the moment

info

qoverTest is developed with Visual studio code on mac osx


## To rebuild the admin panel:

```
npm update strapi -g
rm -rf api/admin
rm -rf public/admin
strapi generate admin
cd api/admin/public
npm install
gulp dist
```
