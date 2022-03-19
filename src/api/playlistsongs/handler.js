const ClientError = require('../../exceptions/ClientError');
const NotFoundError = require('../../exceptions/NotFoundError');


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
        
        const { id: credentialId } = request.auth.credentials;
        const { playlistId, any} = request.params;

        if (any !== 'songs') {
          throw new NotFoundError('Resource not found')
        }
        
        this._validator.validatePlaylistSongPayload(request.payload);
        const { songId } = request.payload;
         
        await this._playlistsService.verifyPlaylistAccess(playlistId,credentialId);
        await this._playlistsSongsService.addPlaylistSong(playlistId, songId);
          
        const response = h.response({
          
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            
        });
        response.code(201);
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
      
    
    async getPlaylistsSongHandler (request,h) {
        
      try{
        
        const { id: credentialId } = request.auth.credentials
        const { playlistId, any } = request.params
        if (any !== 'songs') {
          throw new NotFoundError('Resource not found')
        }
        
        await this._playlistsService.verifyPlaylistAccess(playlistId,credentialId);
        const songs = await this._playlistsSongsService.getPlaylistSongs(playlistId);
          
        return{
            
            status: 'success',
            data: {
              songs,
            },
          };
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
    
   
    async deletePlaylistSongsHandler (request, h) {
    try{
        const { id: credentialId } = request.auth.credentials
        const { playlistId, any } = request.params
        if (any !== 'songs') {
          throw new NotFoundError('Resource not found')
        }
          
        this._validator.validatePlaylistSongPayload(request.payload)
          const { songId } = request.payload;

          await this._playlistsService.verifyPlaylistAccess(playlistId,credentialId);

          await this._playlistsSongsService.deleteSongFromPlaylist(playlistId, songId);
            
          return{
              
              status: 'success',
              message: 'Playlist lagu berhasil dihapus.',
              
            
            };
          }catch (error) {
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
  }

module.exports = PlaylistSongsHandler;