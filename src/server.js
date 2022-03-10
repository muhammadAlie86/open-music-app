require('dotenv').config();

const Hapi = require("@hapi/hapi");
const albums = require('./api/albums');
const AlbumsService = require("./services/postgres/AlbumsService");
const AlbumValidator = require("./validator/albums");

const songs = require('./api/songs');
const SongsService = require("./services/postgres/SongsService");
const SongValidator = require('./validator/songs')

const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validator/users');


const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');


const init = async () => {

    const albumsService = new AlbumsService();
    const songsService = new SongsService();
    const usersService = new UsersService();
    const authenticationsService = new AuthenticationsService();

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
            validator : UsersValidator,

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
        }
      ]);
     
      await server.start();
      console.log(`Server berjalan pada ${server.info.uri}`);

};

init();