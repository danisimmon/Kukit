<?php

use PHPUnit\Framework\TestCase;

// filepath: c:\xampp\htdocs\kukit\backend\test\listaCompraTest.php

class listaCompraTest extends TestCase
{
    private $baseUrl = 'http://nginx/api/area_privada/listaCompra/';
    private $loginUrl = 'http://nginx/api/login/login.php';
    private $testUser;
    private $cookieFile;

    protected function setUp(): void
    {
        // Generar correo único para cada test
        $this->testUser = [
            'usuario' => 'TestListaCompra',
            'correo' => 'testphpunit_listacompra_' . uniqid() . '@example.com',
            'password' => 'password123'
        ];
        // Registrar usuario de test
        $registroUrl = 'http://nginx/api/login/registro/registro.php';
        $data = [
            'usuario' => $this->testUser['usuario'],
            'correo' => $this->testUser['correo'],
            'password' => $this->testUser['password']
        ];
        $this->cookieFile = tempnam(sys_get_temp_dir(), 'cookie');
        $this->curlPost($registroUrl, $data);

        // Login para obtener sesión
        $loginData = [
            'correo' => $this->testUser['correo'],
            'password' => $this->testUser['password']
        ];
        $this->curlPost($this->loginUrl, $loginData);
    }

    protected function tearDown(): void
    {
        // Limpia los productos de test y el usuario
        $mysqli = new mysqli('kukit_mysql', 'root', 'root', 'kukit');
        $correo = $this->testUser['correo'];
        $mysqli->query("DELETE FROM listacompra_productos WHERE id_usuario IN (SELECT id FROM usuario WHERE email = '$correo')");
        $mysqli->query("DELETE FROM usuario WHERE email = '$correo'");
        if (file_exists($this->cookieFile)) {
            unlink($this->cookieFile);
        }
    }

    private function curlPost($url, $data)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_COOKIEJAR, $this->cookieFile);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookieFile);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    private function curlGet($url)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_COOKIEFILE, $this->cookieFile);
        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    public function testInsertarProductoListaCompra()
    {
        $data = [
            'nombre' => 'Manzanas',
            'cantidad' => '2',
            'unidad' => 'kg'
        ];
        $response = $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);

        $this->assertTrue($response['success'] === "true");
        $this->assertEquals('Producto agregado a la lista de compra', $response['message']);
    }

    public function testInsertarProductoDuplicado()
    {
        $data = [
            'nombre' => 'Leche',
            'cantidad' => '1',
            'unidad' => 'litro'
        ];
        // Primer inserción
        $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);
        // Segundo intento (duplicado)
        $response = $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);

        $this->assertTrue($response['success'] === "false");
        $this->assertEquals('Este producto ya está en la lista de compra', $response['message']);
    }

    public function testInsertarProductoCamposObligatorios()
    {
        $data = [
            'nombre' => '',
            'cantidad' => '',
            'unidad' => ''
        ];
        $response = $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);

        $this->assertTrue($response['success'] === "false");
        $this->assertEquals('Todos los campos son obligatorios.', $response['message']);
    }

    public function testObtenerListaCompra()
    {
        // Insertar un producto primero
        $data = [
            'nombre' => 'Pan',
            'cantidad' => '3',
            'unidad' => 'unidades'
        ];
        $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);

        $response = $this->curlGet($this->baseUrl . 'getListaCompra.php');

        $this->assertEquals('success', $response['status']);
        $this->assertEquals('Lista de compra recibida correctamente', $response['message']);
        $this->assertIsArray($response['data']);
        $this->assertNotEmpty($response['data']);
        $this->assertTrue(
            array_reduce($response['data'], function($carry, $item) {
                return $carry || $item['nombre'] === 'Pan';
            }, false)
        );
    }

    public function testEliminarProductoListaCompra()
    {
        // Insertar producto
        $data = [
            'nombre' => 'Huevos',
            'cantidad' => '12',
            'unidad' => 'unidades'
        ];
        $this->curlPost($this->baseUrl . 'insertListaCompra.php', $data);

        // Eliminar producto
        $deleteData = [
            'nombre' => 'Huevos',
            'cantidad' => '12'
        ];
        $response = $this->curlPost($this->baseUrl . 'deleteListaCompra.php', $deleteData);

        $this->assertTrue($response['success'] === "true");
        $this->assertEquals('Producto eliminado de la lista de compra', $response['message']);
    }
}