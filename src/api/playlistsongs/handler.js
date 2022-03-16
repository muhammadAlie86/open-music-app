const ClientError = require('../../exceptions/ClientError');


class PlaylistSongsHandler {

    constructor (playlistsSongsService, playlistsService,validator){

        this._playlistsSongsService = playlistsSongsService;
        this._playlistsService = playlistsService; 
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistsSongHandler = this.getPlaylistsSongHandler.bind(this);
        this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
      
      }

    async postPlaylistSongHandler (request, h ) {

        try{

          this._validator.validatePlaylistSongPayload(request.payload);
          const { id: credentialId } = request.auth.credentials;
          const { id : playlistId } = request.params;
          const { songId } = request.payload;

          await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId);

          const playlistSongsId = await this._playlistsSongsService.addPlaylistSong(songId, playlistId);
          
          const response = h.response({
          
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {

              playlistSongsId,

            },
          });
            
          return response;
        
        }
        
        catch (error) {
          
          if (error instanceof ClientError) {
            const response = h.response({
              
              status: 'fail',
              message: error.message,
            
            });

            response.code(error.statusCode);
            return response;
          
          }
     
          const response = h.response({
            
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          
          });
          
          response.code(500);
          console.error(error);
          return response;
        }
      }
    
    async getPlaylistsSongHandler (request, h) {
        
        const { playlistId } = request.params;
        const { id: credentialId } = request.auth.credentials;

        await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId);
        const songs = await this._playlistsSongsService.getPlaylistSongs(playlistId);
          
        const response = h.response({
            
            status: 'success',
            message: 'Berhasil mengambil playlist lagu',
            data: {
              songs,
            },
          });

          response.code(200);
          return response;
    }
    
   
    async deletePlaylistSongsHandler (request, h) {

        try {
          
          const { playlistId } = request.params;
          const { songId } = request.payload;
          const { id: credentialId } = request.auth.credentials;

          await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId);

          const playlistSongsId = await this._playlistsSongsService.deleteSongFromPlaylist(songId,playlistId);
            
            const response = h.response({
              
              status: 'success',
              message: 'Playlist lagu berhasil dihapus.',
              data : {
                playlistSongsId,
              }
            
            });

            response.code(200);
            return response;
      
            
        } 
        catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              
              status: 'fail',
              message: error.message,
            
            });
            
            response.code(error.statusCode);
            return response;
          }
     
          // Server ERROR!
          const response = h.response({
            
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          
          });
          
          response.code(500);
          console.error(error);
          return response;
        }
      }
  }

module.exports = PlaylistSongsHandler;