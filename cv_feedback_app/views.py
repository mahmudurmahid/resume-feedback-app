from django.shortcuts import render
from django.views.generic import TemplateView
import os
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

openai.api_key = os.environ.get("OPENAI_API_KEY")

# Create your views here.
class HomePage(TemplateView):
    template_name = 'index.html'

class TailorResumeView(APIView):
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