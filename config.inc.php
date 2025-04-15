<?php
/* Configuración de PHPMyAdmin */
$cfg['Servers'][1]['host'] = 'kuki_mysql'; // Asegúrate de que el host es correcto (nombre del servicio MySQL en Docker)
$cfg['Servers'][1]['auth_type'] = 'cookie';
$cfg['Servers'][1]['user'] = 'root';
$cfg['Servers'][1]['password'] = 'root';

// Desactivar la opción de cookies seguras
$cfg['LoginCookieSecure'] = false;

/* Otras configuraciones que puedas necesitar */