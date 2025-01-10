<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class AuthenticationController extends AbstractController
{
    #[Route(path: '/api/me', name: 'me_jwt', methods: ["GET"])]
    public function me(): JsonResponse
    {
        $me = $this->getUser();
        if (!$me instanceof User) {
            return $this->json(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }
        $dataMe = [
            'userIdentifier	' => $me->getUserIdentifier(),
            'roles' => $me->getRoles(),
        ];

        return $this->json($dataMe);
    }
}
