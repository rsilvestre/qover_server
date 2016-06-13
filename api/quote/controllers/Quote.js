'use strict';
const _ = require('lodash')
const model = 'quote';

const pipe = func => x => func.reduce((v,f) => f(v), x)

const getValidationRules = function * (data) {
  if (data.hasOwnProperty('quoteProduct')) {
    const product = yield Product.findOne({id: data.quoteProduct});
    const productparam = yield Productparam.find({productProductParam: product.id});
    const producttype = yield Producttype.findOne({id: product.producttype});
    const producttypedefaultparam = yield Producttypedefaultparam.find({productTypeProductTypeDefault: producttype.id});
    const result = _.differenceWith(producttypedefaultparam, productparam, (a, b) => a.name === b.name).concat(productparam)
    return result
  }
}

const validation = rules => data => {
  const errors = rules.filter(rule => {
    const dataValue = data[rule.key]
    const ruleFields = rule.value.match(/([^\d]+)(\d+)/)
    if (!ruleFields || ruleFields.length === 0) {
      return false
    }
    const ruleCommand = ruleFields[1]
    const ruleValue = ruleFields[2]
    switch (ruleCommand) {
      case '=':
        return dataValue != ruleValue && rule.message
      case '>':
        return Number(dataValue) < Number(ruleValue) && rule.message
      case '<':
        return Number(dataValue) > Number(ruleValue) && rule.message
      default:
        return false
    }
  })
  return errors
}

const getPriceRules = function * (data) {
  if (data.hasOwnProperty('quoteProduct')) {
    const rules = yield Productprice.find({productProductPrice: data.quoteProduct})
    return rules
  }
}

const getPrice = rules => data => {
  const price = rules.filter(rule => {
    const dataValue = data[rule.key]
    const ruleFields = rule.value.match(/([^\d]+)(\d+)/)
    const ruleCommand = ruleFields[1]
    const ruleValue = ruleFields[2]
    switch (ruleCommand) {
      case '=':
        return dataValue != ruleValue && filter.price
      case '>':
        return Number(dataValue) > Number(ruleValue) && rule.price
      case '<':
        return Number(dataValue) < Number(ruleValue) && rule.price
      case '>=':
        return Number(dataValue) >= Number(ruleValue) && rule.price
      case '<=':
        return Number(dataValue) <= Number(ruleValue) && rule.price
      default:
        return false
    }
  })
  return price
}

/**
 * A set of functions called "actions" for `Quote`
 */

module.exports = {

  /**
   * Get Quote entries.
   *
   * @return {Object|Array}
   */

  find: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.find(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Get a specific Quote.
   *
   * @return {Object|Array}
   */

  findOne: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.findOne(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Create a Quote entry.
   *
   * @return {Object}
   */

  create: function * () {
    const _ctx = this;
    this.model = model;

    const body = _ctx.request.body;

    const validationRules = yield getValidationRules(body)

    const valid = validation(validationRules)(body)

    if (valid.length > 0) {
      return this.body = {
        error: valid.map(value => ({
          key:value.key,
          value:value.message
        })).reduce((previousValue, currentValue) => {
          previousValue[currentValue.key] = currentValue.value
          return previousValue
        }, {}),
        data: null
      }
    }

    const priceRules = yield getPriceRules(body)

    const price = getPrice(priceRules)(body)

    if (price.length !== 1) {
      this.throw('Don\'t find quote', 500)
    }
    
    try {
      // let entry = yield strapi.hooks.blueprints.create(this);
      const entry = yield Quote.create({
        lastname: body.lastname,
        price: price[0].price,
        carcc: body.carcc,
        createdBy: this.user,
        updatedBy: this.user,
        controbutors: [this.user],
        quoteProduct: body.quoteProduct
      })


      const product = yield Product.findOne({id: body.quoteProduct});
      
      const email = yield strapi.api.email.services.email.send({
        fast: true,
        view: 'quote',
        data: Object.assign({}, entry, {product: product}),
        from: 'contact@company.com', // Sender (defaults to `strapi.config.smtp.from`).
        to: ['willtard@gmail.com'], // Recipients list.
        subject: `Quote for : ${product.name}`
      })

      // this.body = entry;
      this.body = {
        error: null,
        data: {
          entry: entry,
          product: product
        }
      }
    } catch (err) {
      this.body = {
        error: err,
        data: null
      };
    }
  },

  /**
   * Update a Quote entry.
   *
   * @return {Object}
   */

  update: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.update(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Destroy a Quote entry.
   *
   * @return {Object}
   */

  destroy: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.destroy(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Add an entry to a specific Quote.
   *
   * @return {Object}
   */

  add: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.add(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  },

  /**
   * Remove a specific entry from a specific Quote.
   *
   * @return {Object}
   */

  remove: function * () {
    this.model = model;
    try {
      let entry = yield strapi.hooks.blueprints.remove(this);
      this.body = entry;
    } catch (err) {
      this.body = err;
    }
  }
};
