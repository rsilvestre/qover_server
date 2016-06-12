# qoverStrapi

A quick description of qoverStrapi.

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
