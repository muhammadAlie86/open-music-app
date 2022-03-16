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


          this._validator.validatePlaylistSongPayload(request.payload);
          const { id: credentialId } = request.auth.credentials;
          const { playlistId } = request.params;
          const { songId } = request.payload;

          await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId);

          const playlistSongsId = await this._playlistsSongsService.addPlaylistSong(playlistId, songId);
          
          const response = h.response({
          
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {

              playlistSongsId,

            },
          });
          response.code(201);
          return response;
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

          const { playlistId } = request.params;
          const { songId } = request.payload;
          const { id: credentialId } = request.auth.credentials;

          await this._playlistsService.verifyPlaylistOwner(playlistId,credentialId);

          const playlistSongsId = await this._playlistsSongsService.deleteSongFromPlaylist(playlistId, songId);
            
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
  }

module.exports = PlaylistSongsHandler;