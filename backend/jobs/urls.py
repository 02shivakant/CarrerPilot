
from django.urls import path
from .views import (
    JobListView,
    JobDetailView,
    JobCreateView,
    JobUpdateView,
)

urlpatterns = [
    path('', JobListView.as_view(), name='job-list'),
    path('create/', JobCreateView.as_view(), name='job-create'),
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),
    path('<int:pk>/update/', JobUpdateView.as_view(), name='job-update'),
]
