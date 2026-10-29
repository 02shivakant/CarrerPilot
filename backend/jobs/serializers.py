
from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = [
            'id',
            'title',
            'company',
            'location',
            'work_type',
            'description',
            'required_skills',
            'application_url',
            'is_active',
            'posted_at',
        ]
        read_only_fields = ['id', 'posted_at']

