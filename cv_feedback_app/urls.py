from .import views
from django.urls import path
from .views import TailorResumeView

urlpatterns = [
    path('', views.HomePage.as_view(), name='home'),
    path('tailor-resume/', TailorResumeView.as_view(), name='tailor_resume'),
]