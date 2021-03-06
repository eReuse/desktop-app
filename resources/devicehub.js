const _ = require('lodash')
const configEnv = require('./.env.json')
const rp = require('request-promise')
const Promise = require('promise')

/**
 *
 * @returns {DeviceHub}
 * @private
 */
function deviceHub () {
  const BASE_URL = configEnv.url || 'http://devicehub.ereuse.net'
  const method = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    json: true
  }
  let db = null
  let login_promise = null

  class DeviceHub {
    /**
     *
     * @param url - string
     * @param body - object
     */
    static post(url, body) {
      return new Promise((resolve, reject) => {
        this._login_if_needed().then(() => {
          this._post(url, body, db).then(resolve).catch(reject)
        }).catch(reject)
      })
    }

    static get(url, isFile = false) {
      return new Promise((resolve, reject) => {
        this._get(url, {}, isFile).then(resolve).catch(reject)
      })
    }


    /**
     *
     * @return Promise - promise with the account
     * @private
     */
    static _login_if_needed() {
      if (_.isNull(login_promise)) {
        const body = {
          email: configEnv.mailDh,
          password: configEnv.pwdDh
        }
        login_promise = this._post('/login', body).then(account => {
          db = account.defaultDatabase
          method.headers.Authorization = 'Basic ' + account.token
        })
      }
      return login_promise
    }

    /**
     *
     * @param uri string
     * @param body Object
     * @param db string
     * @return Promise
     * @private
     */
    static _post(uri, body, db = null) {
      const _method = _.clone(method)
      _method.url = db ? BASE_URL + db + '/' + uri : BASE_URL + uri
      _method.body = body
      _method.method = 'POST'
      return rp(_method)
    }

    static _get(uri, headers = {}, isFile = false) {
      const _method = _.clone(method)
      _method.url = uri
      if (isFile) {
        _method.encoding = null
        _method.json = false
        headers.Accept = '*/*'
      }
      _.merge(_method.headers, headers)
      _method.method = 'GET'
      return rp(_method)
    }
  }

  return DeviceHub
}

module.exports = deviceHub()
