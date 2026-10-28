from rest_framework import generics
from rest_framework.permissions import AllowAny , IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .models import StudentProfile

from . serializers import RegisterSerializer , StudentProfileSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

class LoginView(TokenObtainPairView):
    permission_class = [AllowAny]


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    queryset = User.objects.all()

    def get(self, request):
        profile, created = StudentProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.username
            }
        )

        serializer = StudentProfileSerializer(profile)
        return Response(serializer.data)

    def patch(self, request):
        profile, created = StudentProfile.objects.get_or_create(
            user=request.user,
            defaults={
                'full_name': request.user.username
            }
        )

        serializer = StudentProfileSerializer(
            profile,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

