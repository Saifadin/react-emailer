const fs = require('fs');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const STYLES_TAG = '{{ STYLES }}';
const CONTENT_TAG = '{{ CONTENT }}';

/**
 * Fetch the file from the file system
 *
 * @param {String} filePath
 * @return {Promise.<string>}
 */
const fetchFile = filePath => {
  return new Promise((resolve, reject) => {
    const connectedPath = path.join(__dirname, filePath);

    return fs.readFile(connectedPath, { encoding: 'utf8' }, (err, file) => {
      if (err) return reject(err);

      return resolve(file);
    });
  });
};

/**
 * Renders the React app with the passed data.
 * Returns a promise that resolves to the full email HTML.
 * @param {ReactElement} Component
 * @param {Object} emailData
 * @param {String} globalStyles
 * @return {Promise.<String>}
 */
module.exports = (Component, emailData, globalStyles = '') => {
  return Promise.all([fetchFile('./template.html')]).then(([template]) => {
    const emailElement = React.createElement(Component, { ...emailData });
    const content = ReactDOMServer.renderToStaticMarkup(emailElement);

    let emailHTML = template;
    emailHTML = emailHTML.replace(CONTENT_TAG, content);
    emailHTML = emailHTML.replace(STYLES_TAG, globalStyles);

    return emailHTML;
  });
};
