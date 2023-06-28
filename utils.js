module.exports = {
    addBackslashIfNeeded:function(str) {
        if (!str.startsWith("/")) {
          str = "/" + str;
        }
        return str;
    },
    checkAndReturnFunction:function(value, defaultFunction) {
        if (typeof value === 'function') {
          return value;
        } else {
          return defaultFunction;
        }
      }
}