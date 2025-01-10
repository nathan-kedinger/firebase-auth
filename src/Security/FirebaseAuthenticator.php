<?php

namespace App\Security;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Exception\AuthenticationException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\Passport\Badge\UserBadge;
use Symfony\Component\Security\Http\Authenticator\Passport\Passport;
use Symfony\Component\Security\Http\Authenticator\Passport\SelfValidatingPassport;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

/**
 * @see https://symfony.com/doc/current/security/custom_authenticator.html
 */
class FirebaseAuthenticator extends AbstractAuthenticator
{
    private const GOOGLE_OAUTH2_CERTIFICATES_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    /**
     * Called on every request to decide if this authenticator should be
     * used for the request. Returning `false` will cause this authenticator
     * to be skipped.
     */
    public function supports(Request $request): ?bool
    {
        // Récupération directe des headers avec Apache. Récupération header avec la méthode symfony ne fonctionne pas
        $headers = apache_request_headers();
        if (isset($headers['authorization'])) {
            return true;
        }
        return false;
    }

    public function authenticate(Request $request): Passport
    {

        $headers = apache_request_headers();
        if (!isset($headers['authorization'])) {
            throw new CustomUserMessageAuthenticationException('No API token provided');
        }

        $authHeader = $headers['authorization'];
        $token = str_replace('Bearer ', '', $authHeader);

        try {
            // Récupérer les clés publiques de Firebase
            $keys = json_decode(file_get_contents(self::GOOGLE_OAUTH2_CERTIFICATES_URL), true);

            // Extraire l'ID de la clé (kid) du header du token JWT
            $decodedHeader = JWT::jsonDecode(JWT::urlsafeB64Decode(explode('.', $token)[0]));
            $kid = $decodedHeader->kid;

            if (!isset($keys[$kid])) {
                throw new CustomUserMessageAuthenticationException('Invalid API token.');
            }

            $publicKey = $keys[$kid];
            $decoded = JWT::decode($token, new Key($publicKey, 'RS256'));

            if ($decoded->exp < time()) {
                throw new CustomUserMessageAuthenticationException('Token has expired.');
            }

            if (!str_starts_with($decoded->iss, 'https://securetoken.google.com/')) {
                throw new CustomUserMessageAuthenticationException('Invalid issuer.');
            }

            $uid = $decoded->user_id ?? $decoded->sub;
            if (!$uid) {
                throw new CustomUserMessageAuthenticationException('Invalid API token: UID not found.');
            }

            $email = $decoded->email ?? null;

            return new SelfValidatingPassport(
                new UserBadge($uid, function ($userIdentifier) use ($email) {
                    $user = $this->entityManager->getRepository(User::class)->findOneBy(['firebaseUid' => $userIdentifier]);
                    if (!$user) {
                        $user = new User();
                        $user->setFirebaseUid($userIdentifier);
                        $user->setRoles(["ROLE_USER"]);
                        $user->setEmail($email);
                        $this->entityManager->persist($user);
                        $this->entityManager->flush();
                    }
                    return $user;
                })
            );
        } catch (\Exception $e) {
            throw new CustomUserMessageAuthenticationException($e);
        }
    }

    public function onAuthenticationSuccess(Request $request, TokenInterface $token, string $firewallName): ?Response
    {
        // on success, let the request continue
        return null;
    }

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        $data = [
            // you may want to customize or obfuscate the message first
            'message' => strtr($exception->getMessageKey(), $exception->getMessageData()),

            // or to translate this message
            // $this->translator->trans($exception->getMessageKey(), $exception->getMessageData())
        ];

        return new JsonResponse($data, Response::HTTP_UNAUTHORIZED);
    }

    // public function start(Request $request, AuthenticationException $authException = null): Response
    // {
    //     /*
    //      * If you would like this class to control what happens when an anonymous user accesses a
    //      * protected page (e.g. redirect to /login), uncomment this method and make this class
    //      * implement Symfony\Component\Security\Http\EntryPoint\AuthenticationEntryPointInterface.
    //      *
    //      * For more details, see https://symfony.com/doc/current/security/experimental_authenticators.html#configuring-the-authentication-entry-point
    //      */
    // }
}
