'use strict';

const EmailTemplates = require('swig-email-templates')
const fileExists = require('file-exists')

/**
 * Module dependencies
 */

// Public node modules.
const _ = require('lodash');
const nodemailer = require('nodemailer');

/**
 * Email service.
 */

module.exports = {

  /**
   * Send an e-mail
   *
   * @param {Object} options
   * @param {Function} cb
   *
   * @return {Promise}
   */

  send: function * (options, cb) {

    // Init the Promise.
    const deferred = Promise.defer();

    try {

      // Format transport config.
      let transportConfig;
      if (strapi.api.email.config.smtp && strapi.api.email.config.smtp.service && strapi.api.email.config.smtp.service.name) {
        transportConfig = {
          service: strapi.api.email.config.smtp.service.name,
          auth: {
            user: strapi.api.email.config.smtp.service.user,
            pass: strapi.api.email.config.smtp.service.pass
          }
        };
      }

      // Config EmailTemplates

      const EmailTemplateConfig = {
        root: `${__dirname}/../views`,
        text: false,       // Disable text alternatives
        swig: {
          cache: false     // Don't cache swig templates
        },
        filters: {
          upper: function(str) {
            return str.toUpperCase();
          }
        }
      }

      // Init the transporter.
      const transporter = nodemailer.createTransport(transportConfig);

      // Init `variable` email.
      let email;

      // Check the callback type.
      cb = _.isFunction(cb) ? cb : _.noop;

      // Default values.
      options = _.isObject(options) ? options : {};
      options.from = strapi.api.email.config.smtp.from || '';
      options.text = options.text || options.html;
      options.html = options.html || options.text;

      // Register the `email` object in the database.
      email = yield Email.create(_.assign({
        sent: false
      }, options));

      // Finalstate
      const finalState = function (err) {
        if (err) {
          cb(err);
          deferred.reject(err);
        } else {
          Email.update(email.id, {
            sent: true
          }).exec(function (err, emailUpdated) {
            email = emailUpdated[0] || email;
            cb(null, email);
            deferred.resolve(email);
          });
        }
      }

      // Template
      let templates = null
      if (options.hasOwnProperty('view') && fileExists(`${__dirname}/../views/${options.view}.html`)) {
        templates = new EmailTemplates(EmailTemplateConfig)
        const send = transporter.templateSender({
          render: (context, callback) => {
            templates.render(`${__dirname}/../views/${options.view}.html`, context, function (err, html, text) {
                if(err){
                  return callback(err);
                }
                callback(null, {
                  html: html,
                  text: text
                });
            });
          }
        })

        // Send the email.

        send({
          from: options.from,
          to: options.to,
          subject: options.subject
        },
        options.data,
        finalState);
      } else {

        // Send the email.

        transporter.sendMail({
          from: options.from,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html
        }, finalState);
      }

    } catch (err) {
      deferred.reject(err);
    }

    return deferred.promise;
  }
};
