const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
 


class PlaylistsService{

    constructor(collaborationService){
        this._pool = new Pool();
        this._collaborationService = collaborationService;
    }

    
    async addPlaylist({ name, owner }){

        const id = `playlist-${nanoid(16)}`;

        const query = {

            text : 'INSERT INTO playlists VALUES ($1, $2, $3) RETURNING id',
            values : [id, name, owner]
        };

        
        const result = await this._pool.query(query);

        if (!result.rows[0].id) {
            throw new InvariantError('Playlist gagal ditambahkan');
          }
       
        return result.rows[0].id;
    }

    async getPlaylists(owner) {
      
      const query = {
        
        text: `SELECT playlists.* FROM playlists
        LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
        WHERE playlists.owner = $1 OR collaborations.user_id = $1
        GROUP BY playlists.id`,
        values: [owner],
      
      };
    
        const result = await this._pool.query(query);
    
        return result.rows.map(
          (playlist) => playlist.id, playlist.name,playlist.owner
        );
      }


    async getPlaylistById(id){

        const query = {
            
            text: `SELECT playlists.name, users.username
            FROM playlists
            LEFT JOIN users ON users.id = playlists.owner
            WHERE playlists.owner = $1`,
            values: [id],

          };
          
        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows((playlist) => playlist.id, playlist.name,);
        
    }

   

    async deletePlaylistById(id){

        const query = {

            text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
            values: [id],
            
          };
       
          const result = await this._pool.query(query);
       
          if (result.rowCount === 0) {
            throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
          }

          return result.rows;


    }

    async verifyPlaylistOwner(id, owner){
      
      const query = {
        
        text: 'SELECT * FROM playlists WHERE id = $1',
        values: [id],
      };
      
      const result = await this._pool.query(query);
      if (result.rowCount === 0) {
        
        throw new NotFoundError('Playlist tidak ditemukan');
      }

      const playlist = result.rows[0];
      
      if (playlist.owner !== owner) {
        throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
      }

    }
    
    async verifyPlaylistAccess(playlistId, userId) {

      try {
        
        await this.verifyNoteOwner(playlistId, userId);
      } 
      catch (error) {
        
        if (error instanceof NotFoundError) {
          throw error;
        }
        try {
          
          await this._collaborationService.verifyCollaborator(playlistId, userId);
        } 
        catch {
          
          throw error;
        }
      }
    }
}

module.exports = PlaylistsService;