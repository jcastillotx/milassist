const Sentry = require('@sentry/node');
const { ProfilingIntegration } = require('@sentry/profiling-node');

/**
 * Initialize Sentry error tracking
 * Only enabled in production with valid DSN
 */
function initSentry(app) {
  // Only initialize in production with valid DSN
  if (process.env.NODE_ENV !== 'production' || !process.env.SENTRY_DSN) {
    console.log('Sentry: Skipping initialization (not in production or no DSN)');
    return;
  }

  try {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      integrations: [
        // Enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // Enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // Enable profiling
        new ProfilingIntegration(),
      ],

      // Performance Monitoring
      tracesSampleRate: parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE || '0.1'),

      // Profiling
      profilesSampleRate: parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE || '0.1'),

      // Release tracking
      release: process.env.SENTRY_RELEASE || 'milassist@1.0.0',

      // Filter sensitive data
      beforeSend(event) {
        // Remove sensitive headers
        if (event.request?.headers) {
          delete event.request.headers.authorization;
          delete event.request.headers.cookie;
        }

        // Remove sensitive query parameters
        if (event.request?.query_string) {
          const params = new URLSearchParams(event.request.query_string);
          params.delete('token');
          params.delete('api_key');
          event.request.query_string = params.toString();
        }

        return event;
      },
    });

    console.log('✓ Sentry initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Sentry:', error.message);
  }
}

/**
 * Get Sentry request handler middleware
 */
function getRequestHandler() {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    return Sentry.Handlers.requestHandler();
  }
  return (req, res, next) => next();
}

/**
 * Get Sentry error handler middleware
 */
function getErrorHandler() {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    return Sentry.Handlers.errorHandler();
  }
  return (err, req, res, next) => next(err);
}

/**
 * Capture exception manually
 */
function captureException(error, context = {}) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Exception:', error, context);
  }
}

/**
 * Capture message manually
 */
function captureMessage(message, level = 'info', context = {}) {
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureMessage(message, { level, extra: context });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
  }
}

module.exports = {
  initSentry,
  getRequestHandler,
  getErrorHandler,
  captureException,
  captureMessage,
  Sentry
};
