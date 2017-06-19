module.exports = (req, res, context, result) => {
    if (! context || !context.meta)
        return res.send(result);

    if (context.meta.state === 'noContent')
        return res.status(204).send();

    if (context.meta.state === 'partial')
        return res.status(206).send(result);

    if (context.meta.state === 'stream')
        return res.download(context.meta.path);

    if (context.meta.state === 'redirect') {
        const code = context.meta.code || 302;
        return res.status(code).send(context.meta.url);
    }

    if (context.meta.state === 'created') {
        if (context.meta.resourceURI)
            res.header('location', context.meta.resourceURI);

        return res.status(201).send();
    }

    return res.send(result);
};
