const routes = (handler) => [

    {
        method : 'POST',
        path : '/albums',
        handler : handler.postAlbumHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    
    {
        method : 'GET',
        path : '/albums/{id}',
        handler : handler.getAlbumByIdHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    {
        method : 'PUT',
        path : '/albums/{id}',
        handler : handler.putAlbumByIdHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    {
        method : 'DELETE',
        path : '/albums/{id}',
        handler : handler.deleteAlbumByIdHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },

    
];
module.exports = routes;