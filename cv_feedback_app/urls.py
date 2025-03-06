from django.urls import path
from .views import (
    HomePage,
    TailorResumeView,
    ResumeUploadView,
    JobDescriptionLibraryView,
    JobDescriptionUploadView,
    LatestFilesView,
    VersionHistoryView,
    DeleteVersionView,
    RestoreVersionView
)

urlpatterns = [
    path('', HomePage.as_view(), name='home'),
    path('job-descriptions/', JobDescriptionLibraryView.as_view(), name='job_description_library'),
    path('tailor-resume/', TailorResumeView.as_view(), name='tailor_resume'),
    path('upload/resume/', ResumeUploadView.as_view(), name='upload_resume'),
    path('upload/job-description/', JobDescriptionUploadView.as_view(), name='upload_job_description'),
    path('latest-files/', LatestFilesView.as_view(), name='latest_files'),
    path('versions/', VersionHistoryView.as_view(), name='version_history'),
    path('versions/<int:id>/delete/', DeleteVersionView.as_view(), name='delete_version'),
    path('versions/<int:id>/restore/', RestoreVersionView.as_view(), name='restore_version'),
]
