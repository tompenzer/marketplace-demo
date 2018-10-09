# Marketplace Demo repository

The source for the marketplace demo repo hosted at
https://github.com/tompenzer/marketplace-demo. This is a demonstration of a
marketplace where users can add stores and list products with them, and users
can purchase those products. This project has a Laravel 5.7-based back-end
API with MySQL and Redis for data storage, a React/Redux front-end with
Passport-implemented OAuth2 authentication, and Docker managing the dev
environment.

The front-end design is inspired by the
https://github.com/mithunjmistry/ecommerce-React-Redux-Laravel project, though
little of its code remains intact; most aspects of the front-end architecture
have been refactored or rewritten, and the back-end only shares a few lines of
code.


## Installation

Development environment requirements:
- [Git](https://git-scm.com/) - on Mac, you will be prompted to install the CLI
dev tools including `git` upon attempting to `git clone` in the command below if
you don't already have it installed.
- [Docker](https://store.docker.com/search?offering=community&type=edition) - On
Mac, you can download the installer directly without needing a Docker account
[here](https://download.docker.com/mac/stable/Docker.dmg). For Windows, it's
available [here](https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe).

Clone the repo and start up the development environment using the terminal on
your local machine:
```
$ git clone git@github.com:tompenzer/marketplace-demo.git
$ cd marketplace-demo
$ ./startup.sh
```

Once the entire startup.sh process is complete, you will need to generate an
OAuth client for password-based authentication by running the following command,
hitting the 'enter' key when prompted for a client name:
```
$ docker-compose run --rm marketplace-server php artisan passport:client --password
```

You should be given a client ID and a client secret, both of which need to be
copied into the `.env` file that got created by the startup script in the
project root, in the `PASSWORD_CLIENT_ID` and `PASSWORD_CLIENT_SECRET` fields,
respectively.

The commands run by the `startup.sh` script might be useful to run individually
as needed, so I'll copy them here for reference:
```
$ cp .env.example .env
$ docker-compose run --rm --no-deps marketplace-server composer install
$ docker-compose run --rm --no-deps marketplace-server php artisan key:generate
$ docker-compose up -d
$ docker-compose run --rm node-server yarn install
$ docker-compose run --rm node-server yarn run dev
$ docker-compose run --rm marketplace-server php artisan migrate --seed
$ docker-compose run --rm marketplace-server php artisan passport:install
$ docker-compose run --rm marketplace-server ./vendor/bin/phpunit
```

## Note - potential sql error
If you get a DB PDO error at the end of the startup process, try connecting to
the docker mysql image server with any SQL client (i.e. Sequel Pro if you're on
a Mac), with the following credentials:
```
host: 0.0.0.0
port: 3306
user: root
pass: secret
```

And then try running the database migrations manually:
```
$ docker-compose run --rm marketplace-server php artisan migrate --seed
```

This will create the default admin user that you can use to sign in.


## Usage

The dev env site should be accessible in your web browser at the following URL:

http://localhost:8000

You can register your own user account, or use the default admin account
credentials to log in:
```
Email: admin@example.com
Password: admin
```


## Testing

To run the testing suite, run the following command:
```
$ docker-compose run --rm marketplace-server ./vendor/bin/phpunit
```
These tests are run automatically at the end of the `startup.sh` script.


## Stopping the dev environment

To have docker take down the server container, wipe the built docker images, and
erase the database cache, ensuring a fresh build next time, run the following
command from inside the project directory:
```
$ docker-compose down
$ rm -rf storage/tmp/db
```


## Production build

If you pass the word `production` as an argument to `startup.sh`, it'll build
the front-end in production mode and skip DB migrations when initializing the
environment:
```
$ ./startup.sh production
```

If you've already got the development environment running, you can skip the
environment startup and directly run the production front-end build with the
following command:
```
$ docker-compose run --rm node-server yarn run prod
```


## Cleaning up Docker remnants

After running `docker-compose down` and shutting down this environment, Docker
will leave a lot of cached data in various obscure parts of the filesystem,
using up your storage. To get Docker to purge ALL THE THINGS, run the following
commands:
```
$ docker system prune -a
$ docker volume rm $(docker volume ls -qf dangling=true)
```


## License

The Marketplace Demo project is open-sourced software licensed under the
[MIT license](https://opensource.org/licenses/MIT).
