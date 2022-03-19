const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const { nanoid } = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');


class SongsService{

    constructor(){
        this._pool = new Pool();
    }

    async addSong({ title, year, genre, performer, duration}){

        const id = `song-${nanoid(16)}`;
        

        
        const query = {

            text : 'INSERT INTO songs VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values : [id, title, year, genre, performer, duration],
        }

        
        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new InvariantError('Lagu gagal ditambahkan');
          }
       
        return result.rows[0].id;

    }

    async getSongs() {

        const result = await this._pool.query('SELECT * FROM songs');
        return result.rows;
    }

    async getSongById(id){

        const query = {
            text: 'SELECT * FROM songs WHERE id = $1',
            values: [id],
          };
          
        const result = await this._pool.query(query);
        
        if (result.rowCount === 0) {
            throw new NotFoundError('Lagu tidak ditemukan');
        }
        
        return result.rows[0];
    }

    async putSongById(id, {title, year, performer, genre, duration,}){

        const query = {

          text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5 WHERE id = $6 RETURNING id',
          values: [title, year, performer, genre, duration, id],

        };
     
        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
          }


    }

    async deleteSongById(id){

        const query = {

            text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
            values: [id],

          };
       
          const result = await this._pool.query(query);
       
          if (result.rowCount === 0) {
            throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
          }


    }


}

module.exports = SongsService;