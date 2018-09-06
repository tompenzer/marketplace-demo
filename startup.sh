cp .env.example .env

docker-compose run --rm --no-deps marketplace-server composer install

docker-compose run --rm --no-deps marketplace-server php artisan key:generate

docker-compose up -d

docker-compose run --rm --no-deps node-server yarn install

# If 'production' is passed as the first argument, build front-end in production
# mode and don't apply DB migrations/seeds.
if [ "$1" == 'production' ]; then
  docker-compose run --rm --no-deps node-server yarn run prod
else
  docker-compose run --rm --no-deps node-server yarn run dev

  # Putting DB ops after front-end build to give DB server time to spin up
  docker-compose run --rm marketplace-server php artisan migrate --seed

  docker-compose run --rm marketplace-server php artisan passport:install

  docker-compose run --rm marketplace-server ./vendor/bin/phpunit
fi
