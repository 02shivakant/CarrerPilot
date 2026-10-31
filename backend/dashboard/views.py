
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from job_applications.models import Application


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        applications = Application.objects.filter(
            user=request.user
        )

        recent_applications = applications.select_related(
            'job'
        ).order_by('-created_at')[:5]

        data = {
            'total_applications': applications.count(),

            'saved': applications.filter(
                status='SAVED'
            ).count(),

            'applied': applications.filter(
                status='APPLIED'
            ).count(),

            'shortlisted': applications.filter(
                status='SHORTLISTED'
            ).count(),

            'interviews': applications.filter(
                status='INTERVIEW'
            ).count(),

            'rejected': applications.filter(
                status='REJECTED'
            ).count(),

            'selected': applications.filter(
                status='SELECTED'
            ).count(),

            'recent_applications': [
                {
                    'id': application.id,
                    'job_title': application.job.title,
                    'company': application.job.company,
                    'status': application.status,
                    'created_at': application.created_at,
                }
                for application in recent_applications
            ]
        }

        return Response(data)

