
# Node.js source
FROM node:22-bookworm-slim AS node

# Stage 1: Build frontend (PHP + Node.js)
FROM php:8.4-cli-bookworm AS frontend

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libicu-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring bcmath intl zip gd pcntl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=node /usr/local/ /usr/local/

COPY . .

RUN composer install --no-interaction --prefer-dist
RUN npm ci
RUN npm run build

# Stage 2: Production application
FROM php:8.4-cli-bookworm AS application

WORKDIR /var/www/html

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libicu-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libonig-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql mbstring bcmath intl zip gd pcntl opcache \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts

COPY --from=frontend /var/www/html/public/build ./public/build

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 8080

CMD php artisan serve --host=0.0.0.0 --port=${PORT:-8080}
