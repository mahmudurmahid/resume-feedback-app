from rest_framework import serializers
from .models import Resume, JobDescription, TailoredResumeVersion


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'user', 'file', 'uploaded_at']
        read_only_fields = ['id', 'user', 'uploaded_at']

class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = ['id', 'user', 'file', 'pasted_text', 'uploaded_at']
        read_only_fields = ['id', 'user', 'uploaded_at']

    def validate(self, data):
        if not data.get('file') and not data.get('pasted_text'):
            raise serializers.ValidationError(
                "You must provide either a file or pasted text."
            )
        return data

class TailoredResumeVersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TailoredResumeVersion
        fields = ['id', 'tailored_resume', 'job_description', 'created_at']