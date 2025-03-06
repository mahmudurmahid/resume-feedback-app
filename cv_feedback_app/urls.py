from django.urls import path
from .views import (
    HomePage,
    TailorResumeView,
    ResumeUploadView,
    JobDescriptionUploadView,
    LatestFilesView,
    VersionHistoryView,
)

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('tailor-resume/', TailorResumeView.as_view(), name='tailor_resume'),
    path('upload/resume/', ResumeUploadView.as_view(), name='upload_resume'),
    path('upload/job-description/', JobDescriptionUploadView.as_view(), name='upload_job_description'),
    path('latest-files/', LatestFilesView.as_view(), name='latest_files'),
    path('versions/', VersionHistoryView.as_view(), name='version_history'),
]
