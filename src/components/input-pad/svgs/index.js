const context = require.context(".", false, /\.svg$/);

context.keys().map(context);
