const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {

    name : 'playlistssongs',
    version : '1.0.0',
    register : async (server, {  
        playlistsSongsService,
        playlistsService,
        validator,
    
    }) => {

        const playlistSongHandler = new PlaylistSongsHandler(  
            
            playlistsSongsService,
            playlistsService,
            validator,
        
        );
        server.route(routes(playlistSongHandler));

    },
};