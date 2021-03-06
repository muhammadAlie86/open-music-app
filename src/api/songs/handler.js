const ClientError = require('../../exceptions/ClientError');


class SongsHandler {

    constructor (service, validator){

        this._service = service; 
        this._validator = validator;
        
        this.postSongHandler = this.postSongHandler.bind(this);
        this.getAllSongsHandler = this.getAllSongsHandler.bind(this);
        this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
        this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
        this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
    
    async postSongHandler (request, h){


        try{
            
            this._validator.validateSongPayload(request.payload);

            const { 
              
              title = 'untitled', 
              year, 
              genre, 
              performer, 
              duration,
              
            } = request.payload;

            const songId = await this._service.addSong({ 
              
              title, 
              year, 
              genre, 
              performer, 
              duration,
            
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
    
    async getAllSongsHandler (request, h){

      const { title, performer } = request.query;
      
      try {
        
        let songs = await this._service.getSongs(title, performer);
        songs = songs.map((song) => ({
          
          id: song.id,
          title: song.title,
          performer: song.performer,
        
        }));

        const response = h.response({
          
          status: 'success',
          message: 'Daftar song berhasil diambil',
          data: {
          
            songs,
          
          },
        });
        
        response.code(200);
        return response;
      } 
      catch (error) {

        const response = h.response({
          
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        
        });
        
        response.code(500);
        console.error(error);
        return response;

      }

    }
    
    async getSongByIdHandler (request, h){

        try{
            const { id } = request.params;
            const song = await this._service.getSongById(id);
            return {

                status : 'success',
                data : {

                    song,

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
    
    async putSongByIdHandler (request, h){
        try {
            
            this._validator.validateSongPayload(request.payload);
            const { id } = request.params;
            const { 
              title, 
              year, 
              genre, 
              performer, 
              duration,
            } = request.payload;
          
            await this._service.putSongById(id, {
              title,
              year,
              genre,
              performer,
              duration,
            });
       
            const response = h.response({
              
              status: 'success',
              message: 'song berhasil diubah',
            
            });
            
            response.code(200);
            return response
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
        };

    }
    
    async deleteSongByIdHandler (request, h){
        try {
            const { id } = request.params;
            await this._service.deleteSongById(id);
            return {

              status: 'success',
              message: 'Song berhasil dihapus',

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
module.exports = SongsHandler;