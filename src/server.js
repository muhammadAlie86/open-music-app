require('dotenv').config();
const ClientError = require('./exceptions/ClientError');

const Hapi = require("@hapi/hapi");
const Jwt = require('@hapi/jwt');

const albums = require('./api/albums');
const AlbumsService = require("./services/postgres/AlbumsService");
const AlbumValidator = require("./validator/albums");

const songs = require('./api/songs');
const SongsService = require("./services/postgres/SongsService");
const SongValidator = require('./validator/songs')

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UserValidator = require('./validator/users');

const playlists = require('./api/playlist');
const PlaylistsService = require('./services/postgres/PlaylistsService');
const PlaylistsValidator = require('./validator/playlists');

const playlistSongs = require('./api/playlistsongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongValidator = require('./validator/playlistsongs');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');



const init = async () => {

    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();
    const playlistsService = new PlaylistsService();
    const playlistsSongsService = new PlaylistSongsService();

    const server = Hapi.server({
        
      port: process.env.PORT,
      host: process.env.HOST,
      routes: {
          cors: {
            origin: ['*'],
          },
        },
      });

      await server.register([

        {

          plugin : Jwt,
        },

      ]);

      server.auth.strategy('musicsapp_jwt', 'jwt', {
        
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {

          aud: false,
          iss: false,
          sub: false,
          maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        
        },
        
        validate: (artifacts) => ({
          
          isValid: true,
          credentials: {
          
            id: artifacts.decoded.payload.id,
          
          },
        }),
      });
     
 
      await server.register([
        
        {
          plugin: albums,
          options: {
            
            service: albumsService,
            validator : AlbumValidator,

          },
        },
        {
          plugin: songs,
          options: {
            
            service:songsService,
            validator : SongValidator,

          },
        },
        {
          plugin: users,
          options: {
            
            service:usersService,
            validator : UserValidator,

          },
        },
        {
          plugin: authentications,
          options: {
            
            authenticationsService,
            usersService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator,
          
          },
        },
        {
          plugin: playlists,
          options: {
            
            service: playlistsService,
            validator : PlaylistsValidator,

          },
        },
        {
          plugin: playlistSongs,
          options: {
            playlistsSongsService: playlistsSongsService,
            playlistsService: playlistsService,
            songsService: songsService,
            validator : PlaylistSongValidator,

          },
        },
        
      ]);
      
      await server.start();
      console.log(`Server berjalan pada ${server.info.uri}`);

};

init();