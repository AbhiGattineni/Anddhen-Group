const errorConfig = {
  ECONNABORTED: {
    code: 'ACS001',
    title: 'Timeout',
    message: 'The request timed out. Please try again later.',
  },
  NETWORK_ERROR: {
    code: 'ACS002',
    title: 'Network Error',
    message: 'Network Error. Please check your connection.',
  },
  'auth/invalid-value-(email)': {
    code: 'ACS501',
    title: 'Invalid Value',
    message: 'The email address is not valid. Please check and try again.',
  },
  'auth/invalid-login-credentials': {
    code: 'ACS502',
    title: 'Invalid Credentials',
    message:
      'The email address/password is not valid. Please check and try again.',
  },
  'auth/email-already-in-use': {
    code: 'ACS503',
    title: 'Email exists',
    message: 'The email already registered',
  },
  // Add more error configurations as needed
};

const useErrorHandling = (error) => {
  let errorCode = error?.code || 'ACS999'; // Default error code if not found in config
  if (
    errorCode ===
    'auth/invalid-value-(email),-starting-an-object-on-a-scalar-field'
  ) {
    errorCode = 'auth/invalid-value-(email)';
  }
  let config = errorConfig[errorCode] || {
    code: 'ACS999',
    title: 'Unexpected Error',
    message: 'An unexpected error occurred. Please try again later.',
  };

  return {
    errorCode: config.code,
    title: config.title,
    message: config.message,
  };
};

export default useErrorHandling;
