/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    
    pgm.createTable('playlistsongs',{

        songId : {
            
            type: 'VARCHAR(50)',
            primaryKey: true,

        },
    });

};

exports.down = pgm => {

    pgm.dropTable('playlistsongs');
};
