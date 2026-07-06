<?php
/**
 * ARQON - THE VAULT | Utilitário JWT (JSON Web Token)
 * Finalidade: Emissão e Validação de tokens de acesso stateless.
 */

declare(strict_types=1);

// Certifique-se de usar um namespace compatível com sua estrutura, ou remova se não estiver usando autoloader PSR-4 ainda.
// namespace App\Utils; 

class JWT {
    
    /**
     * Converte base64 padrão para Base64Url (Seguro para URLs e Headers HTTP)
     */
    private static function base64UrlEncode(string $data): string {
        return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
    }

    /**
     * Decodifica de Base64Url de volta para string original
     */
    private static function base64UrlDecode(string $data): string {
        $padding = strlen($data) % 4;
        $paddingData = $padding !== 0 ? $data . str_repeat('=', 4 - $padding) : $data;
        return base64_decode(str_replace(['-', '_'], ['+', '/'], $paddingData));
    }

    /**
     * GERA O TOKEN (Encode)
     * Recebe os dados do usuário (Payload) e devolve a string JWT assinada.
     */
    public static function encode(array $payload): string {
        // 1. Header: Define o tipo e o algoritmo de criptografia (HMAC SHA-256)
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        
        // 2. Payload: Injeta as datas de emissão (iat) e expiração (exp) baseadas no config.php
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRATION;

        // Codifica Header e Payload
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode(json_encode($payload));

        // 3. Signature (Assinatura): O coração da segurança. Usa a chave secreta do config.php
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
        $base64UrlSignature = self::base64UrlEncode($signature);

        // Retorna o token completo (Header.Payload.Signature)
        return $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;
    }

    /**
     * VALIDA O TOKEN (Decode)
     * Recebe o token do Frontend, verifica se é autêntico, se não expirou, e devolve os dados.
     */
    public static function decode(string $token): ?array {
        // Divide o token em suas 3 partes
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null; // Formato inválido
        }

        [$base64UrlHeader, $base64UrlPayload, $base64UrlSignature] = $parts;

        // 1. Recalcula a assinatura com os dados recebidos + a NOSSA chave secreta
        $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, JWT_SECRET_KEY, true);
        $validSignature = self::base64UrlEncode($signature);

        // 2. Verifica se a assinatura bate (Se não bater, alguém tentou forjar o token)
        if (!hash_equals($validSignature, $base64UrlSignature)) {
            return null; // Assinatura inválida (Hack attempt!)
        }

        $payload = json_decode(self::base64UrlDecode($base64UrlPayload), true);

        // 3. Verifica se o token já expirou
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return null; // Token expirado (Sessão acabou)
        }

        // Tudo certo! Retorna os dados do usuário limpos.
        return $payload;
    }
}