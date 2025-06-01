FROM php:8.1-fpm

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    libssl-dev \
    pkg-config \
    git \
    zip \
    && docker-php-ext-install pdo_mysql zip mysqli

# Instalar MongoDB con soporte SSL
RUN pecl install mongodb && docker-php-ext-enable mongodb

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# Aumentar timeout de Composer y desactivar límite de memoria
RUN composer config --global process-timeout 900

# Crear el directorio del proyecto
WORKDIR /var/www/html

# Copiar el código fuente del proyecto
COPY . .

# Instalar dependencias PHP, incluyendo Google Client
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --prefer-dist --no-dev --optimize-autoloader || \
    composer init --name="kukit/app" --require="phpmailer/phpmailer:^6.8" --require="google/apiclient:^2.18" --no-interaction && \
    COMPOSER_MEMORY_LIMIT=-1 composer install --no-interaction --prefer-dist --no-dev --optimize-autoloader

# Optimizar el autoloader
RUN composer dump-autoload -o

# Exponer puerto por si usas este contenedor directamente
EXPOSE 9000

# Iniciar PHP-FPM por defecto
CMD ["php-fpm"]