
from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source='job.title',
        read_only=True
    )
    company = serializers.CharField(
        source='job.company',
        read_only=True
    )

    class Meta:
        model = Application
        fields = [
            'id',
            'job',
            'job_title',
            'company',
            'status',
            'applied_at',
            'notes',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'job_title',
            'company',
            'created_at',
            'updated_at',
        ]
