FROM php:8.1-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    libssl-dev \    
    pkg-config \         
    && docker-php-ext-install pdo_mysql zip

# Instalar MongoDB con soporte SSL
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www/html
