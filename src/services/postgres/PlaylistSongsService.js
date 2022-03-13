const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');
 


class PlaylistSongsService{

    constructor(){
        this._pool = new Pool();
    }

    
    async addPlaylistSong({ playlistId, songId }){

        const id = `playlist_song-${nanoid(16)}`;

        const query = {

            text : 'INSERT INTO playlistSongs VALUES ($1, $2, $3) RETURNING id',
            values : [id, playlistId, songId],
        };

        
        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Playlist lagu gagal ditambahkan');
          }
       
        return result.rows[0].id;
    }
    async getPlaylistSongs(playlistId) {
        
        const query = {
            text: `SELECT songs.id, songs.title, songs.performer
            FROM songs
            LEFT JOIN playlistsongs ON songs.id = playlistsongs.id
            WHERE playlistsongs.id = $1`,
            values: [playlistId],
          };
      
          const result = await this._pool.query(query);
      
          return result.rows;
      }


      async deleteSongFromPlaylist(playlistId, songId) {
        
        const query = {
        
            text: 'DELETE FROM playlistsongs WHERE id = $1 AND id = $2 RETURNING id',
              values: [playlistId, songId],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rowCount) {
          throw new InvariantError(
            'Lagu gagal dihapus dari playlist. Id tidak ditemukan',
          );
        }
    }
}

module.exports = PlaylistSongsService;