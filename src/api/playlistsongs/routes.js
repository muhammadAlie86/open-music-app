const routes = (handler) =>[

    {
        method : 'POST',
        path : '/playlists/{id}/song',
        handler : handler.postPlaylistSongHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },

    {
        method : 'GET',
        path : '/playlists/{id}/song',
        handler : handler.getPlaylistsSongHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    {
        method : 'DELETE',
        path : '/playlists/{id}/song',
        handler : handler.deletePlaylistSongsHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    

];

module.exports = routes;