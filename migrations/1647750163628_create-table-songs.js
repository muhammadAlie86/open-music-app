/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('songs', {
      id: {
        type: 'VARCHAR(50)',
        primaryKey: true
      },
      title: {
        type: 'TEXT',
        notNull: true
      },
      year: {
        type: 'INT',
        notNull: true
      },
      performer: {
        type: 'TEXT',
        notNull: true
      },
      genre: {
        type: 'TEXT',
        notNull: true
      },
      duration: {
        type: 'INT',
        notNull: true
      }, 
      inserted_at: {
        type: 'TEXT',
        notNull: true,
      },
      updated_at: {
        type: 'TEXT',
        notNull: true,
      },
      album_id: {
        type: 'VARCHAR(50)',
        notNull: false,
      },
     
    });
    
  pgm.addConstraint('songs', 'fk_songs.album_id_albums.id', 'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE');
  };
  
  exports.down = pgm => {
    pgm.dropTable('songs')
  };
