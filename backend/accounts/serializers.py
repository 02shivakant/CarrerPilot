
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import StudentProfile


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(
        max_length=150,
        write_only=True
    )

    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            'username',
            'email',
            'password',
            'full_name'
        ]

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        StudentProfile.objects.create(
            user=user,
            full_name=full_name
        )

        return user

    def to_representation(self, instance):
        return {
            'username': instance.username,
            'email': instance.email,
            'full_name': instance.student_profile.full_name
        }


class StudentProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = StudentProfile
        fields = [
            'full_name',
            'graduation_year',
            'target_role',
            'preferred_location',
            'skills'
        ]
