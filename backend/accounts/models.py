
from django.db import models
from django.contrib.auth.models import User


class StudentProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    full_name = models.CharField(max_length=150)
    graduation_year = models.PositiveIntegerField(
        null=True,
        blank=True
    )
    target_role = models.CharField(max_length=100, blank=True)
    preferred_location = models.CharField(max_length=100, blank=True)
    skills = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name
