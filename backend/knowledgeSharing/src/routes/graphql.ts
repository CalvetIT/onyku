import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { schema } from '../graphql/schema';

const router = express.Router();

router.use('/', createHandler({
    schema: schema
}));

// Add GraphiQL middleware for development
router.use('/graphiql', (_req, res) => {
    res.send(`
        <html>
            <head>
                <title>GraphiQL</title>
                <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
            </head>
            <body style="margin: 0; height: 100vh;">
                <div id="graphiql" style="height: 100vh;"></div>
                <script src="https://unpkg.com/graphiql/graphiql.min.js"></script>
                <script>
                    const graphiql = GraphiQL.createGraphiQLFetcher({
                        url: '/graphql',
                    });
                    ReactDOM.render(
                        React.createElement(GraphiQL, { fetcher: graphiql }),
                        document.getElementById('graphiql'),
                    );
                </script>
            </body>
        </html>
    `);
});

export default router; 