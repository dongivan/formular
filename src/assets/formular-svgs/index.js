const context = require.context(".", true, /\.svg$/);

context.keys().map(context);
