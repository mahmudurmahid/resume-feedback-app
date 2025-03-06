from django.db import models
from django.contrib.auth.models import User
from cloudinary_storage.storage import RawMediaCloudinaryStorage

# Create your models here
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='resumes/', storage=RawMediaCloudinaryStorage())
    uploaded_at = models.DateTimeField(auto_now_add=True)

class JobDescription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file = models.FileField(upload_to='job_descriptions/', storage=RawMediaCloudinaryStorage(), blank=True, null=True)
    pasted_text = models.TextField(blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

class TailoredResumeVersion(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tailored_resume = models.TextField()
    job_description = models.ForeignKey(JobDescription, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Version {self.id} by {self.user.username} on {self.created_at.strftime('%Y-%m-%d %H:%M')}"
