from django.shortcuts import render
from django.views.generic import TemplateView

import os
import openai
import docx
import PyPDF2
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, permissions
from rest_framework.permissions import IsAuthenticated
from .models import Resume, JobDescription
from .serializers import ResumeSerializer, JobDescriptionSerializer

openai.api_key = os.environ.get("OPENAI_API_KEY")

# Create your views here.
class HomePage(TemplateView):
    template_name = 'index.html'

class TailorResumeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text')
        job_description = request.data.get('job_description')

        if not resume_text or not job_description:
            return Response({'error': 'Both resume and job description are required.'}, status=400)

        prompt = f"""
        You are an expert resume editor. Tailor the following resume to perfectly match the given job description.
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        Provide the improved, professional resume below:
        """

        try:
            openai.api_key = os.environ.get("OPENAI_API_KEY")

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )

            tailored_resume = response.choices[0].message.content.strip()
            return Response({'tailored_resume': tailored_resume})

        except Exception as e:
            return Response({"error": str(e)}, status=500)
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get('resume_text')
        job_description = request.data.get('job_description')

        if not resume_text or not job_description:
            return Response({'error': 'Both resume and job description are required.'}, status=400)

        prompt = f"""
        You are an expert resume editor. Tailor the following resume to perfectly match the given job description.
        
        Job Description:
        {job_description}
        
        Resume:
        {resume_text}
        
        Provide the improved, professional resume below:
        """

        openai.api_key = os.environ.get("OPENAI_API_KEY")

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )

        tailored_resume = response.choices[0].message.content.strip()

        return Response({'tailored_resume': tailored_resume})
    permission_classes = [IsAuthenticated]

    def post(self, request):
        resume_text = request.data.get("resume")
        job_description = request.data.get("job_description")

        if not resume_text or not job_description:
            return Response({"error": "Missing resume or job description."}, status=400)

        try:
            openai.api_key = os.environ.get("OPENAI_API_KEY")
            prompt = f"""
            Tailor the following resume to match this job description.

            Resume:
            {resume_text}

            Job Description:
            {job_description}

            Provide the improved resume:
            """

            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
            )

            tailored_resume = response.choices[0].message.content.strip()
            return Response({"tailored_resume": tailored_resume})

        except Exception as e:
            return Response({"error": str(e)}, status=500)

class ResumeUploadView(generics.CreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class JobDescriptionUploadView(generics.CreateAPIView):
    serializer_class = JobDescriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

def extract_text(file):
    if file.name.endswith(".pdf"):
        reader = PyPDF2.PdfReader(file)
        return "".join(page.extract_text() for page in reader.pages)
    elif file.name.endswith(".docx"):
        doc = docx.Document(file)
        return "\n".join(p.text for p in doc.paragraphs)
    return ""

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
