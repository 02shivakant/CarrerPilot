from django.db import models

class Job(models.Model):
    WORK_TYPE_CHOICES =[
        ('REMOTE', 'Remote'),
        ('HYBRID', 'Hybrid'),
        ('ONSITE', 'On-site'),
    ]
    title = models.CharField(max_length=200)
    company = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True)
    work_type = models.CharField(
        max_length=10,
        choices=WORK_TYPE_CHOICES,
        default='ONSITE'
    )
    description = models.TextField()
    required_skills = models.JSONField(default=list, blank=True)
    application_url = models.URLField(blank=True)
    is_active = models.BooleanField(default=True)
    posted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

