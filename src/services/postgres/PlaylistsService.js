const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
 


class PlaylistsService{

    constructor(){
        this._pool = new Pool();
    }

    
    async addPlaylist({ name, owner }){

        const id = `playlist-${nanoid(16)}`;

        const query = {

            text : 'INSERT INTO albums VALUES ($1, $2, $3) RETURNING id',
            values : [id, name, owner]
        };

        
        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new InvariantError('Playlist gagal ditambahkan');
          }
       
        return result.rows[0].id;
    }
    async getPlaylists(owner) {
      
      const query = {
        
        text: 'SELECT * FROM playlists WHERE owner = $1',
        values: [owner],
      
      };
    
        const result = await this._pool.query(query);
    
        return result.rows.map(
          (playlist) => playlist.id, playlist.name,
        );
      }


    async getPlaylistById(id){

        const query = {
            
            text: 'SELECT * FROM playlists WHERE id = $1',
            values: [id],

          };
          
        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('Playlist tidak ditemukan');
        }

        return result.rows[0];
        
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
}

module.exports = PlaylistsService;