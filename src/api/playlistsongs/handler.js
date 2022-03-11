const ClientError = require('../../exceptions/ClientError');


class PlaylistSongsHandler {

    constructor (service, validator){

        this._service = service; 
        this._validator = validator;

        this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
        this.getPlaylistsSongHandler = this.getPlaylistsSongHandler.bind(this);
        this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
      
      }

    async postPlaylistSongHandler (request, h ) {

        try{
            
          this._validator.validatePlaylistSongPayload(request.payload);
          
          const { name } = request.payload;
          const songId = await this._service.addPlaylistSong ({ 
            name,
          });
          
          const response = h.response({
          
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {

              songId,

            },
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
    
    async getPlaylistsSongHandler (request, h) {
        
      try{
            
          const { id } = request.params;
          const song = await this._service.getPlaylistSongs(id);
          const response = h.response({
            
            status: 'success',
            message: 'Berhasil mengambil playlist lagu',
            data: {
              song,
            },
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
    
   
    async deletePlaylistSongsHandler (request, h) {

        try {
            const { id } = request.params;
            await this._service.deletePlaylistSongById(id);
            
            const response = h.response({
              
              status: 'success',
              message: 'Playlist lagu berhasil dihapus.',
            
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