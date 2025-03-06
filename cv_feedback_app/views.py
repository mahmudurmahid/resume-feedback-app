from django.shortcuts import render
from django.views.generic import TemplateView
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

import os
import docx
import PyPDF2
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status, serializers
from rest_framework.permissions import IsAuthenticated
from .models import Resume, JobDescription, TailoredResumeVersion
from .serializers import (
    ResumeSerializer,
    JobDescriptionSerializer,
    TailoredResumeVersionSerializer,
)


# ✅ Load OpenAI API key
openai.api_key = os.environ.get("OPENAI_API_KEY")


# ✅ Homepage
class HomePage(TemplateView):
    template_name = 'index.html'


# ✅ Tailor Resume View
class TailorResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print("Received data:", request.data)
        resume_text = request.data.get("resume_text")
        job_description = request.data.get("job_description")

        if not resume_text or not job_description:
            return Response({"error": "Missing resume or job description."}, status=400)

        try:
            print("Using OpenAI Key:", openai.api_key)

            prompt = f"""
            You are an expert resume editor. Tailor the following resume to perfectly match the given job description.

            Job Description:
            {job_description}

            Resume:
            {resume_text}

            Provide the improved, professional resume below:
            """

            response = openai.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )

            tailored_resume = response.choices[0].message.content.strip()

            # ✅ Save tailored version to history
            TailoredResumeVersion.objects.create(
                user=request.user,
                tailored_resume=tailored_resume,
                job_description=JobDescription.objects.filter(user=request.user).last()
            )

            return Response({'tailored_resume': tailored_resume})

        except Exception as e:
            print("Error from OpenAI:", str(e))
            return Response({"error": str(e)}, status=500)


# ✅ Resume Upload View
class ResumeUploadView(generics.CreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Job Description Upload View
class JobDescriptionUploadView(generics.CreateAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# ✅ Extract Text from Files
def extract_text(file):
    if file.name.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file)
        return "".join(page.extract_text() for page in reader.pages)
    elif file.name.endswith(".docx"):
        doc = docx.Document(file)
        return "\n".join(p.text for p in doc.paragraphs)
    return ""


# ✅ Latest Uploaded Files View
class LatestFilesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        resume = Resume.objects.filter(user=request.user).last()
        job_desc = JobDescription.objects.filter(user=request.user).last()

        resume_text = extract_text(resume.file) if resume else ""
        if job_desc:
            job_desc_text = extract_text(job_desc.file) if job_desc.file else job_desc.pasted_text
        else:
            job_desc_text = ""

        return Response({
            "resume_text": resume_text,
            "job_description": job_desc_text,
        })


# ✅ Version History View
class VersionHistoryView(generics.ListAPIView):
    serializer_class = TailoredResumeVersionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return TailoredResumeVersion.objects.filter(user=self.request.user).order_by('-created_at')

# Delete a version
class DeleteVersionView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = TailoredResumeVersion.objects.all()
    lookup_field = 'id'

    def delete(self, request, *args, **kwargs):
        version = self.get_object()
        if version.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        version.delete()
        return Response({"message": "Version deleted"}, status=status.HTTP_204_NO_CONTENT)

# Restore a version
class RestoreVersionView(generics.RetrieveAPIView):
    serializer_class = TailoredResumeVersionSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = TailoredResumeVersion.objects.all()
    lookup_field = 'id'

    def get(self, request, *args, **kwargs):
        version = self.get_object()
        if version.user != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        return Response({
            "tailored_resume": version.tailored_resume
        })

# Job Description Library View
class JobDescriptionLibraryView(generics.ListAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobDescription.objects.filter(user=self.request.user).order_by('-uploaded_at')

# Delete Account View
class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted."}, status=204)

# Change Password View
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    class PasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField(required=True)
        new_password = serializers.CharField(required=True)

    def post(self, request):
        serializer = self.PasswordSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"error": "Old password is incorrect."}, status=400)
            try:
                validate_password(serializer.validated_data['new_password'], user)
            except serializers.ValidationError as e:
                return Response({"error": e.messages}, status=400)
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"message": "Password changed successfully."})
        return Response(serializer.errors, status=400)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"email": request.user.email})