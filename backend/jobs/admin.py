
from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'company',
        'location',
        'work_type',
        'is_active',
        'posted_at',
    )
    list_filter = ('work_type', 'is_active')
    search_fields = ('title', 'company', 'location')
