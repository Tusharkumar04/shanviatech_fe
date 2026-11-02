const { getNamespace } = require('cls-hooked');
const config = require('../../config/config');
const RELATIVE_FILE_PREFIXES = ['/public/', 'public/', '/admin/images/', 'admin/images/'];

const isPlainObject = (value) => {
  if (!value || typeof value !== 'object') {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
};

const getBaseUrl = () => {
  try {
    const namespace = getNamespace('app');
    const requestUrl = namespace && namespace.get('requestUrl');
    if (requestUrl) {
      const parsed = new URL(requestUrl);
      return parsed.origin;
    }
  } catch (error) {
    // Ignore and use config fallback
  }

  const protocol = config.ssl ? 'https' : 'http';
  return `${protocol}://${config.hostname}:${config.port}`;
};

const toAbsolutePublicPath = (value, baseUrl) => {
  if (typeof value !== 'string') {
    return value;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const isRelativeFilePath = RELATIVE_FILE_PREFIXES.some((prefix) => value.startsWith(prefix));
  if (!isRelativeFilePath) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${baseUrl}${normalizedPath}`;
};

const transformValue = (value, baseUrl) => {
  if (Array.isArray(value)) {
    return value.map((item) => transformValue(item, baseUrl));
  }

  if (value && typeof value === 'object') {
    if (typeof value.toObject === 'function') {
      return transformValue(value.toObject(), baseUrl);
    }

    if (!isPlainObject(value)) {
      return value;
    }

    const transformedObject = {};
    Object.entries(value).forEach(([key, nestedValue]) => {
      transformedObject[key] = transformValue(nestedValue, baseUrl);
    });
    return transformedObject;
  }

  return toAbsolutePublicPath(value, baseUrl);
};

const addBaseUrlToPublicPaths = (data) => {
  const baseUrl = getBaseUrl();
  return transformValue(data, baseUrl);
};

module.exports = {
  addBaseUrlToPublicPaths,
};
