FROM php:7.2-fpm
LABEL maintainer="tom@thepenzone.com"

# Installing dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    mysql-client \
    libpng-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    locales \
    zip \
    jpegoptim optipng pngquant gifsicle

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Installing extensions
RUN docker-php-ext-install pdo_mysql mbstring zip exif
RUN docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/
RUN docker-php-ext-install gd

# Installing composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy app data and set perms on storage dir
COPY . /application
COPY ./.env.production /application/.env

# Changing Workdir
WORKDIR /application

# Configure Laravel
RUN chmod -R o+w storage bootstrap/cache
RUN composer install --optimize-autoloader --no-dev
RUN php artisan key:generate && php artisan config:cache && php artisan route:cache
