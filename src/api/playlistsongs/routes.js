const routes = (handler) =>[

    {
        method : 'POST',
        path : '/playlists/{playlistId}/songs',
        handler : handler.postPlaylistSongHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },

    {
        method : 'GET',
        path : '/playlists/{playlistId}/songs',
        handler : handler.getPlaylistsSongHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    {
        method : 'DELETE',
        path : '/playlists/{playlistId}/songs',
        handler : handler.deletePlaylistSongsHandler,
        options: {
            auth: 'musicsapp_jwt',
        },
    },
    

];

module.exports = routes;