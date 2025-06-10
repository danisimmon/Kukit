<?php

use PHPUnit\Framework\TestCase;

class crearUsuarioTest extends TestCase
{
    private $url = 'http://nginx/api/login/registro/registro.php';

    protected function tearDown(): void
    {
        // Limpia los usuarios de test
        $mysqli = new mysqli('kukit_mysql', 'root', 'root', 'kukit');
        $mysqli->query("DELETE FROM usuario WHERE email LIKE 'testphpunit_%@example.com'");
    }

    private function postRegistro($usuario, $correo, $password)
    {
        $data = [
            'usuario' => $usuario,
            'correo' => $correo,
            'password' => $password
        ];
        $options = [
            'http' => [
                'header'  => "Content-type: application/json\r\n",
                'method'  => 'POST',
                'content' => json_encode($data),
            ],
        ];
        $context  = stream_context_create($options);
        $result = @file_get_contents($this->url, false, $context);
        if ($result === false) {
            $error = error_get_last();
            throw new \Exception("Error al llamar al endpoint: " . $error['message']);
        }
        return json_decode($result, true);
    }

    public function testRegistroExitoso()
    {
        $usuario = 'TestUser';
        $correo = 'testphpunit_' . uniqid() . '@example.com';
        $password = 'password123';

        $resultado = $this->postRegistro($usuario, $correo, $password);

        $this->assertTrue($resultado['success']);
        $this->assertEquals('Registro exitoso', $resultado['message']);
    }

    public function testRegistroCamposObligatorios()
    {
        $usuario = 'TestUser';
        $correo = '';
        $password = '';

        $resultado = $this->postRegistro($usuario, $correo, $password);

        $this->assertFalse($resultado['success']);
        $this->assertEquals('Todos los campos son obligatorios.', $resultado['message']);
    }

    public function testRegistroCorreoDuplicado()
    {
        $usuario = 'TestUser';
        $correo = 'testphpunit_' . uniqid() . '@example.com';
        $password = 'password123';

        // Primer registro
        $resultado1 = $this->postRegistro($usuario, $correo, $password);
        $this->assertTrue($resultado1['success']);

        // Segundo registro con el mismo correo
        $resultado2 = $this->postRegistro($usuario, $correo, $password);
        $this->assertFalse($resultado2['success']);
        $this->assertEquals('Este correo ya está en uso', $resultado2['message']);
    }
}
