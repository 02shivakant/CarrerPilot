from rest_framework import generics , serializers
from rest_framework.permissions import IsAuthenticated
from .models import Resume
from .serializers import ResumeSerializer
from .utils import extract_resume_text

class ResumeListCreateView(generics.ListCreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        resume = serializer.save(user=self.request.user)

        try:
            resume.extracted_text = extract_resume_text(resume.file_path)
            resume.save(update_fields=['extracted_text'])
        except(ValueError , OSError ) as error:
            resume.delete()
            raise serializers.ValidationError({
                'file': str(error)
            })
        
class ResumeDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


