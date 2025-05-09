FROM php:8.1-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    libssl-dev \
    pkg-config \
    git \
    && docker-php-ext-install pdo_mysql zip mysqli

# Instalar MongoDB con soporte SSL
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Crear el directorio del proyecto
WORKDIR /var/www/html

# Copiar el código fuente (esto es clave)
COPY . .

# Instalar PHPMailer como dependencia del proyecto
RUN composer install || composer init --name="kukit/app" --require="phpmailer/phpmailer:^6.8" --no-interaction && composer install
