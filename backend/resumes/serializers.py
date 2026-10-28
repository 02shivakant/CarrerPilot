from rest_framework import serializers
from .model import Resume

class ResumeSerializer(serializers.ModelSerializers):
    class Meta:
        model = Resume
        fields = [ 
            'id',
            'title',
            'file',
            'extracted_text',
            'uploaded_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'extracted_text',
            'uploaded_at',
            'updated_at',
        ]
