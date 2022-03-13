const PlaylistSongsHandler = require('./handler');
const routes = require('./routes');

module.exports = {

    name : 'playlistssongs',
    version : '1.0.0',
    register : async (server, {  
        service,
        validator,
    
    }) => {

        const playlistSongHandler = new PlaylistSongsHandler(  
            
            service,
            validator,
        
        );
        server.route(routes(playlistSongHandler));

    },
};